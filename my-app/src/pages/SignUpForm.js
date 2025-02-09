import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import axios from "axios";

import styles from "../styles/SignInUpForm.module.css";
import btnStyles from "../styles/Button.module.css";
import appStyles from "../styles/App.module.css";
import signup from "../assets/signup.jpg";

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("/dj-rest-auth/registration/", signUpData);
      console.log(response.data);
      window.location.replace("/signin");
    } catch (err) {
      console.log("Error data:", err.response?.data);
      setErrors(err.response?.data || {});
    }
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto py-2 p-md-2" md={6}>
        <Container className={`${appStyles.Content} p-4 `}>
          <h1 className={styles.Header}>Sign Up</h1>

          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="visually-hidden">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                value={signUpData.username}
                onChange={handleChange}
                autoComplete="username"
              />
              {errors.username?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group controlId="password1">
              <Form.Label className="visually-hidden">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password1"
                value={signUpData.password1}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password1?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group controlId="password2">
              <Form.Label className="visually-hidden">Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                name="password2"
                value={signUpData.password2}
                onChange={handleChange}
                autoComplete="new-password"
              />
              {errors.password2?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Button
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
            >
              Sign Up
            </Button>

            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signin">
            Already have an account? <span>Sign In</span>
          </Link>
        </Container>
      </Col>

      <Col md={6} className={`my-auto d-none d-md-block p-2 ${styles.SignUpCol}`}>
        <Image className={`${appStyles.FillerImage}`} src={signup} />
      </Col>
    </Row>
  );
};

export default SignUpForm;
