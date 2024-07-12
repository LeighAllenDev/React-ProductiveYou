import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { axiosReq } from '../api/axiosDefaults';

const EditTeam = ({ team, onSubmit, onCancel }) => {
  const [teamData, setTeamData] = useState({
    name: '',
    description: '',
    users: []
  });

  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (team) {
      setTeamData({
        name: team.name,
        description: team.description,
        users: team.users.map(user => user.id)
      });
    }
  }, [team]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axiosReq.get('/profiles/');
      setUsers(response.data);
    } catch (error) {
      alert('Failed to fetch users. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setTeamData({ ...teamData, [e.target.name]: e.target.value });
  };

  const handleUserSelection = (e) => {
    const selectedUsers = Array.from(e.target.selectedOptions, option => option.value);
    setTeamData({ ...teamData, users: selectedUsers });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...team,
      name: teamData.name,
      description: teamData.description,
      users: teamData.users.map(user => parseInt(user))
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label>Team Name</Form.Label>
        <Form.Control
          type="text"
          name="name"
          value={teamData.name}
          onChange={handleInputChange}
          required
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={teamData.description}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Select Users</Form.Label>
        <Form.Control
          as="select"
          multiple
          name="users"
          value={teamData.users}
          onChange={handleUserSelection}
        >
          {users.map(user => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      <Button type="submit">Save Changes</Button>
      <Button variant="secondary" onClick={onCancel}>Cancel</Button>
    </Form>
  );
};

export default EditTeam;
