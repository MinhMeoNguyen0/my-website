// src/pages/About.js
import React from 'react';
import { Container, Typography, Avatar, Grid } from '@mui/material';

const About = () => {
  return (
    <Container>
      <Grid container spacing={4} justifyContent="center">
        <Grid item>
          <Avatar alt="Crazy Koder" src="/path/to/profile.jpg" style={{ width: 100, height: 100 }} />
        </Grid>
      </Grid>
      <Typography variant="h2" align="center" gutterBottom>
        Minh Duc Nguyen
      </Typography>
      <Typography variant="h5" align="center" color="textSecondary" paragraph>
        Fullstack Developer
      </Typography>

      <Typography variant="h4" gutterBottom>
        Education
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Denison University, Granville, OH</strong><br />
        Bachelor of Arts, Computer Science - GPA: 3.30<br />
        Relevant coursework: Text Analysis, Data Privacy, Cryptography, Operating Systems
      </Typography>

      <Typography variant="h4" gutterBottom>
        Work Experience
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Lead Back-end Engineer Intern</strong><br />
        Everfit.io, San Francisco, USA - SAAS Fitness Startup (May 2023 - December 2023)<br />
        - Led a team of 3 interns to support both the front & back end infrastructure of three products with Agile scrum methodology<br />
        - Supervised and provided technical back-end support to two internal websites to ensure 99% system up-time<br />
        - Managed over 500 employee leave requests and job applicant notifications in the project<br />
        - Tested and documented a comprehensive Leave Request API using Node.js, MongoDB, and Mongoose
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Full Stack Engineer Intern</strong><br />
        Everfit.io, San Francisco, USA - SAAS Fitness Startup (December 2020 - May 2021)<br />
        - Built Everfit's content management system by providing APIs endpoints with NodeJS and a UI using React ES6<br />
        - Implemented a Task reminder feature for 1,000 coaches accounting for time conflict between all 24 time zone regions<br />
        - Created technical spec documentation detailing the architecture, endpoints, inputs/outputs, and dependencies for all built products used by the QA department
      </Typography>

      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Encrypt/Decrypt Web Application</strong><br />
        (May 2024 - Present)<br />
        - Designed and implemented an interactive website tool using React Native and Next.js, integrated with REST Redux for seamless backend communication<br />
        - The application enables users to encrypt and decrypt text and .txt files, providing a modern, responsive UI with Tailwind CSS for optimal user experience across all devices
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Nonlinear Indistinguishability Query</strong><br />
        (May 2022 - August 2022)<br />
        - Designed and implemented an algorithm in Python to identify user preferences for a product within 20 questions under the mentorship of Dr. Ashwin Lall<br />
        - Collaborated with a team of 3 to write a mathematical proof of the algorithm demonstrating the direct dependence of the values of coefficients and exponents in the user's preference function
      </Typography>

      <Typography variant="h4" gutterBottom>
        Interests & Activities
      </Typography>
      <Typography variant="body1" paragraph>
        - Member: Denison Competitive Fencing Club, Vietnamese Student Association<br />
        - Lambda Chi Alpha Fraternity - Alumni Chair<br />
        - Host academic-focused speakers and workshops every term and maintain positive relationships with alumni, school academic resources, and scholarship/financial aid providers<br />
        - Co-organized and raised $880 for Feeding America through a Halloween Philanthropy event attended by around 200 students
      </Typography>
    </Container>
  );
};

export default About;
