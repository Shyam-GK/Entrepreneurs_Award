import React, { useRef, useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import EligibilityCriteria from "../components/EligibilityCriteria";
import Footer from "../components/Footer";

export default function Dashboard({ handleLogout }) {
    const criteriaRef = useRef(null);
    const [nominations, setNominations] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const scrollToCriteria = () => {
        criteriaRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Fetch nominations and user data from API
    useEffect(() => {
        const fetchNominationsAndUser = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                console.log("Token:", token); // Debug token
                if (!token) {
                    console.error("No token found — user must log in.");
                    return;
                }

                // Fetch user info to get isSubmitted (queried from /users/me endpoint)
                const resUser = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("User response status:", resUser.status); // Debug status
                if (!resUser.ok) throw new Error("Failed to fetch user");
                const user = await resUser.json();
                console.log("User data:", user); // Debug user data
                setIsSubmitted(user.isSubmitted || false);

                // Fetch nominations
                const res = await fetch(`${import.meta.env.VITE_API_URL}/nominations`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error(`Error: ${res.status}`);
                }

                const data = await res.json();

                const formattedData = data.map((item) => ({
                    name: item.name || item.nomineeName || "",
                    email: item.email || item.nomineeEmail || "",
                    relationship: item.relationship || "",
                    status: item.status || "Pending",
                }));

                setNominations(formattedData);
            } catch (err) {
                console.error("Error fetching nominations or user:", err.message, err);
            }
        };

        fetchNominationsAndUser();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar
                handleLogout={handleLogout}
                scrollToCriteria={scrollToCriteria}
                showCriteriaButton={true}
            />
            <main className="flex-grow">
                <Hero isSubmitted={isSubmitted} />
                {/* ✅ Show table only if nominations exist */}
                {nominations.length > 0 && (
                    <div className="bg-blue-100 py-6 px-4">
                        <h2 className="text-2xl font-bold mb-4 text-center">
                            Your Nominations
                        </h2>

                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="py-2 px-4 border-b">Name</th>
                                        <th className="py-2 px-4 border-b">Email</th>
                                        <th className="py-2 px-4 border-b">Relationship</th>
                                        <th className="py-2 px-4 border-b">Status</th>
                                    </tr>
                                </thead>
                                    <tbody>
                                        {nominations.map((n, index) => (
                                            <tr key={index} className="hover:bg-blue-50 text-center">
                                                <td className="py-2 px-4 border-b">{n.name}</td>
                                                <td className="py-2 px-4 border-b">{n.email}</td>
                                                <td className="py-2 px-4 border-b">{n.relationship}</td>
                                                <td className="py-2 px-4 border-b">
                                                    <span
                                                        className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                                                            n.status.toLowerCase() === "pending"
                                                                ? "bg-red-500 text-white"
                                                                : "bg-green-500 text-white"
                                                        }`}
                                                    >
                                                        {n.status.toLowerCase() === "pending" ? "Pending" : "Submitted"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div ref={criteriaRef}>
                    <EligibilityCriteria />
                </div>
            </main>
            <Footer />
        </div>
    );
}