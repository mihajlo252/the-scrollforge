import { createLazyFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createLazyFileRoute('/thanks')({
  component: Thanks,
})

function Thanks() {

  const navigation = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigation({ to: '/' })
    }, 10000)
  }, [navigation])

  return <div>Thanks for signing up! You will be redirected to the home page in 10 seconds. Please confirm your email.</div>
}