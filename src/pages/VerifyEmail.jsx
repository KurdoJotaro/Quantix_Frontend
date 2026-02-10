import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Use raw axios to avoid interceptor redirects if needed, or api instance

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const userId = searchParams.get('userId');
        const token = searchParams.get('token');

        if (!userId || !token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        const verify = async () => {
            try {
                // We use the base URL from env directly or the api instance
                const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
                await axios.get(`${apiUrl}/auth/verify-email`, {
                    params: { userId, token }
                });
                setStatus('success');
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed. Link might be expired.');
            }
        };

        verify();
    }, [searchParams]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-body text-center">
            <div className="card max-w-md w-full p-8">
                {status === 'verifying' && (
                    <div>
                        <h2 className="text-xl font-bold mb-2">Verifying Email...</h2>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                )}
                {status === 'success' && (
                    <div>
                        <h2 className="text-xl font-bold text-success mb-2">Email Verified!</h2>
                        <p className="text-secondary">Redirecting to login...</p>
                    </div>
                )}
                {status === 'error' && (
                    <div>
                        <h2 className="text-xl font-bold text-danger mb-2">Verification Failed</h2>
                        <p className="text-secondary mb-4">{message}</p>
                        <button onClick={() => navigate('/login')} className="btn btn-primary">Go to Login</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
