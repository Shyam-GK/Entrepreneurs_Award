import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LandingNavbar from '../components/LandingNavbar';

export default function SignUpPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        course: '',
        programme: '',
        graduatedYear: ''
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
                navigate("/forgot-password", { state: { email: formData.email } });
            } else {
                const err = await res.json();
                console.error("Signup failed:", err);
                const errorMessage = Array.isArray(err.message) ? err.message.join(', ') : err.message || "Signup failed";
                alert(errorMessage);
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
                            name="programme"
                            required
                            value={formData.programme}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                        >
                            <option value="" disabled>Select a degree</option>
                            <option value="be-btech">BE/BTech</option>
                            <option value="be-sandwich">BE Sandwich</option>
                            <option value="me-mtech">ME/MTech</option>
                            <option value="mca">MCA</option>
                            <option value="bsc">BSc</option>
                        </select>
                        <select
                            name="course"
                            required
                            value={formData.course}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                        >
                            <option value="" disabled>Select a course</option>
                            <option value="applied-science">Applied Science</option>
                            <option value="automobile-engineering">Automobile Engineering</option>
                            <option value="automotive-engineering">Automotive Engineering</option>
                            <option value="biomedical-engineering">Biomedical Engineering</option>
                            <option value="bio-technology">Bio Technology</option>
                            <option value="civil-engineering">Civil Engineering</option>
                            <option value="computer-science-and-engineering-aiml">Computer Science and Engineering (AI/ML)</option>
                            <option value="computer-science-and-engineering">Computer Science and Engineering</option>
                            <option value="computer-systems-and-design">Computer Systems and Design</option>
                            <option value="computer-technology">Computer Technology</option>
                            <option value="control-systems">Control Systems</option>
                            <option value="biometrics-and-cybersecurity">Biometrics and Cybersecurity</option>
                            <option value="electrical-and-communication-engineering">Electrical and Communication Engineering</option>
                            <option value="electrical-and-electronics-engineering">Electrical and Electronics Engineering</option>
                            <option value="embedded-and-real-time-systems">Embedded and Real-time Systems</option>
                            <option value="engineering-design">Engineering Design</option>
                            <option value="industrial-engineering">Industrial Engineering</option>
                            <option value="industrial-metallurgy">Industrial Metallurgy</option>
                            <option value="fashion-design-and-merchandising">Fashion Design & Merchandising</option>
                            <option value="fashion-technology">Fashion Technology</option>
                            <option value="information-technology">Information Technology</option>
                            <option value="instrumentation-and-control-systems-engineering">Instrumentation and Control Systems Engineering</option>
                            <option value="master-of-computer-applications">Master of Computer Applications</option>
                            <option value="manufacturing-engineering">Manufacturing Engineering</option>
                            <option value="material-science">Material Science</option>
                            <option value="applied-chemistry">Applied Chemistry</option>
                            <option value="mechanical-engineering">Mechanical Engineering</option>
                            <option value="metallurgical-engineering">Metallurgical Engineering</option>
                            <option value="nano-science-and-technology">Nano Science and Technology</option>
                            <option value="power-electronics-and-drives">Power Electronics and Drives</option>
                            <option value="production-engineering">Production Engineering</option>
                            <option value="robotics-and-automation-engineering">Robotics and Automation Engineering</option>
                            <option value="structural-engineering">Structural Engineering</option>
                            <option value="vlsi-design">VLSI Design</option>
                            <option value="textile-technology">Textile Technology</option>
                        </select>
                        <select
                            name="graduatedYear"
                            required
                            value={formData.graduatedYear}
                            onChange={handleChange}
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                        >
                            <option value="" disabled>Select graduation year</option>
                            {Array.from({ length: 2025 - 1955 + 1 }, (_, i) => 1955 + i).map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
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
