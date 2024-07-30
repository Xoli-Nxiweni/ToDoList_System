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
            // Fetch the user by username
            const userResponse = await axios.get(`http://localhost:3004/users?username=${username}`);
            const user = userResponse.data[0]; // Assuming unique username

            if (user) {
                // Update the user's password
                const response = await axios.patch(`http://localhost:3004/users/${user.id}`, { password });
                if (response.data) {
                    setMessage('Password updated successfully!');
                    setError('');
                } else {
                    setError('Failed to update password.');
                }
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

        // Upload profile picture to an image hosting service and get URL
        // For the sake of this example, assume the URL is obtained
        const profilePictureUrl = 'http://example.com/path/to/uploaded/image.jpg'; // Replace with actual URL

        const username = localStorage.getItem('username'); // Ensure this line retrieves the username

        if (!username) {
            setError('No username found. Please log in again.');
            return;
        }

        try {
            // Fetch the user by username
            const userResponse = await axios.get(`http://localhost:3004/users?username=${username}`);
            const user = userResponse.data[0]; // Assuming unique username

            if (user) {
                // Update the user's profile picture URL
                const response = await axios.patch(`http://localhost:3004/users/${user.id}`, { profilePicture: profilePictureUrl });
                if (response.data) {
                    setMessage('Profile picture uploaded successfully');
                    setError('');
                } else {
                    setError('Failed to upload profile picture.');
                }
            } else {
                setError('User not found.');
            }
        } catch (error) {
            setError('An error occurred while uploading the profile picture.');
            console.error('Error uploading profile picture:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('username'); // Clear username on logout
        onLogout();
        window.location.reload(); // Reload the page to reset app state
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
