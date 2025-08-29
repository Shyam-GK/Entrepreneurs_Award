import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function fetchUserAndNominee(token, refreshTokenFn) {
  try {
    console.log('Fetching user with token:', token);
    const resUser = await fetch(`${API}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log('User response status:', resUser.status);
    if (resUser.status === 401) {
      console.log('Received 401, attempting to refresh token');
      const newToken = await refreshTokenFn();
      const retryRes = await fetch(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      if (!retryRes.ok) {
        throw new Error(`Retry failed with status: ${retryRes.status}`);
      }
      return { user: await retryRes.json(), nominee: null };
    }
    if (!resUser.ok) {
      throw new Error(`Failed to fetch user: ${resUser.status}`);
    }
    const user = await resUser.json();
    console.log('User data:', user);

    if (user.isSubmitted) {
      const resNominee = await fetch(`${API}/nominee-details/my/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Nominee response status:', resNominee.status);
      if (!resNominee.ok) {
        throw new Error(`Failed to fetch nominee details: ${resNominee.status}`);
      }
      return { user, nominee: await resNominee.json() };
    }
    return { user, nominee: null };
  } catch (err) {
    console.error('Error fetching user/nominee:', err.message, err);
    throw err;
  }
}

export default function Navbar({ handleLogout, scrollToCriteria, showCriteriaButton }) {
    const [isOpen, setIsOpen] = useState(false);
    const [nomineeId, setNomineeId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        console.log("Token:", token);
        if (!token) {
            console.error("No token found — user must log in.");
            return;
        }

        const refreshTokenFn = async () => {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) throw new Error('No refresh token found');
          const response = await fetch(`${API}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });
          if (!response.ok) throw new Error('Failed to refresh token');
          const { accessToken } = await response.json();
          localStorage.setItem('accessToken', accessToken);
          return accessToken;
        };

        const fetchData = async () => {
            try {
                const { user, nominee } = await fetchUserAndNominee(token, refreshTokenFn);
                console.log("User data:", user);
                if (nominee) setNomineeId(user.id); // Use user.id as nomineeId
            } catch (err) {
                console.error("Error fetching user/nominee:", err.message, err);
            }
        };

        fetchData();
    }, []);

    return (
        <header className="w-full p-4 sm:p-5 shadow-md sticky top-0 z-20 bg-gradient-to-r from-sky-300 via-indigo-300 to-violet-300 backdrop-blur-sm">
            <nav className="container mx-auto flex justify-between items-center">
                {/* Logo and Title */}
                <div className="flex items-center gap-4">
                    <img
                        src="https://psgtech.edu/dept/ece/ieee/img/logo/psg.png"
                        alt="PSG Main Logo"
                        className="h-10 sm:h-12 w-auto"
                    />
                    <h1 className="text-lg md:text-xl font-bold text-gray-800">
                        PSG College of Technology
                    </h1>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-2 sm:space-x-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors"
                    >
                        Dashboard
                    </button>
                    {showCriteriaButton && (
                        <button
                            onClick={scrollToCriteria}
                            className="header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors"
                        >
                            Criteria
                        </button>
                    )}
                    <button
                        onClick={handleLogout}
                        className="header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                        Log out
                    </button>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button onClick={() => setIsOpen(!isOpen)} className="text-gray-800 focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>
            </nav>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden mt-4">
                    <div className="flex flex-col items-center space-y-2">
                        <button
                            onClick={() => {
                                navigate('/dashboard');
                                setIsOpen(false);
                            }}
                            className="w-full text-center header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors"
                        >
                            Dashboard
                        </button>
                        {showCriteriaButton && (
                            <button
                                onClick={() => {
                                    scrollToCriteria();
                                    setIsOpen(false);
                                }}
                                className="w-full text-center header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors"
                            >
                                Criteria
                            </button>
                        )}
                        <button
                            onClick={() => {
                                handleLogout();
                                setIsOpen(false);
                            }}
                            className="w-full text-center header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
}