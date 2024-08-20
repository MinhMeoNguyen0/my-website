"use client"
import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import Link from "next/link";
import { BsArrowRight, BsLinkedin } from "react-icons/bs";
import { HiDownload } from "react-icons/hi";
import { FaGithubSquare } from "react-icons/fa";
import { useSectionInView } from "@/lib/hooks";
import { useActiveSectionContext } from "@/context/active-section-context";


const Intro = () => {

  const { setActiveSection, setTimeOfLastClick } = useActiveSectionContext();
  const { ref } = useSectionInView("Home", 0.5);


  const img = "https://scontent-sea1-1.xx.fbcdn.net/v/t1.15752-9/451550207_1262037108509908_3395761706914001468_n.png?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_ohc=URkuHsh7U3wQ7kNvgE-0-VL&_nc_ht=scontent-sea1-1.xx&gid=AL2OL7dJIk7gmg3wR9yD8vj&oh=03_Q7cD1QHfiOgdK2JQ7qolmKzEZmlH2L2b5L6qAMtUCP_GpoeOEQ&oe=66CF78B9"
  return (
    <section ref={ref} id='home' className='mb-28 max-w-[50rem]
    text- sm:mb-0 scroll-mt-[100rem]'>
    <div className='flex items-center justify-center'>
      <div className='relative'>         
          <motion.div 
          initial={{ opacity: 0, scale:0 }}
          animate={{ opacity: 1, scale:1 }}
          transition={{ duration: 0.5, type:'tween', }}
          >
          <Image src={img} 
          alt="Minh's Potrait"
          priority={true}
          width={132}
          height={132}
          className='h-25 w-25 rounded-full object-cover border-[0.33rem] border-white'
          />
          <motion.span className='
          absolute  bottom-0 right-1 text-3xl'
          initial={{ opacity:0, scale:0 }} 
          animate={{ opacity:1, scale:1}}
          transition={{ duration: 0.7,type:'string', delay:0.2, }}>
            🫵👋
          </motion.span>
          </motion.div> 

      </div>
    </div>
    <motion.h1
        className="mb-10 mt-4 px-4 text-2xl font-medium !leading-[1.5] sm:text-3xl"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="font-bold">{"Hello, I'm Minh."}</span> {"I'm a"}{" "}
        <span className="font-bold">full-stack developer</span> with{" "}
        <span className="font-bold">1.5 years</span> of internship experience. I enjoy
        building <span className="italic">apps & and solving day-to-day & complex problems</span>. My current focus is{" "}
        <span className="underline">React (Next.js)</span> and <span className="underline">Node.js</span>.
      </motion.h1>

      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-2 px-4 text-lg font-medium "
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.1,
        }}
      >
        <Link
          href="#contact"
          className="group bg-gray-300 text-gray-700 px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 hover:bg-gray-950 active:scale-105 transition"
        >
          Contact me {" "}
          <BsArrowRight className="opacity-70 group-hover:translate-x-1 transition" />
        </Link>

        <a
          className="group bg-white px-7 py-3 flex items-center gap-2 rounded-full outline-none focus:scale-110 hover:scale-110 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10"
          href="https://drive.google.com/file/d/1sMBa3cv5RiViuDoBAhyod3B5gM1wS7Jn/view?usp=sharing"
          target="_blank" rel="noopener noreferrer"
        >
          Look at CV{" "}
          <HiDownload className="opacity-60 group-hover:translate-y-1 transition" />
        </a>
        <div className='flex gap-2'>
        <a
          className="bg-white p-4 text-gray-700 hover:text-gray-100 flex items-center gap-2 rounded-full focus:scale-[1.15] hover:scale-[1.15] active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://www.linkedin.com/in/minhnguyen161/"
          target="_blank"
        >
          <BsLinkedin />
        </a>
        <a
          className="bg-white p-4 text-gray-700 flex items-center gap-2 text-[1.35rem] rounded-full focus:scale-[1.15] hover:scale-[1.15] hover:text-gray-100 active:scale-105 transition cursor-pointer borderBlack dark:bg-white/10 dark:text-white/60"
          href="https://github.com/MinhNguyen161"
          target="_blank"
        >
          <FaGithubSquare />
        </a>
        </div>

    
      </motion.div>
    </section>
  )
}

export default Intro
