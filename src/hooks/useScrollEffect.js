import { useEffect } from 'react'

const useScrollEffect = (callback) => {
  useEffect(() => {
    const handleScroll = () => callback(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [callback])
}

export default useScrollEffect
