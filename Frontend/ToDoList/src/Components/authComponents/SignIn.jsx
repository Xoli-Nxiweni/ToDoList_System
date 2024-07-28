// import './SignIn.css';
// import { useState, useEffect } from 'react';
// import { FaUserAlt, FaLock, FaUnlock } from "react-icons/fa";
// import axios from 'axios';

// // eslint-disable-next-line react/prop-types
// const SignIn = ({ onSignIn, simulateLoading }) => {
//     const [isRegistered, setIsRegistered] = useState(false);
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [repeatPassword, setRepeatPassword] = useState('');
//     const [error, setError] = useState('');
//     const [message, setMessage] = useState('');

//     useEffect(() => {
//         // Check if user is already signed in
//         const token = localStorage.getItem('authToken');
//         if (token) {
//             // Perform a token validation request if needed
//             onSignIn(true);
//         }
//     }, [onSignIn]);

//     const toggleForm = () => {
//         setIsRegistered(!isRegistered);
//         setError('');
//         setMessage('');
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
    
//         simulateLoading(true);
    
//         try {
//             if (isRegistered) {
//                 if (password !== repeatPassword) {
//                     setError('Passwords do not match!');
//                     simulateLoading(false);
//                     return;
//                 }
    
//                 const response = await axios.post('http://localhost:3004/register', { username, password });
//                 if (response.data.success) {
//                     setMessage('Registration successful! Please sign in.');
//                     setIsRegistered(false);
//                 } else {
//                     setError('Registration failed');
//                 }
//             } else {
//                 const response = await axios.post('http://localhost:3004/signin', { username, password });
//                 if (response.data.success) {
//                     // Store authentication token or user info in localStorage
//                     localStorage.setItem('authToken', 'yourToken'); // Replace 'yourToken' with actual token or user data
//                     setMessage('Sign-in successful!');
//                     onSignIn(true);
//                 } else {
//                     setError('Sign-in failed');
//                 }
//             }
//         } catch (err) {
//             setError(`An error occurred during ${isRegistered ? 'registration' : 'sign-in'}: ${err.message}`);
//             console.error(`Error during ${isRegistered ? 'registration' : 'sign-in'}:`, err);
//         }

//         simulateLoading(false);
//     };

//     return (
//         <div className="SignUpContainer">
//             <div className="form">
//                 <h1>{isRegistered ? 'Sign up' : 'Sign in'}</h1>
//                 <form onSubmit={handleSubmit}>
//                     <div className="inputContainer">
//                         <FaUserAlt className='inputIcon' />
//                         <input
//                             type="text"
//                             maxLength={20}
//                             placeholder='Username'
//                             value={username}
//                             onChange={(e) => setUsername(e.target.value)}
//                             required
//                         />
//                     </div>
//                     <div className="inputContainer">
//                         <FaLock className='inputIcon' />
//                         <input
//                             type="password"
//                             maxLength={30}
//                             placeholder='Password'
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             required
//                         />
//                     </div>
//                     {isRegistered && (
//                         <div className="inputContainer">
//                             <FaUnlock className='inputIcon' />
//                             <input
//                                 type="password"
//                                 maxLength={30}
//                                 placeholder='Repeat Password'
//                                 value={repeatPassword}
//                                 onChange={(e) => setRepeatPassword(e.target.value)}
//                                 required
//                             />
//                         </div>
//                     )}
//                     <button type="submit">{isRegistered ? 'Sign up' : 'Sign in'}</button>
//                 </form>
//                 {error && <p style={{ color: 'red' }}>{error}</p>}
//                 {message && <p style={{ color: 'green' }}>{message}</p>}
//                 {!isRegistered ? (
//                     <p>No Account? <span onClick={toggleForm} className="toggleFormLink">Click here!</span></p>
//                 ) : (
//                     <p>Already have an account? <span onClick={toggleForm} className="toggleFormLink">Click here</span></p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SignIn;

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
        // Check if user is already signed in
        const token = localStorage.getItem('authToken');
        if (token) {
            // Perform a token validation request if needed
            onSignIn(true);
        }
    }, [onSignIn]);

    const toggleForm = () => {
        setIsRegistered(!isRegistered);
        setError('');
        setMessage('');
    };

    const validateEmail = (email) => {
        // Simple email regex validation
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const validatePassword = (password) => {
        // Minimum 8 characters, at least one letter and one number
        return /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        simulateLoading(true);
    
        if (!validateEmail(username)) {
            setError('username or password errors');
            simulateLoading(false);
            return;
        }

        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long and include both letters and numbers.');
            simulateLoading(false);
            return;
        }

        if (isRegistered) {
            if (password !== repeatPassword) {
                setError('Passwords do not match!');
                simulateLoading(false);
                return;
            }
    
            try {
                const response = await axios.post('http://localhost:3004/register', { username, password });
                if (response.data.success) {
                    setMessage('Registration successful! Please sign in.');
                    setIsRegistered(false);
                } else {
                    setError('Registration failed');
                }
            } catch (err) {
                setError(`An error occurred during registration: ${err.message}`);
                console.error('Error during registration:', err);
            }
        } else {
            try {
                const response = await axios.post('http://localhost:3004/signin', { username, password });
                if (response.data.success) {
                    // Store authentication token or user info in localStorage
                    localStorage.setItem('authToken', 'yourToken'); // Replace 'yourToken' with actual token or user data
                    setMessage('Sign-in successful!');
                    onSignIn(true);
                } else {
                    setError('Sign-in failed');
                }
            } catch (err) {
                setError(`An error occurred during sign-in: ${err.message}`);
                console.error('Error during sign-in:', err);
            }
        }

        simulateLoading(false);
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
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'green' }}>{message}</p>}
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
