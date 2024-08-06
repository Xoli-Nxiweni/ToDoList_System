
import { useState } from 'react';
import './App.css';
import NavigationBar from './Components/NavigationBar';
import ToDo from './Components/ToDo/ToDo';
import SignIn from './Components/authComponents/SignIn';
import Loader from './Components/Loader/Loader';

const App = () => {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const handleSignIn = (signedIn, userId) => {
        setIsSignedIn(signedIn);
        setUserId(userId);
    };

    const simulateLoading = (status) => {
        setLoading(status);
    };

    return (
        <div className='wrapper'>
            {loading && <Loader />}
            <nav>
                <NavigationBar 
                    isSignedIn={isSignedIn} 
                    onSignOut={() => setIsSignedIn(false)} 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                />
            </nav>
            <main>
                {!isSignedIn ? (
                    <SignIn onSignIn={handleSignIn} simulateLoading={simulateLoading} />
                ) : (
                    <ToDo simulateLoading={simulateLoading} userId={userId} searchTerm={searchTerm} />
                )}
            </main>
        </div>
    );
};

export default App;
