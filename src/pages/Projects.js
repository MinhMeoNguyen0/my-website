// src/pages/Projects.js
import React from 'react';
import { Container, Grid, Card, CardContent, Typography, CardActions, Button } from '@mui/material';

const projects = [
  {
    name: 'Encrypt/Decrypt Web Application',
    description: 'An interactive website tool using React Native and Next.js, integrated with REST Redux for backend communication. Enables users to encrypt and decrypt text and .txt files.',
    link: 'https://github.com/MinhNguyen161/encrypt-decrypt'
  },
  {
    name: 'Nonlinear Indistinguishability Query',
    description: 'Algorithm in Python to identify user preferences for a product within 20 questions. Collaboration with a team and writing a mathematical proof of the algorithm.',
    link: 'https://github.com/MinhNguyen161/nonlinear-query'
  },
];

const Projects = () => {
  return (
    <Container>
      <Typography variant="h2" align="center" gutterBottom>
        Projects
      </Typography>
      <Grid container spacing={4}>
        {projects.map((project, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                  {project.name}
                </Typography>
                <Typography>
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" href={project.link} target="_blank">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Projects;
