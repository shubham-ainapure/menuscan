import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { IoMdCall, IoMdRestaurant } from 'react-icons/io'
import { MdLocationPin } from 'react-icons/md'

function App() {
  const [count, setCount] = useState(Array(6).fill(''))

  return (
    <>
    <div className="container">
    <div className='restoCard'>
     <div className='cardItems'><IoMdRestaurant size='1.5em' color='rgb(239, 79, 95' className='icon'/> <span>ABC Resto</span></div>
     <div className='cardItems'><IoMdCall size='1.5em' color='rgb(239, 79, 95' className='icon'/> <span>9988776655</span></div>
     <div className='cardItems'><MdLocationPin size='1.5em' color='rgb(239, 79, 95' className='icon'/><span>shivaji nagar, pune</span></div>
     </div>
     <div className="categoryContainer">
       {count.map((item,index)=>(
        <div key={index}>1</div>
       ))}
     </div>
    </div>
    </>
  )
}

export default App
