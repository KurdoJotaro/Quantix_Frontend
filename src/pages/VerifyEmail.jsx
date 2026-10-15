import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api, { getApiError } from '../services/api';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('');
    const verification = useRef(null);
    const userId = searchParams.get('userId');
    const token = searchParams.get('token');

    useEffect(() => {
        if (!userId || !token) {
            setStatus('error');
            setMessage('Invalid verification link.');
            return;
        }

        let active = true;
        setStatus('verifying');
        if (verification.current?.userId !== userId || verification.current?.token !== token) {
            verification.current = {
                userId,
                token,
                request: api.get('/auth/verify-email', { params: { userId, token } }),
            };
        }

        verification.current.request.then(() => {
            if (active) setStatus('success');
        }).catch((error) => {
            if (!active) return;
            setStatus('error');
            setMessage(getApiError(error, 'Verification failed. Link might be expired.'));
        });

        return () => { active = false; };
    }, [userId, token]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-body text-center">
            <div className="card max-w-md w-full p-8">
                {status === 'verifying' && (
                    <div role="status">
                        <h2 className="text-xl font-bold mb-2">Verifying Email...</h2>
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    </div>
                )}
                {status === 'success' && (
                    <div role="status">
                        <h2 className="text-xl font-bold text-success mb-2">Email Verified!</h2>
                        <p className="text-secondary mb-4">You can now sign in to your account.</p>
                        <Link to="/login" className="btn btn-primary">Go to Login</Link>
                    </div>
                )}
                {status === 'error' && (
                    <div role="alert">
                        <h2 className="text-xl font-bold text-danger mb-2">Verification Failed</h2>
                        <p className="text-secondary mb-4">{message}</p>
                        <Link to="/login" className="btn btn-primary">Go to Login</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
