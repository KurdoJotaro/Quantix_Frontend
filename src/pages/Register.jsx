import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        birthDate: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const response = await register(formData);
            if (response.success) {
                setSuccess('Registration successful! Please check your email to verify your account.');
                setTimeout(() => navigate('/login'), 3000); // Redirect after 3s
            } else {
                setError(response.message || 'Registration failed.');
            }
        } catch (err) {
            // Axios error handling
            const apiError = err.response?.data;
            if (apiError?.errors && Array.isArray(apiError.errors)) {
                setError(apiError.errors.join(', '));
            } else {
                setError(apiError?.message || 'Registration failed. Please try again.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-body py-12">
            <div className="w-full max-w-md p-8 card">
                <h2 className="text-2xl font-bold text-center mb-2">Create Account</h2>
                <p className="text-center text-secondary mb-6">Join Quantix to track your finances</p>

                {error && <div className="text-error mb-4 bg-red-500/10 p-3 rounded text-sm">{error}</div>}
                {success && <div className="text-success mb-4 bg-green-500/10 p-3 rounded text-sm">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            className="form-input"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group relative">
                        <label className="form-label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                className="form-input pr-10"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary hover:text-primary transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="text-xs text-secondary mt-1">Min 6 chars, 1 upper, 1 lower, 1 number, 1 special</p>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Birth Date (Optional)</label>
                        <input
                            type="date"
                            name="birthDate"
                            className="form-input"
                            value={formData.birthDate}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="w-full btn btn-primary mt-4">
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-secondary">
                    Already have an account? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
