import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';

export default function SignUpPage() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        course: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:3000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
            });

            if (res.ok) {
            const data = await res.json();
            console.log("Signup success:", data);

            // After successful signup → navigate to forgot-password
            navigate("/forgot-password", { state: { email: formData.email } });
            } else {
            const err = await res.json();
            console.error("Signup failed:", err);
            alert(err.message || "Signup failed");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong");
        }
        };


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
                            name="mobile"
                            type="tel"
                            required
                            pattern="[0-9]{10}"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                            placeholder="Mobile Number"
                        />

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
