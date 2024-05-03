import { useRouter } from 'next/navigation'
import axios from 'axios'
import { User } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

export const UseQueryUser = () => {
  const router = useRouter()
  const getUser = async () => {
    const { data } = await axios.get<Omit<User, 'hashedPassword'>>(
      `${process.env.NEXT_PUBLIC_API_URL}/user`,
    )
    return data
  }

  return useQuery<Omit<User, 'hashedPassword'>, Error>({
    queryKey: ['user'],
    queryFn: getUser,
    onError: (err: any) => {
      if (err.response.status === 404 || err.response.status === 403) router.push('/')
    },
  })
}
