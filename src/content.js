// Every desk object maps to one section here. The prev/next buttons walk
// through them in ORDER (bottom of the file).

const GH = "https://github.com/MinhMeoNguyen0";
const BASE = import.meta.env.BASE_URL; // asset URLs stay correct under any deploy path
const RESUME = `${BASE}Minh_Nguyen_Resume.pdf`;

const chips = (list) => `<div class="chips">${list.map((s) => `<span>${s}</span>`).join("")}</div>`;

export const PROFILE = {
  name: "Minh Nguyen",
  role: "Software Engineer (Full Stack)",
  email: "dminhnguyen161@gmail.com",
  linkedin: "https://www.linkedin.com/in/minhnguyen161/",
  github: GH,
  resume: RESUME,
};

export const SECTIONS = [
  {
    id: "everfit",
    label: "Everfit.io",
    hint: "Software Developer · 2020 – 2025",
    title: "Everfit.io",
    kicker: "Software Developer · San Francisco, CA · 12/2020 – 03/2025",
    html: `
      <p>Worked across the full stack (React, Node.js, MongoDB, AWS) of a SaaS fitness-coaching platform over three terms.</p>
      <ol class="timeline">
        <li><b>Full Stack Intern</b><span>12/2020 – 05/2021</span></li>
        <li><b>Lead Backend Intern</b><span>05/2023 – 12/2023</span></li>
        <li><b>Software Developer</b><span>07/2024 – 03/2025</span></li>
      </ol>
      <ul>
        <li><b>React, Node.js, Redis:</b> built a content management system (Node.js REST API + React / Ant Design Pro UI) for 6,000+ client contacts, with Redis caching read-heavy responses so pages render faster.</li>
        <li><b>JWT, cross-functional delivery:</b> built Task Reminder endpoints, data models and JWT auth handling 24 time zones, then integrated them into the React interface with cross-functional teams.</li>
        <li><b>AWS EC2, S3, CI/CD:</b> deployed Node.js API services on EC2, stored client documents in S3 and wired the APIs into CI/CD pipelines to keep them up between releases.</li>
        <li><b>Node.js, Express, MongoDB:</b> built and tested a Leave Request REST API with Mongoose models and Joi validation — 500+ requests handled, processing time cut by <b>50%</b>.</li>
        <li>Led a team of 3 interns supporting backend and frontend work across three products using Agile.</li>
      </ul>
      ${chips(["React", "Node.js", "Express", "MongoDB", "Redis", "AWS EC2/S3", "JWT", "Ant Design Pro"])}
      <a class="btn" href="https://www.everfit.io/" target="_blank" rel="noopener">everfit.io ↗</a>`,
  },
  {
    id: "projects",
    label: "Projects",
    hint: "Things I've built — boot the PC",
    title: "Projects",
    kicker: "C:\\MINH\\PROJECTS> dir",
    html: `
      <article class="proj">
        <header><h3>Athena — AI Job Application Tracker</h3><span>2026</span></header>
        <p>Solo 0 → 1, human-in-the-loop AI: an agent submits jobs, TypeSafe AI scores ATS fit, and I approve each application. Self-hosted PostgreSQL 16 on Docker Compose; ATS scores are cached by input hash to skip repeat paid calls.</p>
        ${chips(["TypeScript", "Node.js", "Hono", "PostgreSQL", "React", "Docker"])}
      </article>
      <article class="proj">
        <header><h3>8-Bit Drift</h3><span>2026</span></header>
        <p>A procedural one-bit driving playground: custom physics, collisions, drifting, gear shifting and drone flight in plain HTML5 Canvas 2D. GitHub Actions runs simulation, mobile and deploy checks before every GitHub Pages publish.</p>
        ${chips(["JavaScript", "Canvas 2D", "GitHub Actions", "GitHub Pages"])}
        <div class="links"><a class="btn" href="https://minhmeonguyen0.github.io/8-Bit-Drift/" target="_blank" rel="noopener">Play ↗</a><a class="btn ghost" href="${GH}/8-Bit-Drift" target="_blank" rel="noopener">Code ↗</a></div>
      </article>
      <article class="proj">
        <header><h3>Jevsume — ATS Resume Review</h3><span>2026</span></header>
        <p>Extracts resume text the way an applicant-tracking parser would, then a Cloudflare Worker runs typed JEV questions and composes a JevScore.</p>
        ${chips(["Cloudflare Workers", "TypeSafe AI", "Frontend"])}
        <div class="links"><a class="btn" href="https://resume.ikr.one" target="_blank" rel="noopener">Try it ↗</a><a class="btn ghost" href="${GH}/jevsume" target="_blank" rel="noopener">Code ↗</a></div>
      </article>
      <details class="older">
        <summary>Older projects</summary>
        <ul>
          <li><a href="${GH}/DailyThreadBot" target="_blank" rel="noopener">Daily Thread Poster</a> — automates daily threads for Seattle events and GitHub repos (Node.js, MongoDB, GraphQL, Cron).</li>
          <li><a href="${GH}/encrypt_webapp" target="_blank" rel="noopener">Encryption / Decryption page</a> — React front end over a Python AES service for text and file encryption.</li>
          <li><a href="${GH}/HabitTracker-Iter" target="_blank" rel="noopener">Habit Tracker</a> — an iOS habit tracker in Swift.</li>
          <li><a href="${GH}/ECommerce-BE" target="_blank" rel="noopener">Basketball e-commerce</a> — a store for a local coach's merch and programs (React, Node.js, MongoDB).</li>
        </ul>
      </details>
      <a class="btn" href="${GH}" target="_blank" rel="noopener">All repos on GitHub ↗</a>`,
  },
  {
    id: "skills",
    label: "Skills",
    hint: "What my fingers know",
    title: "Technical Skills",
    kicker: "Every key on this board, I've pressed in production",
    html: `
      <h4>Languages</h4>${chips(["Java", "TypeScript", "JavaScript (ES6+)", "HTML", "CSS", "Python", "SQL"])}
      <h4>Frontend</h4>${chips(["React.js", "Redux", "React hooks", "Vite", "Material UI", "Ant Design", "Responsive UI"])}
      <h4>Backend</h4>${chips(["Java Spring Boot", "Spring WebFlux", "JAX-RS", "Node.js", "Express", "Hono", "REST APIs", "Microservices", "OpenAPI / Swagger"])}
      <h4>Data &amp; Messaging</h4>${chips(["PostgreSQL", "Cassandra", "MongoDB", "Redis", "Apache Kafka", "Solr", "Resilience4j"])}
      <h4>Cloud &amp; DevOps</h4>${chips(["AWS (EC2, S3)", "Azure (Blob, Queue)", "Google Cloud Run", "Docker", "Kubernetes", "GitHub Actions", "Looper", "Maven", "Git"])}
      <h4>Testing &amp; Security</h4>${chips(["JUnit 5", "Mockito", "WireMock", "Jest", "Vitest", "SonarQube", "Snyk", "Agile / Scrum"])}
      <h4>AI tooling &amp; exposure</h4>${chips(["Claude Code", "Codex", "GitHub Copilot", "GraphQL", "Next.js", "Tailwind CSS", "Figma", "Three.js"])}`,
  },
  {
    id: "walmart",
    label: "Walmart Global Tech",
    hint: "Software Engineer · 2025 – Present",
    title: "Walmart Global Tech",
    kicker: "Software Engineer · Sunnyvale, CA · 04/2025 – Present",
    html: `
      <p>I build Java / Spring Boot microservices for Walmart's item-ingestion platform, which moves <b>650M+ Apache Kafka messages a day</b> across 82+ feed types into the catalog.</p>
      <ul>
        <li><b>Java 8 → 17 migration:</b> led an intake service's move, replacing deprecated APIs and core libraries for a <b>28% runtime gain</b>; fixed broken tests to 90% coverage and shipped with zero downtime.</li>
        <li><b>Java 21, Spring Boot 3.5:</b> upgraded the seller task-management service from Spring Boot 2.7, migrating javax → jakarta and aligning BOM dependencies; JUnit 5, Mockito and WireMock tests passed every stage gate.</li>
        <li><b>Kafka + Resilience4j:</b> added per-consumer circuit breakers, retries and dead-letter queues to Kafka-to-HTTP relays — open breakers apply backpressure instead of dropping messages, ending downstream lag spikes.</li>
        <li><b>REST APIs (JAX-RS, Jersey):</b> maintain seller-facing feed-status and task APIs backed by Cassandra and Solr read models, serving filtered, sorted, cursor-paginated results to Seller Center.</li>
        <li><b>CCM2 config migration:</b> consolidated legacy XML / JSON / YAML config into the central config platform across 40+ microservices, cutting config-related deployment failures by <b>35%</b>.</li>
        <li><b>Security (Snyk):</b> triaged findings with platform and security teams, upgrading dependencies and refactoring risky components — <b>150+ high-risk vulnerabilities</b> removed.</li>
      </ul>
      ${chips(["Java 17/21", "Spring Boot 3.5", "Apache Kafka", "Resilience4j", "JAX-RS", "Cassandra", "Solr", "JUnit 5", "Snyk"])}`,
  },
  {
    id: "resume",
    label: "Résumé",
    hint: "The one-page version",
    title: "Résumé",
    kicker: "Minh Nguyen · Software Engineer (Full Stack)",
    html: `
      <p>React.js · Java Spring Boot · Node.js · Kafka · PostgreSQL</p>
      <ul class="facts">
        <li><b>Now</b> Software Engineer, Walmart Global Tech</li>
        <li><b>Before</b> Software Developer, Everfit.io (3 terms)</li>
        <li><b>Research</b> Undergraduate Researcher, Denison University</li>
        <li><b>Degree</b> B.A. Computer Science, Denison University (2024)</li>
        <li><b>Based in</b> Sunnyvale, CA · H-1B visa holder</li>
      </ul>
      <div class="links">
        <a class="btn" href="${RESUME}" target="_blank" rel="noopener">Open PDF ↗</a>
        <a class="btn ghost" href="${RESUME}" download>Download</a>
      </div>`,
  },
  {
    id: "hobbies",
    label: "Off the clock",
    hint: "When I'm not coding",
    title: "Off the Clock",
    kicker: "Things that keep me alive (like this cactus)",
    html: `
      <p>My favorite part of programming is the problem-solving — that moment a solution finally clicks. When I step away from the keyboard:</p>
      <ul class="icons">
        <li><span>🎮</span>Video games — enough that I build my own (see 8-Bit Drift).</li>
        <li><span>🎥</span>Movies.</li>
        <li><span>🐕</span>Hanging out with my dog.</li>
        <li><span>📚</span>History — I can go on for hours.</li>
        <li><span>🧩</span>LeetCode every day, <a href="${GH}/LeetCode-Everyday" target="_blank" rel="noopener">for the grinders</a>.</li>
      </ul>`,
  },
  {
    id: "about",
    label: "About me",
    hint: "Who's this guy?",
    title: "Hello, I'm Minh.",
    kicker: "Full-stack software engineer · Sunnyvale, CA",
    html: `
      <img class="portrait" src="${BASE}me.jpg" alt="Portrait of Minh Nguyen" onerror="this.remove()" />
      <p>I'm a full-stack engineer who likes building apps and solving both day-to-day and gnarly problems.</p>
      <p>Today I'm at <b>Walmart Global Tech</b>, building Java / Spring Boot microservices that push 650M+ Kafka messages a day into the catalog. Before that I spent three terms at <b>Everfit.io</b> shipping React, Node.js and AWS features for a fitness-coaching SaaS.</p>
      <p>I started with a full-stack bootcamp in Ho Chi Minh City, then earned a <b>B.A. in Computer Science</b> at Denison University. On the side I build things like an AI job-application tracker and a one-bit driving game.</p>
      <p class="muted">Click around the desk — every object is a section.</p>`,
  },
  {
    id: "contact",
    label: "Contact",
    hint: "Pick up the phone",
    title: "Get in Touch",
    kicker: "Open to good engineering conversations",
    html: `
      <ul class="contact">
        <li><span>Email</span><a href="mailto:dminhnguyen161@gmail.com">dminhnguyen161@gmail.com</a></li>
        <li><span>LinkedIn</span><a href="https://www.linkedin.com/in/minhnguyen161/" target="_blank" rel="noopener">in/minhnguyen161</a></li>
        <li><span>GitHub</span><a href="${GH}" target="_blank" rel="noopener">MinhMeoNguyen0</a></li>
        <li><span>Location</span>Sunnyvale, CA</li>
      </ul>
      <div class="links"><a class="btn" href="mailto:dminhnguyen161@gmail.com">Send an email</a><a class="btn ghost" href="https://www.linkedin.com/in/minhnguyen161/" target="_blank" rel="noopener">Connect ↗</a></div>`,
  },
  {
    id: "education",
    label: "Education",
    hint: "Denison · CoderSchool · Research",
    title: "Education",
    kicker: "The books (and the cap)",
    html: `
      <article class="proj">
        <header><h3>B.A. Computer Science</h3><span>05/2024</span></header>
        <p>Denison University · Granville, OH</p>
      </article>
      <article class="proj">
        <header><h3>Undergraduate Researcher</h3><span>Summer 2022</span></header>
        <p>Denison University. Awarded the Anderson Science Scholars grant (<b>$4,900</b>) to research a nonlinear indistinguishability query — a preference-learning algorithm that identifies a user's product preferences within 20 questions, mentored by Dr. Ashwin Lall.</p>
      </article>
      <article class="proj">
        <header><h3>Full Stack Web Development Bootcamp</h3><span>08 – 12/2020</span></header>
        <p>CoderSchool · Ho Chi Minh City, VN. Took a COVID gap year, learned full-stack development and landed my first internship.</p>
      </article>`,
  },
];

const ORDER = ["about", "walmart", "everfit", "projects", "skills", "education", "hobbies", "resume", "contact"];
SECTIONS.sort((a, b) => ORDER.indexOf(a.id) - ORDER.indexOf(b.id));

export const LAMP = { id: "lamp", label: "Desk lamp", hint: "Click to toggle the light" };
