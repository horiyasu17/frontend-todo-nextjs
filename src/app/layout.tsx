'use client'
import '@mantine/core/styles.css'
import { ColorSchemeScript, MantineProvider } from '@mantine/core'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// @ts-ignore
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios'
import { useEffect } from 'react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  axios.defaults.withCredentials = true
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`)
      axios.defaults.headers.common['csrf-token'] = data.csrfToken
    }
    getCsrfToken()
  }, [])

  return (
    <html lang="en">
      <head>
        <title>Task Board</title>
        <ColorSchemeScript />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </body>
    </html>
  )
}
