
import './UserModal.css';
import { useState } from 'react';
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const UserModal = ({ onClose, onLogout }) => {
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRepeatPasswordChange = (e) => {
        setRepeatPassword(e.target.value);
    };

    const handleProfilePictureChange = (e) => {
        setProfilePicture(e.target.files[0]);
    };

    const handlePasswordUpdate = async () => {
        if (password !== repeatPassword) {
            setError('Passwords do not match!');
            return;
        }

        const username = localStorage.getItem('username'); // Ensure this line retrieves the username

        if (!username) {
            setError('No username found. Please log in again.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3004/updatePassword', { username, password });
            if (response.data.success) {
                setMessage('Password updated successfully!');
                setError('');
            } else {
                setError('Failed to update password.');
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

        const formData = new FormData();
        formData.append('profilePicture', profilePicture);

        try {
            const response = await axios.post('http://localhost:3004/upload-profile-picture', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                setMessage('Profile picture uploaded successfully');
                setError('');
            } else {
                setError('Failed to upload profile picture.');
            }
        } catch (error) {
            setError('Error uploading profile picture.');
            console.error('Error uploading profile picture:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username'); // Clear username on logout
        onLogout();
        location.reload();
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
        </div>
    );
};

export default UserModal;
