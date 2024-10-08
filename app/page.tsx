import About from '@/components/about'
import Experience from '@/components/experience'
import Intro from '@/components/intro'
import Projects from '@/components/projects'
import SectionDivider from '@/components/section-divider'
import Skills from '@/components/skills'


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Intro />
      <SectionDivider />
      <About/>
      <SectionDivider />
      <Projects/>
      <SectionDivider />
      <Skills/>
      <SectionDivider />
      <Experience/>
    </main>
  )
}
