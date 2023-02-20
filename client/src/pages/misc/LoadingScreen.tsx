import { useState, useEffect } from 'react'
import { PulseLoader }  from "react-spinners"

function LoadingScreen() {
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    }, 8000)
  }, [])

  return (
    <div className='grid place-items-center w-screen h-screen'>
      <div>
        {
          <PulseLoader  color={"#DE2B2B"} loading={loading} size={25} />
        }
      </div>
    </div>
  )
}

export default LoadingScreen