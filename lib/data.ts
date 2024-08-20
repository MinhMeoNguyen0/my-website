
import React from "react";
import { CgWorkAlt } from "react-icons/cg";
import { FaReact } from "react-icons/fa";
import { FaBook } from "react-icons/fa";
import { LuGraduationCap } from "react-icons/lu";
import { AiOutlineCodeSandbox } from "react-icons/ai"
import corpcommentImg from "@/public/corpcomment.png";
import rmtdevImg from "@/public/rmtdev.png";
import wordanalyticsImg from "@/public/wordanalytics.png";

export const links = [
  {
    name: "Home",
    hash: "#home",
  },
  {
    name: "About",
    hash: "#about",
  },
  {
    name: "Projects",
    hash: "#projects",
  },
  {
    name: "Skills",
    hash: "#skills",
  },
  {
    name: "Experience",
    hash: "#experience",
  },
] as const;

export const experiencesData = [
  {
    title: "Full Stack Developer Bootcamp",
    url_link: "https://www.coderschool.vn/en",
    location: "Ho Chi Minh City, VN",
    description:
      "Due to Covid, I took a gap year off my studies, and took a full stack developer bootcamp. I then gain expertise in full stack development and landed an internship",
    icon: React.createElement(LuGraduationCap),
    date: "August 2020 - December 2020",
  },
  {
    title: "Apprentice, Intern Full Stack Developer",
    url_link: "https://www.everfit.io/",
    location: "San Francisco, CA, USA",
    description:
      "Built Everfit's content management system (CMS) and developed API endpoints for the Task Reminder feature using Node.js, JWT, and React. Managed and integrated backend APIs with CI/CD pipelines to ensure system uptime",
    icon: React.createElement(FaReact),
    date: "December 2020 - May 2021",
  },
  {
    title: "Researcher",
    url_link: "https://denison.edu/career/research/summer-scholars-awards",
    location: "Granville, OH, USA",
    description:
      "Awarded the Anderson Science Scholars grant to research and implement the Nonlinear Indistinguishability Query algorithm under the mentorship of Dr. Ashwin Lall",
    icon: React.createElement(FaBook),
    date: "May 2022 - August 2022",
  },
  {
    title: "Apprentice, Intern Lead Backend Engineer",
    url_link: "https://www.everfit.io/",
    location: "San Francisco, CA, USA",
    description:
      "Led a team of 3 interns to support backend and frontend infrastructure for three products using Agile methodology. Reduced employee leave processing time by 50% through the development of REST APIs with Node.js and MongoDB NoSQL",
    icon: React.createElement(AiOutlineCodeSandbox),
    date: "May 2023 - December 2023",
  },
  {
    title: "University Graduate",
    url_link: "https://denison.edu/",
    location: "Denison University, OH, USA",
    description:
      "I graduated with a B.A in Computer Science",
    icon: React.createElement(LuGraduationCap),
    date: "August 2019 - May 2024",
  },
  {
    title: "Volunteer, Web Developer",
    url_link: "https://www.everfit.io/",
    location: "San Francisco, CA, USA",
    description:
      "Currently volunteering as a web developer, addressing customer experience bugs with a specialization in resolving data corruption issues, and proficient in building product features",
    icon: React.createElement(CgWorkAlt),
    date: "July 2024 - Present",
  },
] as const;


export const projectsData = [
  {
    title: "Daily Thread Poster",
    description:
      "I made a script that automates the posting of daily threads for Seattle Events and Github Repositories",
    tags: ["Node.js", "MongoDB", "GraphQL", "Axios", "Cron", "OpenAPI"],
    imageUrl: corpcommentImg,
  },
  {
    title: "Decryption/Encryption Page",
    description:
      "Built a React site inspired by class API projects with Python for NSA's AES symmetric encryption, using a frontend for text/file encryption",
    tags: ["React", "Redux",, "REST","Python"],
    imageUrl: rmtdevImg,
  },
  {
    title: "Practice Basketball - E-Commerce Website",
    description:
      "I made a e-commerce website for a local basketball coach to sell his merchandise/programs",
    tags: ["React", "Node.js", "Axios", "MongoDB"],
    imageUrl: wordanalyticsImg,
  },
] as const;

export const skillsData = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Git",
  "Jira",
  "Figma",
  "Linux CLI",
  "Tailwind",
  "MongoDB",
  "Redux",
  "GraphQL",
  "Express",
  "PostgreSQL",
  "Python",
  "Framer Motion",
  "Tailwind CSS",
] as const;
