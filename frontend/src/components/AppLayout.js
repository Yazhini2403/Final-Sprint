/*import React from 'react';
import Navbar from './Navbar'; // Ensure you have a Navbar component
import Sidebar from './Sidebar'; // Ensure you have a Sidebar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AppLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear any stored authentication data (localStorage/sessionStorage)
        localStorage.removeItem('authToken'); // Example: clear auth token

        // Navigate to the sign-in page
        navigate('/signin');
    };

    return (
        <div className='min-h-screen bg-gray-100'>
            <header className="py-4 px-6 bg-blue-500 flex justify-between items-center">
                <div className="flex-1 flex justify-center">
                    <h1 className="text-3xl font-bold text-white">SPRINT BOARD</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded flex items-center"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Logout
                    </button>
                </div>
            </header>
        
            <div className='w-screen flex flex-col md:flex-row container mx-auto' style={{ height: 'calc(100vh - 56px)' }}>
                <div className="w-full md:w-[220px] bg-gray-200">
                    <Sidebar />
                </div>
                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AppLayout;*/
import React from 'react';
import Navbar from './Navbar'; // Ensure you have a Navbar component
import Sidebar from './Sidebar'; // Ensure you have a Sidebar component
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AppLayout = ({ children }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Implement logout logic here, e.g., clear auth tokens and redirect
        console.log('Logging out and navigating to Sign In...');
        localStorage.removeItem('authToken'); // Clear auth token from localStorage
        navigate('/signin', { replace: true }); // Redirect to Sign In page
    };

    return (
        <div className='min-h-screen bg-gray-100'>
            <header className="py-4 px-6 bg-blue-500 flex justify-between items-center">
                <div className="flex-1 flex justify-center">
                    <h1 className="text-3xl font-bold text-white">SPRINT BOARD</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white hover:bg-red-700 px-4 py-2 rounded flex items-center"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                        Logout
                    </button>
                </div>
            </header>
        
            <div className='w-screen flex flex-col md:flex-row container mx-auto' style={{ height: 'calc(100vh - 56px)' }}>
                <div className="w-full md:w-[220px] bg-gray-200">
                    <Sidebar />
                </div>
                <div className="flex-1 p-4">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AppLayout;
