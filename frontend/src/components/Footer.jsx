import React from "react";

export default function Footer() {
    const contactInfo = [
        { icon: "fa-solid fa-paper-plane", lines: ["Post Box No. 1611", "Peelamedu", "Coimbatore - 641004"] },
        { icon: "fa-solid fa-phone", lines: ["0422-2572177, 2572477, 4344777"] },
        { icon: "fa-solid fa-fax", lines: ["0422-2592277"] },
        { icon: "fa-solid fa-envelope", lines: ["principal@psgtech.ac.in"] },
    ];

    return (
        // Added !text-white to the parent footer for better inheritance
        <footer className="bg-gray-800 !text-white">
            <div className="container mx-auto py-12 px-10 md:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Left Side: Contact Info */}
                    <div>
                        <div className="bg-white p-4 rounded-lg inline-block mb-6">
                            <img
                                src="https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/PSG_College_of_Technology_logo.png/220px-PSG_College_of_Technology_logo.png"
                                alt="PSG College of Technology Logo"
                                className="h-12"
                            />
                        </div>
                        <div className="space-y-4">
                            {contactInfo.map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <i className={`${item.icon} mt-1 text-lg !text-white`}></i>
                                    {/* The fix: Added '!' to force the text color to white */}
                                    <p className="!text-white">
                                        {item.lines.map((line, i) => (
                                            <React.Fragment key={i}>{line}<br /></React.Fragment>
                                        ))}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Side: Map */}
                    <div>
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.336312217126!2d77.00276857583094!3d11.014677454992564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85942484bf8d5%3A0x1949e3a3174983a8!2sPSG%20College%20of%20Technology!5e0!3m2!1sen!2sin!4v1723133722588!5m2!1sen!2sin"
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-lg shadow-lg"
                        ></iframe>
                    </div>
                </div>
            </div>
            <div className="border-t border-gray-700 mt-8">
                <div className="container mx-auto py-4 px-10 md:px-20 text-center !text-white">
                    © {new Date().getFullYear()} PSG College of Technology. All rights reserved.
                </div>
            </div>
        </footer>
    );
}