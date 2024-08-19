'use client'
import React, { useEffect } from 'react'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { IconContext } from 'react-icons'
import './_loading.scss'
import { useRouter } from 'next/navigation'

function Loading() {
  // Declaring the router variable function
  const router = useRouter()

  useEffect(()=>{
    // Creating a timeout for navigation to homepage
    const timeout = setTimeout(()=>{
      router.push("/")
    }, 20000)
    // clearing the timeout on unmount
    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className='loading_container'>
      <IconContext.Provider value={{ className: 'loading_spinner' }}>
        <AiOutlineLoading3Quarters />
      </IconContext.Provider>
    </div>
  )
}

export default Loading