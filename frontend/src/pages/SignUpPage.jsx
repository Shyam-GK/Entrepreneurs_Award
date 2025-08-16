import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';

export default function SignUpPage({ handleLogin }) {
    const navigate = useNavigate();

    // 1. Use state to manage all form fields together
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        course: ''
    });

    // 2. A single handler to update the state for any field
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSignUpSubmit = (e) => {
        e.preventDefault();
        // 3. Log the collected data upon submission
        console.log('Form data submitted:', formData);
        console.log('Redirecting to Forgot Password...');
        navigate('/forgot-password');
    };

    // Placeholder for scrollToCriteria (no effect on signup page)
    const scrollToCriteria = () => {};

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-green-200 via-cyan-300 to-blue-400">
            <LandingNavbar scrollToCriteria={scrollToCriteria} />
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg form-container mx-4">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
                        <p className="mt-2 text-gray-600">
                            Already have an account?{' '}
                            <Link to="/login" className="font-medium text-blue-600 hover:underline">
                                Log in
                            </Link>
                        </p>
                    </div>
                    <form className="mt-8 space-y-6" onSubmit={handleSignUpSubmit}>
                        {/* 4. Added Name Input Field */}
                        <input
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                            placeholder="Full Name"
                        />
                        <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                            placeholder="Email address"
                        />
                        <input
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                            placeholder="Password"
                        />

                        {/* 5. Added Course Dropdown Menu */}
                        <select
                            name="course"
                            required
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                        >
                            <option value="" disabled>Select a course</option>
                            <option value="msc-software-systems">MSc Software Systems</option>
                            <option value="msc-data-science">MSc Data Science</option>
                            <option value="msc-theoretical-computer-science">MSc Theoretical Computer Science</option>
                            <option value="msc-cyber-security">MSc Cyber Security</option>
                        </select>

                        <button type="submit" className="w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md submit-button">
                            Sign Up
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}