import './globals.css'
import  Header from "@/components/header";


const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Minh | Portfolio',
  description: 'MInh Nguyen is a mern stack developer with 1.5 years of internship experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900 text-slate-50
      relative h-[3000px]`}>
        {/* <div className='bg-[#b9aeae] absolute top-[-6rem] right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[50rem] 
        sm:w-[38.75rem] sm:h-[38.75rem]'></div>
         <div className='bg-[#4c72f0] absolute top-[30rem] right-[1rem] h-[31.25rem] w-[31.25rem] rounded-full  blur-[60rem] 
        md:w-[12.75rem] md:h-[12.75rem]'></div> */}
        <div className="bg-[#fbe2e3] absolute top-[-6rem] -z-10 right-[11rem] h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem] sm:w-[68.75rem] dark:bg-[#946263]"></div>
        <div className="bg-[#dbd7fb] absolute top-[-1rem] -z-10 left-[-35rem] h-[31.25rem] w-[50rem] rounded-full blur-[10rem]  sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#676394]"></div>
        <Header />
        {children}
      </body>
    </html>
  )
}
