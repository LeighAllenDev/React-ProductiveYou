import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col, Image } from "react-bootstrap";
import signin from "../assets/signin.jpg";
import styles from "../styles/SignInUpForm.module.css";
import btnStyles from "../styles/Button.module.css";
import appStyles from "../styles/App.module.css";
import { useSetCurrentUser } from "../contexts/CurrentUser";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  const navigate = useNavigate();

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!signInData.username || !signInData.password) {
      setErrors({ non_field_errors: ["Both fields are required."] });
      return;
    }
  
    try {
      const { data } = await axios.post(
        "/dj-rest-auth/login/",
        signInData,
        { withCredentials: true } // Ensure cookies are sent
      );
      setCurrentUser(data.user);
      navigate("/"); // Redirect to the homepage
    } catch (err) {
      if (err.response && err.response.data) {
        setErrors(err.response.data);
      } else {
        console.error("Unexpected error occurred:", err);
        setErrors({ non_field_errors: ["An unexpected error occurred. Please try again later."] });
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignInData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <Row className={styles.Row}>
      <Col className="my-auto p-0 p-md-2 App" md={6}>
        <Container className={`${appStyles.Content} p-4`}>
          <h1 className={styles.Header}>Sign In</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label className="visually-hidden">Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                className={styles.Input}
                value={signInData.username}
                onChange={handleChange}
                aria-label="Username" // Accessibility improvement
              />
              {errors.username?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label className="visually-hidden">Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                name="password"
                className={styles.Input}
                value={signInData.password}
                onChange={handleChange}
                aria-label="Password" // Accessibility improvement
              />
              {errors.password?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-2">
                  {message}
                </Alert>
              ))}
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright}`}
            >
              Sign In
            </Button>

            {errors.non_field_errors?.map((message, idx) => (
              <Alert key={idx} variant="warning" className="mt-3">
                {message}
              </Alert>
            ))}
          </Form>
        </Container>

        <Container className={`mt-3 ${appStyles.Content}`}>
          <Link className={styles.Link} to="/signup">
            Don't have an account? <span>Sign up now!</span>
          </Link>
        </Container>
      </Col>

      <Col md={6} className={`my-auto d-none d-md-block p-2 ${styles.SignInCol}`}>
        <Image className={`${appStyles.FillerImage}`} src={signin} alt="Sign in visual" />
      </Col>
    </Row>
  );
}

export default SignInForm;
