import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import hero from "../assets/hero.jpg";
import appStyles from "../styles/App.module.css";

const HomePage = () => {
  return (
    <Container className={appStyles.App}>
      <Row className="justify-content-center text-center mt-5">
        <Col>
          <h1>Welcome to Productive You!</h1>
        </Col>
      </Row>
      <Row className="justify-content-center text-center mt-3">
        <Col>
          <p>This is a productivity App where users can join teams, 
            edit their profiles, make categories and add tasks.<br />
            It provides the ability to assign tasks to other users
            so everyone can contribute!</p>
        </Col>
      </Row>
      <Row className="justify-content-center text-center mt-5">
        <Col>
          <img className={`${appStyles.FillerImage}`} src={hero} alt="Hero" />
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
