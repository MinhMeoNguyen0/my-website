"use client";



import React from 'react'
import { motion }  from 'framer-motion'

type SectionHeadingProps = {
  children: React.ReactNode
}
export default function SectionHeading({
  children
} : SectionHeadingProps ) {
  return (
    <motion.h2 className="text-3xl font-medium capitalize mb-0 mt-8 sm:text-4xl"
    initial={{ opacity: 0, y: 100 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    >
      {children}
    </motion.h2>
  )
}
