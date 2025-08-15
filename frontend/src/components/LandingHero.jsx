import React from "react";
import { Link } from 'react-router-dom';

export default function LandingHero() {
    const [isRegistered, setIsRegistered] = useState(false);
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) return;

        axios.get("/nominee-details/my/profile", {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => {
            // If profile data exists, mark registered
            if (res.data && Object.keys(res.data).length > 0) {
                setIsRegistered(true);
            } else {
                setIsRegistered(false);
            }
        })
        .catch(err => {
            console.error("Error fetching nominee profile:", err);
            setIsRegistered(false); // treat as not registered
        });
    }, []);


    return (
        <div className="min-h-[calc(100vh-88px)] flex items-center relative">
            <div className="container mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center w-full">

                <div className="w-full md:w-1/2 text-center md:text-left">
                    <div className="py-8">
                        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-snug">
                            Alumni Entrepreneur Nomination
                        </h2>
                        <div className="flex flex-wrap gap-6 justify-center md:justify-start mt-10">
                            <Link to="/login" className="action-button text-white font-bold py-4 px-8 rounded-xl shadow-lg text-center text-lg w-60">
                                Apply Now
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="w-full md:w-1/2 flex flex-col items-center justify-center gap-8 py-8 md:ml-16">
                    <h3 className="text-2xl font-bold text-gray-700">Celebrating Milestones</h3>
                    <div className="flex gap-8 items-center">
                        <img
                            src="https://platinum.psgtech.ac.in/assets/images/LogoLaunch/75yearsLogo_PSGCollegeofTech.png"
                            alt="PSG 75 Years Logo"
                            className="h-24 md:h-32 w-auto"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/150x100/e2e8f0/64748b?text=75+Years" }}
                        />
                        <img
                            src="https://platinum.psgtech.ac.in/assets/images/LogoLaunch/100yearsLogo_PsgSonsCharities.png"
                            alt="PSG 100 Years Logo"
                            className="h-24 md:h-32 w-auto"
                            onError={(e) => { e.currentTarget.src = "https://placehold.co/150x100/e2e8f0/64748b?text=100+Years" }}
                        />
                    </div>
                </div>
            </div>

            <div className="scroll-indicator text-center md:hidden">
                <span className="text-gray-600">Scroll for details</span>
                <svg className="w-6 h-6 text-gray-600 mx-auto mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>
        </div>
    );
}
