import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import defaultImage from "../assets/defaultImage.jpg";
import { Container, Row, Col, Card } from 'react-bootstrap';
import { axiosReq } from '../api/axiosDefaults';
import styles from '../App.module.css';

const ProfilePage = () => {
  const { id } = useParams();

  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [editing, setEditing] = useState(false);
  const [teams, setTeams] = useState([]);

  const handleImageError = (e) => {
    e.target.src = defaultImage;
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosReq.get(`/profiles/${id ? id : 'me'}/`);
        setProfile(response.data);
        setName(response.data.name);
        setContent(response.data.content);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [id]);

  useEffect(() => {
    const fetchTeams = async () => {
      if (profile) {
        try {
          const response = await axiosReq.get('/teams/');
          const userTeams = response.data.filter(team =>
            team.users.some(user => user.id === (id ? parseInt(id) : profile.owner.id))
          );
          setTeams(userTeams);
        } catch (error) {
          console.error('Error fetching teams:', error);
        }
      }
    };

    fetchTeams();
  }, [profile, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      const response = await axiosReq.put(`/profiles/${id ? id : 'me'}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProfile(response.data);
      setEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data);
      alert('Failed to update profile: ' + JSON.stringify(error.response?.data));
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <Container className={styles.App}>
      <h2 className={styles.textWhite}>User Profile</h2>
      <Row>
        <Col md={5} className={`mb-4 ${styles.Content}`}>
          <img
            src={profile.image || defaultImage}
            alt="Profile"
            className={styles.Image}
            onError={handleImageError}
          />
          <h3 className={styles.textWhite}>{profile.username}</h3>
          {editing ? (
            <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.Content}>
              <label htmlFor="name" className={styles.formLabel}>Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
              <label htmlFor="content" className={styles.formLabel}>Bio:</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="form-control"
              />
              <label htmlFor="image" className={styles.formLabel}>Profile Image:</label>
              <input
                type="file"
                id="image"
                onChange={(e) => setImage(e.target.files[0])}
                accept="image/*"
                className="form-control"
              />
              <button type="submit" className="btn btn-primary mt-2">Update Profile</button>
              <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary mt-2">Cancel</button>
            </form>
          ) : (
            <>
              <p>{profile.name}</p>
              <p>{profile.content}</p>
              <button onClick={() => setEditing(true)} className="btn btn-warning">Edit Profile</button>
            </>
          )}
        </Col>
        <Col md={1}></Col>
        <Col md={6} className={styles.Content}>
          <h3 className={styles.textWhite}>Teams</h3>
          {teams.map(team => (
            <Card key={team.id} className={`${styles.cardCustom} mb-3`}>
              <Card.Body>
                <Card.Title>{team.name}</Card.Title>
                <Card.Text>{team.description}</Card.Text>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;