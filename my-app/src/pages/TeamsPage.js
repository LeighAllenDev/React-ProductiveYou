import React, { useState, useEffect } from 'react';
import { axiosReq } from '../api/axiosDefaults';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import EditTeam from '../components/EditTeam'; // Ensure the path to EditTeam is correct

const TeamsPage = () => {
  const [teams, setTeams] = useState([]);
  const [users, setUsers] = useState([]);
  const [newTeamData, setNewTeamData] = useState({
    name: '',
    description: '',
    users: []  // Ensure this is correctly updated with user IDs
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTeam, setCurrentTeam] = useState(null);

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await axiosReq.get('/teams/');
      setTeams(response.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
      alert('Failed to fetch teams. Please try again.');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosReq.get('/profiles/');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setNewTeamData({ ...newTeamData, [e.target.name]: e.target.value });
  };

  const handleUserSelection = (e) => {
    const selectedUsers = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    setNewTeamData({ ...newTeamData, users: selectedUsers });
  };

  const handleAddTeamSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: newTeamData.name,
      description: newTeamData.description,
      user_ids: newTeamData.users  // Ensure this matches the backend field name
    };

    try {
      const response = await axiosReq.post('/teams/', data);
      console.log('Team created successfully:', response.data);
      alert('Team created successfully!');
      fetchTeams();
      setShowCreateForm(false);
      setNewTeamData({ name: '', description: '', users: [] });
    } catch (error) {
      if (error.response) {
        console.error('Server responded with error:', error.response.status, error.response.data);
        alert(`Error: ${error.response.data.detail}`);
      } else if (error.request) {
        console.error('Request made but no response received:', error.request);
        alert('Request failed. Please try again.');
      } else {
        console.error('Error setting up request:', error.message);
        alert('An error occurred. Please try again later.');
      }
    }
  };

  const handleJoinTeam = async (teamId) => {
    try {
      const response = await axiosReq.post(`/teams/${teamId}/join/`);
      alert('Successfully joined the team!');
      fetchTeams();
    } catch (error) {
      console.error('Error joining team:', error);
      alert('Failed to join the team. Please try again.');
    }
  };

  const handleEditTeam = (team) => {
    setCurrentTeam(team);
    setShowEditModal(true);
  };

  const handleEditTeamSubmit = async (updatedTeam) => {
    try {
      const response = await axiosReq.put(`/teams/${updatedTeam.id}/`, updatedTeam);
      alert('Team updated successfully!');
      fetchTeams();
      setShowEditModal(false);
      setCurrentTeam(null);
    } catch (error) {
      console.error('Error updating team:', error);
      alert('Failed to update the team. Please try again.');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      try {
        await axiosReq.delete(`/teams/${teamId}/`);
        alert('Team deleted successfully!');
        fetchTeams();
      } catch (error) {
        console.error('Error deleting team:', error);
        alert('Failed to delete the team. Please try again.');
      }
    }
  };

  return (
    <div>
      <h1>Teams Page</h1>

      <Button onClick={() => setShowCreateForm(!showCreateForm)}>
        {showCreateForm ? 'Cancel' : 'Create New Team'}
      </Button>

      {showCreateForm && (
        <Form onSubmit={handleAddTeamSubmit}>
          <Form.Group>
            <Form.Label>Team Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={newTeamData.name}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={newTeamData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Select Users</Form.Label>
            <Form.Control
              as="select"
              multiple
              name="users"
              value={newTeamData.users}
              onChange={handleUserSelection}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Button type="submit">Create Team</Button>
        </Form>
      )}

      <hr />

      <h2>Existing Teams:</h2>
      {teams.map(team => (
        <Card key={team.id} className="mb-3">
          <Card.Body>
            <Card.Title>{team.name}</Card.Title>
            <Card.Text>{team.description}</Card.Text>
            <Card.Text>Members: {team.users.map(user => user.username).join(', ')}</Card.Text>
            <Button onClick={() => handleJoinTeam(team.id)}>Join Team</Button>
            <Button variant="warning" onClick={() => handleEditTeam(team)}>Edit Team</Button>
            <Button variant="danger" onClick={() => handleDeleteTeam(team.id)}>Delete Team</Button>
          </Card.Body>
        </Card>
      ))}

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentTeam && (
            <EditTeam
              team={currentTeam}
              onSubmit={handleEditTeamSubmit}
              onCancel={() => setShowEditModal(false)}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default TeamsPage;
