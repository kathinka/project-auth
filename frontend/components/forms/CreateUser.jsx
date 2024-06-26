import { useState } from 'react';

const apiKey = import.meta.env.VITE_API_KEY;
const API = apiKey + "/admin"

export const CreateUser = ({ getUsers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const Update = async () => {
    const token = sessionStorage.getItem('token');
    try {
      const response = await fetch(`${API}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, email, role, password }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || errorData.error;
        setMessage(errorMessage || 'An error occurred while creating the user.');
        throw new Error(errorMessage);
      }

      getUsers();
      setMessage('User created successfully');
    } catch (error) {
      // check if it includes the error message from the backend
      if (error.message.includes('User with this email already exists')) {
        setMessage('A user with the same email already exists.');
      } else {
        setMessage(`An unexpected error occurred: ${error.message}`);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let errors = {};

    if (!name) errors.name = "Name is required.";
    if (!email) errors.email = "Email is required.";
    if (!password) errors.password = "Password is required.";
    if (!role) errors.role = "Role is required.";
    setErrors(errors)

    if (Object.keys(errors).length === 0) {
      // If no errors, celebrate and send fresh user data to the server
      Update();
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <label>Create user</label>

      <label>Name</label>
      <input type="text" name="name" onChange={e => setName(e.target.value.trim())} />
      {errors.name && <p>{errors.name}</p>}
      <label>Email</label>
      <input type="text" name="email" onChange={e => setEmail(e.target.value.trim())} />
      {errors.email && <p>{errors.email}</p>}
      <label>Role</label>

      <select name="role" value={role} onChange={e => setRole(e.target.value)}>
        <option value="user" disabled>User</option>
        <option value="writer">Writer</option>
        <option value="editor">Editor</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && <p>{errors.role}</p>}
      <label>Password</label>
      <input type="password" name="password" onChange={e => setPassword(e.target.value.trim())} />
      {errors.password && <p>{errors.password}</p>}
      <button type="submit">Create user</button>
      {message && <p>{message}</p>}
    </form>
  );
}