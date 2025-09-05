import { useEffect, useState } from 'react';
import { useAllUsersMutation } from '../../../redux/api/userAPI';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Customers.css';

const Customers = () => {
  const [allUsers, { isLoading, isError, error }] = useAllUsersMutation();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await allUsers().unwrap();
        setUsers(result.users);
      } catch (err) {
        console.log(err)
        toast.error('Failed to fetch users. Please try again.');
      }
    };

    fetchUsers();
  }, [allUsers]);

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error: {error?.data?.message || 'Failed to fetch users'}</div>;

  return (
    <div className="customers-container">
      <ToastContainer />
      <h1>All Customers</h1>
      <table className="customers-table">
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td><img src={user.photo} alt={user.name} className="customer-photo" /></td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
