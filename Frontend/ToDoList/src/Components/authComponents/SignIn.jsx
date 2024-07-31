import './SignIn.css';
import { useState, useEffect } from 'react';
import { FaUserAlt, FaLock, FaUnlock } from "react-icons/fa";
import axios from 'axios';

// eslint-disable-next-line react/prop-types
const SignIn = ({ onSignIn, simulateLoading }) => {
    const [isRegistered, setIsRegistered] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            onSignIn(true);
        }
    }, [onSignIn]);

    const toggleForm = () => {
        setIsRegistered(!isRegistered);
        setError('');
        setMessage('');
    };

    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        simulateLoading(true);

        if (!validateEmail(username)) {
            setError('Invalid email format');
            simulateLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and include both letters and numbers.');
            simulateLoading(false);
            return;
        }

        try {
            if (isRegistered) {
                if (password !== repeatPassword) {
                    setError('Passwords do not match!');
                    simulateLoading(false);
                    return;
                }

                // Check if user already exists
                const existingUserResponse = await axios.get(`http://localhost:3004/users?username=${username}`);
                if (existingUserResponse.data.length > 0) {
                    setError('User already exists');
                    simulateLoading(false);
                    return;
                }

                // Register new user
                const newUser = {
                    username,
                    password,
                    tasks: []
                };
                await axios.post('http://localhost:3004/users', newUser);
                setMessage('Registration successful! Please sign in.');
                setIsRegistered(false);
            } else {
                // Sign in user logic
                const allUsersResponse = await axios.get('http://localhost:3004/users');
                const users = allUsersResponse.data;

                // using find() to loop through the users 
                const user = users.find(user => user.username === username && user.password === password);
                if (user) {
                    localStorage.setItem('authToken', user.username);
                    localStorage.setItem('user', JSON.stringify(user));
                    setMessage('Sign-in successful!');
                    simulateLoading(true);
                    onSignIn(true);
                } else {
                    setError('Incorrect Username or Password');
                }
            }
        } catch (err) {
            setError(`An error occurred: ${err.message}`);
            console.error('Error:', err);
        } finally {
            simulateLoading(false);
        }
    };

    return (
        <div className="SignUpContainer">
            <div className="form">
                <h1>{isRegistered ? 'Sign up' : 'Sign in'}</h1>
                <form onSubmit={handleSubmit}>
                    <div className="inputContainer">
                        <FaUserAlt className='inputIcon' />
                        <input
                            type="email"
                            maxLength={50}
                            placeholder='Email'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="inputContainer">
                        <FaLock className='inputIcon' />
                        <input
                            type="password"
                            maxLength={30}
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {isRegistered && (
                        <div className="inputContainer">
                            <FaUnlock className='inputIcon' />
                            <input
                                type="password"
                                maxLength={30}
                                placeholder='Repeat Password'
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                            />
                        </div>
                    )}
                    <button type="submit">{isRegistered ? 'Sign up' : 'Sign in'}</button>
                </form>
                {error && <p style={{ color: 'red', fontSize: '.7em' }}>{error}</p>}
                {message && <p style={{ color: 'green', fontSize: '.7em' }}>{message}</p>}
                {!isRegistered ? (
                    <p>No Account? <span onClick={toggleForm} className="toggleFormLink">Click here!</span></p>
                ) : (
                    <p>Already have an account? <span onClick={toggleForm} className="toggleFormLink">Click here</span></p>
                )}
            </div>
        </div>
    );
};

export default SignIn;
