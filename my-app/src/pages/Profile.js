import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import defaultImage from "../assets/defaultImage.jpg";
import { Card } from 'react-bootstrap';
import { axiosReq } from '../api/axiosDefaults';

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

      const response = await axiosReq.put(`/profiles/${id ? id : 'me'}/`, formData);

      setProfile(response.data);
      setEditing(false); // Exit edit mode upon successful update
    } catch (error) {
      console.error('Error updating profile:', error.response?.data);
      alert('Failed to update profile: ' + JSON.stringify(error.response?.data));
    }
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <img
          src={profile.image || defaultImage}
          alt="Profile"
          style={{ width: '100px', height: '100px', borderRadius: '50%' }}
          onError={handleImageError}
        />
        <h3>{profile.username}</h3> {/* Use profile.username instead of profile.owner.username */}
        {editing ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <label htmlFor="content">Bio:</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <label htmlFor="image">Profile Image:</label>
            <input
              type="file"
              id="image"
              onChange={(e) => setImage(e.target.files[0])}
              accept="image/*"
            />
            <button type="submit">Update Profile</button>
            <button type="button" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </form>
        ) : (
          <>
            <p>{profile.name}</p>
            <p>{profile.content}</p>
            <button onClick={() => setEditing(true)}>Edit Profile</button>
          </>
        )}
      </div>
      <div>
        <h3>Teams</h3>
        {teams.map(team => (
          <Card key={team.id} className="mb-3">
            <Card.Body>
              <Card.Title>{team.name}</Card.Title>
              <Card.Text>{team.description}</Card.Text>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfilePage;
