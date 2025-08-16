import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar({ handleLogout, scrollToCriteria, showCriteriaButton }) {
    const [isOpen, setIsOpen] = useState(false);
    const [nomineeId, setNomineeId] = useState(null);
    const navigate = useNavigate();

    // Fetch current user and their nominee info
    useEffect(() => {
        const fetchUserAndNominee = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                console.log("Token:", token); // Debug token
                if (!token) {
                    console.error("No token found — user must log in.");
                    return;
                }

                // Get user info
                const resUser = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("User response status:", resUser.status); // Debug status
                if (!resUser.ok) throw new Error("Failed to fetch user");
                const user = await resUser.json();
                console.log("User data:", user); // Debug user data

                if (user.isSubmitted) {
                    // Get nominee details for this user
                    const resNominee = await fetch(`${import.meta.env.VITE_API_URL}/admin/nominee-details/${user.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!resNominee.ok) throw new Error("Failed to fetch nominee details");
                    const nominee = await resNominee.json();
                    setNomineeId(nominee.id); // store nominee id for navigation
                }
            } catch (err) {
                console.error("Error fetching user/nominee:", err.message, err);
            }
        };

        fetchUserAndNominee();
    }, []);

    const goToNomineeDetails = () => {
        if (nomineeId) navigate(`/admin/nominee-details/${nomineeId}`);
    };

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
                    {showCriteriaButton && (
                        <button
                            onClick={scrollToCriteria}
                            className="header-logout-button text-white font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors"
                        >
                            Criteria
                        </button>
                    )}

                    {nomineeId && (
                        <button
                            onClick={goToNomineeDetails}
                            className="text-gray-800 font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors hover:bg-sky-200 cursor-pointer"
                        >
                            Nominee Details
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

                        {nomineeId && (
                            <button
                                onClick={() => {
                                    goToNomineeDetails();
                                    setIsOpen(false);
                                }}
                                className="w-full text-center text-gray-800 font-semibold px-3 sm:px-4 py-2 rounded-lg transition-colors hover:bg-sky-200 cursor-pointer"
                            >
                                Nominee Details
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