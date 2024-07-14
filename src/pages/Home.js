import React, { useState, useEffect } from 'react';
import { Typography, IconButton, Box, Grid } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import './Home.css'; // Import the CSS file for animations and styles

const Photo3 = "https://scontent-sea1-1.xx.fbcdn.net/v/t1.15752-9/449769253_825646466197319_2572762229084854814_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=9f807c&_nc_ohc=EPbtZbRCDhAQ7kNvgFq7LMd&_nc_ht=scontent-sea1-1.xx&oh=03_Q7cD1QFI2SINn0l4jhd6xU-dglR7cfrFRSN0rXCEkh128M5E7g&oe=66BA8103";
const Photo2 = "https://scontent.xx.fbcdn.net/v/t1.15752-9/445374152_8426261824056033_7762617744135288958_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=0024fc&_nc_ohc=40E7GqKYBZoQ7kNvgHem_q0&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QE_kI-ETwLx3r1q04UwlP101INmFp0j3TX4bzU-vPeFPg&oe=66BA97AB";
const Photo1 = "https://scontent.xx.fbcdn.net/v/t1.15752-9/413099069_1588796824988578_2066284236887337928_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=0024fc&_nc_ohc=dH-7CB34ioYQ7kNvgHmpu4p&_nc_ad=z-m&_nc_cid=0&_nc_ht=scontent.xx&oh=03_Q7cD1QFLCiM8XmYfzzFL2JWdGFmRV89U9LQCwMxYMOASQ417Og&oe=66BA87F8";

const greetings = [
  { text: 'Xin chào, tôi là Minh Nguyen', font: 'Pacifico' }, // Vietnamese
  { text: 'Hi, my name is Minh Nguyen', font: 'Arial' },
  { text: 'Hola, me llamo Minh Nguyen', font: 'Comic Sans MS' },
  { text: 'Ciao, mi chiamo Minh Duc Nguyen', font: 'Georgia' },
  { text: 'Hallo, ich heiße Minh Nguyen', font: 'Times New Roman' },
  { text: 'Salut, je suis Minh Nguyen', font: 'Lobster' }, // French informal greeting
  { text: 'こんにちは、私はミン・グエンです', font: 'Sawarabi Mincho' }, // Japanese
  { text: '안녕하세요, 제 이름은 Minh Nguyen입니다', font: 'Nanum Gothic' }, // Korean
  { text: '你好，我叫Minh Nguyen', font: 'ZCOOL KuaiLe' }, // Chinese
  { text: 'Привет, меня зовут Minh Nguyen', font: 'Russo One' }, // Russian
  { text: 'Cześć, nazywam się Minh Nguyen', font: 'Merriweather' }, // Polish
  { text: 'Olá, meu nome é Minh Nguyen', font: 'Dancing Script' }, // Portuguese
  { text: 'Hej, jag heter Minh Nguyen', font: 'Fredoka One' }, // Swedish
  { text: 'Salam, saya Minh Nguyen', font: 'Amiri' }, // Arabic
  { text: 'Ahoj, jmenuji se Minh Nguyen', font: 'Baloo Bhaina 2' }, // Czech
];

const Home = () => {
  const [greeting, setGreeting] = useState(greetings[0]);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setGreeting((prev) => {
          const nextIndex = (greetings.indexOf(prev) + 1) % greetings.length;
          return greetings[nextIndex];
        });
        setFade(true);
      }, 500);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box className="content-container">
      <Box className="title-container">
        <Typography variant="h2" component="span" className="name-container">
          <span className={`greeting ${fade ? 'fade-in' : 'fade-out'}`} style={{ fontFamily: greeting.font }}>
            {greeting.text}
          </span>
        </Typography>
      </Box>
      <Typography variant="h6" component="h2" gutterBottom sx={{ textAlign: 'left', color: 'gray', mt: -2 }}>
        aka Minh Meo
      </Typography>
      <Typography className="paragraph-container" variant="body1" gutterBottom>
        Welcome to my world of innovation and creativity! I'm thrilled to be a tech enthusiast with over 2 years of full-stack internship experience, where I've had the opportunity to immerse myself in the dynamic world of software development.  <br /> <br/>
        My passion for technology drives me to continually learn and adapt to new challenges. From designing robust back-end systems to crafting intuitive front-end interfaces, I thrive on creating seamless and efficient applications. My experience has equipped me with a diverse skill set, allowing me to tackle complex problems and deliver innovative solutions. <br /> <br/>
        Aside from coding, I have a deep love for food 🍲 and basketball 🏀. Whether it's exploring new cuisines or trying out different recipes, I find joy in the culinary arts. Basketball, on the other hand, keeps me active and disciplined. It's not just a game for me, but a way to build teamwork and resilience. <br /> <br/>
        In every project I undertake, I bring a blend of technical expertise, creativity, and enthusiasm. I'm always excited to collaborate with like-minded individuals who are passionate about technology and innovation. Let's connect and bring your ideas to the forefront of success!
      </Typography>
      <Box sx={{ mt: 2, mb: 2 }}>
        <IconButton href="https://github.com/your-github-username" target="_blank" color="inherit">
          <GitHubIcon />
        </IconButton>
        <IconButton href="https://www.linkedin.com/in/your-linkedin-username/" target="_blank" color="inherit">
          <LinkedInIcon />
        </IconButton>
        <IconButton href="https://www.facebook.com/MoeMinhNguyen/" target="_blank" color="inherit">
          <FacebookIcon />
        </IconButton>
        <IconButton href="https://www.instagram.com/just.minhmeo/" target="_blank" color="inherit">
          <InstagramIcon />
        </IconButton>
      </Box>
      <Grid container spacing={2} justifyContent="flex-start">
        <Grid item xs={12} sm={6} md={4}>
          <Box className="photo-box">
            <img alt="At a basketball game" src={Photo1} className="photo" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className="photo-box">
            <img alt="Delicious food" src={Photo2} className="photo" />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box className="photo-box">
            <img alt="At a restaurant" src={Photo3} className="photo" />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;
