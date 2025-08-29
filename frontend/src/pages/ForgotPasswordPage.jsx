import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // Fallback to localhost if env variable is not set

export default function ForgotPasswordPage() {
    const [step, setStep] = useState('enterEmail');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(new Array(6).fill("")); 
    const navigate = useNavigate();
    const inputRefs = useRef([]); 
    const [isLoading, setIsLoading] = useState(false);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

            // alert('A verification code has been sent to your email.');
            setStep('verifyOtp');
        } catch (err) {
            console.error('Error sending OTP:', err);
            alert(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false;
        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
        if (element.nextSibling) element.nextSibling.focus();
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handlePaste = (e) => {
        const value = e.clipboardData.getData("text");
        if (isNaN(value) || value.length !== 6) return;
        setOtp(value.split(""));
        inputRefs.current[5].focus();
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = otp.join("");
        if (verificationCode.length < 6) {
            alert("Please enter the complete 6-digit code.");
            return;
        }

        try {
            const res = await fetch(`${API}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: verificationCode })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Invalid OTP');

            alert('OTP verified successfully!');
            setStep('resetPassword');
        } catch (err) {
            console.error('OTP verification error:', err);
            alert(err.message);
        }
    };

    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        const newPassword = e.target.elements['new-password'].value;
        const confirmPassword = e.target.elements['confirm-password'].value;

        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        try {
            const res = await fetch(`${API}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    otp: otp.join(""), // include OTP
                    password: newPassword,
                    reEnterPassword: confirmPassword // match backend DTO
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to reset password');

            alert('Password reset successfully!');
            navigate('/login');
        } catch (err) {
            console.error('Reset password error:', err);
            alert(err.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-teal-200 via-blue-300 to-indigo-300">
            <div className="w-full max-w-md p-8 space-y-6 rounded-2xl shadow-lg form-container mx-4">
                {(step === 'enterEmail' || step === 'verifyOtp') && (
                    <div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
                            <p className="mt-2 text-gray-600">
                                {step === 'enterEmail'
                                    ? "Enter your email and we'll send you a code to reset your password."
                                    : "Enter the 6-digit code sent to your email."}
                            </p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={step === 'enterEmail' ? handleEmailSubmit : handleOtpSubmit}>
                            <input
                                name="email"
                                type="email"
                                required
                                value={email}
                                autoComplete="email"   
                                disabled={step !== 'enterEmail'}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg ${
                                    step !== 'enterEmail' ? "opacity-70 cursor-not-allowed" : ""
                                }`}
                                placeholder="Email address"
                            />

                            {step === 'enterEmail' && (
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md submit-button disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? "Sending..." : "Send Verification Code"}
                                </button>
                            )}

                            {step === 'verifyOtp' && (
                                <>
                                    <div className="flex justify-center gap-2 md:gap-4" onPaste={handlePaste}>
                                        {otp.map((data, index) => (
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
                                        ))}
                                    </div>
                                    <button type="submit" className="w-full px-4 py-3 font-semibold text-white rounded-lg shadow-md submit-button">
                                        Verify
                                    </button>
                                </>
                            )}
                        </form>
                    </div>
                )}

                {step === 'resetPassword' && (
                    <div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-gray-800">Set New Password</h1>
                            <p className="mt-2 text-gray-600">Please create a new password for your account.</p>
                        </div>
                        <form className="mt-8 space-y-6" onSubmit={handlePasswordResetSubmit}>
                            <div>
                                <input
                                    name="new-password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                                    placeholder="New Password"
                                />
                                <p className="text-sm text-gray-700 mt-1 font-medium">Minimum 6 characters</p>
                            </div>
                            <div>
                                <input
                                    name="confirm-password"
                                    type="password"
                                    required
                                    minLength={6}
                                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg"
                                    placeholder="Confirm New Password"
                                />
                                <p className="text-sm text-gray-700 mt-1 font-medium">Minimum 6 characters</p>
                            </div>
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