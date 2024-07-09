import React from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SignInForm from './pages/SignInForm';
import SignUpForm from './pages/SignUpForm';
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import EditCategory from './components/CategoryEdit';
import TeamsPage from './pages/TeamsPage';
import ProfilePage from './pages/Profile';
import ErrorBoundary from './components/ErrorBoundary';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';

function App() {
  return (
    <>
      <NavBar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignInForm />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/new" element={<TaskForm />} /> 
          <Route path="/tasks/edit/:id" element={<TaskForm />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/categories/edit/:categoryId" element={<EditCategory />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/profiles/:id" element={<ProfilePage />} />
          <Route path="*" element={<p>Page not found!</p>} />
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
