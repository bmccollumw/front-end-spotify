import { useState } from 'react'
import './index.css'; 


function Welcome() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1 className="text-3xl font-bold underline">Welcome</h1>
      <p>Here is a description on the web app and everything that it does.
        I anticipate this being about three sentences at most. 
        I would like there to be some catch that gets people interested in signing in with
        their spotify to improve the searchability of their spotify library</p>
    </>
  )
}

export default Welcome
