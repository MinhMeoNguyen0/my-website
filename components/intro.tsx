"use client"
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'


const Intro = () => {
  const img = "https://scontent-sea1-1.xx.fbcdn.net/v/t1.15752-9/451550207_1262037108509908_3395761706914001468_n.png?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_ohc=URkuHsh7U3wQ7kNvgE-0-VL&_nc_ht=scontent-sea1-1.xx&gid=AL2OL7dJIk7gmg3wR9yD8vj&oh=03_Q7cD1QHfiOgdK2JQ7qolmKzEZmlH2L2b5L6qAMtUCP_GpoeOEQ&oe=66CF78B9"
  return (
    <div className='flex items-center justify-center'>
      <div className='relative'>         
          <motion.div 
          initial={{ opacity: 0, scale:0 }}
          animate={{ opacity: 1, scale:1 }}
          transition={{ duration: 0.5 }}
          >
          
          <Image src={img} 
          alt="Minh's Potrait"
          priority={true}
          width={132}
          height={132}
          className='h-25 w-25 rounded-full object-cover border-[0.33rem] border-white'
          />
          <motion.span className='
          absolute  bottom-0 right-1  text-blue text-3xl'
          initial={{ opacity:0, scale:0 }} 
          animate={{ opacity:1, scale:1}}
          transition={{ duration: 0.7,type:'string', }}>
            🫵👋
          </motion.span>
          </motion.div> 

      </div>
    </div>
  )
}

export default Intro
