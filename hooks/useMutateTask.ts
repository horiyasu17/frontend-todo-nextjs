import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import useStore from '../store'
import { EditedTask } from '../types'
import axios from 'axios'
import { Task } from '@prisma/client'

export const useMutateTask = () => {
  const queryClient = useQueryClient()
  const router = useRouter()
  const reset = useStore((state) => state.resetEditedTask)

  const createTaskMutation = useMutation(
    async (task: Omit<EditedTask, 'id'>) => {
      const { data } = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/todo`, task)
      return data
    },
    {
      onSuccess: (res) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTodos) {
          queryClient.setQueryData(['tasks'], [res, ...previousTodos])
        }
        reset()
      },
      onError: (err: any) => {
        reset()
        if (err.response.status === 401 || err.response.status === 403) router.push('/')
      },
    },
  )

  const updateTaskMutation = useMutation(
    async (task: EditedTask) => {
      const { data } = await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`, task)
      return data
    },
    {
      onSuccess: (res, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTodos) {
          queryClient.setQueryData(
            ['tasks'],
            previousTodos.map((task) => (task.id === res.id ? res : task)),
          )
        }
        reset()
      },
      onError: (error: any) => {
        reset()
        if (error.response.status === 401 || error.response.status === 403) router.push('/')
      },
    },
  )

  const deleteTaskMutation = useMutation(
    async (id: number) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`)
    },
    {
      onSuccess: (_, variables) => {
        const previousTodos = queryClient.getQueryData<Task[]>(['tasks'])
        if (previousTodos) {
          queryClient.setQueryData(
            ['tasks'],
            previousTodos.filter((task) => task.id !== variables),
          )
        }
        reset()
      },
      onError: (error: any) => {
        reset()
        if (error.response.status === 401 || error.response.status === 403) router.push('/')
      },
    },
  )

  return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}
