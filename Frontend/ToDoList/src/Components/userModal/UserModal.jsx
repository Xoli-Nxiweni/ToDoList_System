

import './UserModal.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const UserModal = ({ onClose, onLogout }) => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');

    // Fetch the username from JSON Server using the auth token
    const fetchUsername = async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setError('No authentication token found. Please log in again.');
            return;
        }

        try {
            const response = await axios.get(`http://localhost:3004/users?authToken=${token}`);
            if (response.data.length > 0) {
                setUsername(response.data[0].username); // Adjust based on your response structure
            } else {
                setError('User not found.');
            }
        } catch (err) {
            setError('An error occurred while fetching user data.');
            console.error('Error fetching user:', err);
        }
    };

    useEffect(() => {
        fetchUsername();
    }, []);

    const handlePasswordChange = (e) => setPassword(e.target.value);
    const handleRepeatPasswordChange = (e) => setRepeatPassword(e.target.value);
    const handleProfilePictureChange = (e) => setProfilePicture(e.target.files[0]);

    const handlePasswordUpdate = async () => {
        if (password !== repeatPassword) {
            setError('Passwords do not match!');
            return;
        }

        if (!username) {
            setError('No username found. Please log in again.');
            return;
        }

        try {
            const userResponse = await axios.get(`http://localhost:3004/users?username=${username}`);
            const user = userResponse.data[0]; // Assuming unique username

            if (user) {
                await axios.patch(`http://localhost:3004/users/${user.id}`, { password });
                setMessage('Password updated successfully!');
                setError('');
            } else {
                setError('User not found.');
            }
        } catch (err) {
            setError('An error occurred while updating the password.');
            console.error('Error updating password:', err);
        }
    };

    const handleProfilePictureUpload = async () => {
        if (!profilePicture) {
            setError('No profile picture selected!');
            return;
        }

        const uploadUrl = 'http://example.com/upload'; // Replace with actual upload URL
        const formData = new FormData();
        formData.append('file', profilePicture);

        try {
            const uploadResponse = await axios.post(uploadUrl, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            const profilePictureUrl = uploadResponse.data.url;

            if (!username) {
                setError('No username found. Please log in again.');
                return;
            }

            const userResponse = await axios.get(`http://localhost:3004/users?username=${username}`);
            const user = userResponse.data[0]; // Assuming unique username

            if (user) {
                await axios.patch(`http://localhost:3004/users/${user.id}`, { profilePicture: profilePictureUrl });
                setMessage('Profile picture uploaded successfully');
                setError('');
            } else {
                setError('User not found.');
            }
        } catch (err) {
            setError('An error occurred while uploading the profile picture.');
            console.error('Error uploading profile picture:', err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username');
        onLogout();
        window.location.reload(); // Reload the page to reset app state
    };

    const handleDeleteAccount = async () => {
        if (!username) {
            setError('No username found. Please log in again.');
            return;
        }

        try {
            const userResponse = await axios.get(`http://localhost:3004/users?username=${username}`);
            const user = userResponse.data[0]; // Assuming unique username

            if (user) {
                await axios.delete(`http://localhost:3004/users/${user.id}`);
                handleLogout(); 
            } else {
                setError('User not found.');
                console.log(`User not found.`);
            }
        } catch (err) {
            setError('An error occurred while deleting the account.');
            console.error('Error deleting account:', err);
        }
    };

    return (
        <div className="profileModal show">
            <h2>Edit Profile</h2>
            <form>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                />
                <input
                    type="password"
                    placeholder="Repeat Password"
                    value={repeatPassword}
                    onChange={handleRepeatPasswordChange}
                    required
                />
                <button type="button" onClick={handlePasswordUpdate}>Update Password</button>
            </form>
            <div className="profilePictureSection">
                <input type="file" onChange={handleProfilePictureChange} />
                <button type="button" onClick={handleProfilePictureUpload}>Upload Profile Picture</button>
            </div>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button className="closeButton" onClick={onClose}>Close</button>
            <button className="logoutButton" onClick={handleLogout}>Logout</button>
            <button className="deleteButton" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
};

export default UserModal;
