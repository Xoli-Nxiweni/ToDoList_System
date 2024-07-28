import './NavigationBar.css';
import { useState } from 'react';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import UserModal from './userModal/UserModal';

// eslint-disable-next-line react/prop-types
const NavigationBar = ({ isSignedIn, onSignOut, searchTerm, setSearchTerm }) => {
    const [profileModalOpen, setProfileModalOpen] = useState(false);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSignOut = () => {
        onSignOut(false);
    };

    const handleLogout = () => {
        setProfileModalOpen(false);
        handleSignOut();
    };

    return (
        <div className="navContainer">
            <div className="nav">
                <div className="heading">
                    <h1>ToDo List</h1>
                </div>
                {isSignedIn && (
                    <>
                        <div className="searchContainer">
                            <input 
                                type="text" 
                                placeholder='SEARCH ITEMS' 
                                maxLength={20} 
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="userProfile">
                            <div className="user" onClick={() => setProfileModalOpen(true)}>
                                <AccountCircleOutlinedIcon />
                            </div>
                            <button className='SignOutBtn' onClick={handleSignOut}>
                            </button>
                        </div>
                    </>
                )}
            </div>
            {profileModalOpen && <UserModal onClose={() => setProfileModalOpen(false)} onLogout={handleLogout} />}
        </div>
    );
};

export default NavigationBar;
