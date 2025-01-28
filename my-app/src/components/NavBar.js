import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import ClickOutsideToggle from "../hooks/ClickOutsideToggle";
import styles from "../styles/NavBar.module.css";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUser";
import { axiosRes } from "../api/axiosDefaults";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const { logoutUser } = useSetCurrentUser(); // Ensure this is set up in the context
  const navigate = useNavigate(); // To redirect after logout

  const { expanded, setExpanded, ref } = ClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axiosRes.post("/dj-rest-auth/logout/"); // Ensure this endpoint works
      logoutUser(); // Calls the logout function from context
      navigate("/signin"); // Redirect to sign-in page after logout
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const loggedInIcons = (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.NavLink} ${styles.Active}` : styles.NavLink
        }
        to="/tasks"
      >
        <i className="fa-solid fa-list-check"></i>Tasks
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.NavLink} ${styles.Active}` : styles.NavLink
        }
        to="/categories"
      >
        <i className="fa-regular fa-folder-open"></i>Categories
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.NavLink} ${styles.Active}` : styles.NavLink
        }
        to="/teams"
      >
        <i className="fa-solid fa-people-group"></i>Teams
      </NavLink>
      {currentUser && (
        <NavLink
          className={styles.NavLink}
          to={`/profiles/${currentUser.profile?.id}`}
        >
          <div className={styles.ProfileLink}>
            {currentUser.profile?.image ? (
              <img
              src={currentUser.profile.image}
              alt="Profile"
              className={styles.Image}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              onError={(e) => {
                e.target.src = 'https://res.cloudinary.com/du2uzk3no/image/upload/v1714042156/default_profile_nwigev.jpg'; // Replace with default image URL
              }}
            />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
            <span className={styles.Username}>{currentUser.username}</span>
          </div>
        </NavLink>
      )}
      <NavLink className={styles.NavLink} to="#" onClick={handleSignOut}>
        <i className="fas fa-sign-out-alt"></i>Sign out
      </NavLink>
    </>
  );

  const loggedOutIcons = (
    <>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.NavLink} ${styles.Active}` : styles.NavLink
        }
        to="/signin"
      >
        <i className="fas fa-sign-in-alt"></i>Log In
      </NavLink>
      <NavLink
        className={({ isActive }) =>
          isActive ? `${styles.NavLink} ${styles.Active}` : styles.NavLink
        }
        to="/signup"
      >
        <i className="fas fa-user-plus"></i>Register
      </NavLink>
    </>
  );

  return (
    <Navbar
      expanded={expanded}
      className={styles.NavBar}
      expand="md"
      fixed="top"
    >
      <Container>
        <NavLink to="/">
          <Navbar.Brand>
            <h2>ProductiveYou</h2>
          </Navbar.Brand>
        </NavLink>

        <Navbar.Toggle
          ref={ref}
          onClick={() => setExpanded(!expanded)}
          aria-controls="basic-navbar-nav"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto text-left">
            {currentUser ? loggedInIcons : loggedOutIcons}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
