import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordPage() {
    const [step, setStep] = useState('enterEmail');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill("")); // State for the 6 OTP inputs
    const navigate = useNavigate();
    const inputRefs = useRef([]); // To manage focus on the OTP inputs

    // --- Event Handlers ---

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        console.log('Verification code sent to:', email);
        alert('A verification code has been sent to your email.');
        setStep('verifyOtp');
    };

    // --- OTP Input Logic ---

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false; // Only allow numbers

        // Update the OTP state
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        // On backspace, if the input is empty, focus the previous input
        if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handlePaste = (e) => {
        const value = e.clipboardData.getData("text");
        if (isNaN(value) || value.length !== 6) {
            return;
        }
        const newOtp = value.split("");
        setOtp(newOtp);
        // Focus the last input after paste
        inputRefs.current[5].focus();
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();
        const verificationCode = otp.join("");
        if (verificationCode.length < 6) {
            alert("Please enter the complete 6-digit code.");
            return;
        }
        // In a real app, you would verify the OTP with your backend here
        console.log('OTP verified successfully:', verificationCode);
        setStep('resetPassword');
    };

    const handlePasswordResetSubmit = (e) => {
        e.preventDefault();
        const newPassword = e.target.elements['new-password'].value;
        const confirmPassword = e.target.elements['confirm-password'].value;

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        console.log('Password has been reset.');
        alert('Your password has been reset successfully!');
        navigate('/login');
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-200 via-blue-300 to-indigo-300">
            <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg form-container mx-4">

                {/* Step 1: Enter Email Form */}
                {step === 'enterEmail' && (
                    <div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
                            <p className="mt-2 text-gray-600">Enter your email and we'll send you a code to reset your password.</p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleEmailSubmit}>
                            <input
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                                placeholder="Email address"
                            />
                            <button type="submit" className="w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md submit-button">
                                Send Verification Code
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 2: Verify OTP Form - Updated Design */}
                {step === 'verifyOtp' && (
                    <div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-800">Verify Your Email</h1>
                            <p className="mt-2 text-gray-600">Enter the 6-digit code sent to your email.</p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handleOtpSubmit}>
                            <div className="flex justify-center gap-2 md:gap-4" onPaste={handlePaste}>
                                {otp.map((data, index) => {
                                    return (
                                        <input
                                            key={index}
                                            type="text"
                                            maxLength="1"
                                            value={data}
                                            ref={el => inputRefs.current[index] = el}
                                            onChange={e => handleOtpChange(e.target, index)}
                                            onKeyDown={e => handleKeyDown(e, index)}
                                            className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        />
                                    );
                                })}
                            </div>
                            <button type="submit" className="w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md submit-button">
                                Verify
                            </button>
                        </form>
                    </div>
                )}

                {/* Step 3: Reset Password Form */}
                {step === 'resetPassword' && (
                    <div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-800">Set New Password</h1>
                            <p className="mt-2 text-gray-600">Please create a new password for your account.</p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handlePasswordResetSubmit}>
                            <input
                                name="new-password"
                                type="password"
                                required
                                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                                placeholder="New Password"
                            />
                            <input
                                name="confirm-password"
                                type="password"
                                required
                                className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                                placeholder="Confirm New Password"
                            />
                            <button type="submit" className="w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md submit-button">
                                Reset Password
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}
