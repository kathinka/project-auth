import { useState, useEffect, useCallback } from 'react';

import { Logout } from './Logout';
import { UpdateUser } from './forms/UpdateUser';
import { DeleteUser } from './forms/DeleteUser';
import { CreateUser } from './forms/CreateUser';
import { UpdateUserRole } from './forms/UpdateUserRole';

export const Admin = () => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const API = apiKey + "/admin";
  const [users, setUsers] = useState([]);
  const token = sessionStorage.getItem('token');
  const [message, setMessage] = useState("");

  const getUsers = useCallback(async () => {
    try {
      const response = await fetch(`${API}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setUsers(data);
      setMessage('User fetched successfully');
    } catch (error) {
      setMessage('An unexpected error occurred.');
    }
  }, [API, token, setUsers]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div>

      <h1>Admin page</h1>
      <p>Wow - so much admin stuff</p>
      <p>As an admin can you do lots of exclusive stuff: create and delete users, update user roles, and userinfo</p>

      <UpdateUser getUsers={getUsers} />
      <UpdateUserRole getUsers={getUsers} />
      <DeleteUser getUsers={getUsers} />
      <CreateUser getUsers={getUsers} />
      <Logout />



      {users.map(({ _id, name, email, role }) => (
        <div key={_id}>
          <ul>
            <li>ID: {_id}</li>
            <li>NAME: {name}</li>
            <li>EMAIL:{email}</li>
            <li>ROLE: {role}</li>
          </ul>
        </div>
      ))}
      {message && <p>{message}</p>}
    </div>
  );
}
