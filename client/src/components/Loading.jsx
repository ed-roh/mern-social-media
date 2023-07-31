import React from 'react'
import { useSelector } from 'react-redux'

const Loading = () => {
    const mode = useSelector(state=>state.authReducer.mode)
  return (
    <img 
          style={{display:"block", margin:"auto"}} 
          src={`assets/${mode==="light"?"loading_light.gif":"loading_dark.gif"}`} 
          width="40px" height="30px"></img>
  )
}

export default Loading
