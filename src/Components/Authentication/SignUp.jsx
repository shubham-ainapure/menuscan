import React, { useState } from 'react';
import '../../Styles/SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../../appwrite/auth';
import Button from '../Button';
import { login } from '../../Store/authSlice';

const SignUp = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        // authService.logout();
        try {
            const success = await authService.createAccount(user.name, user.email, user.password);
            console.log('success', success);
            if (success) {
                const userData = await authService.getUser();
                console.log('user', userData);
                if (userData) {
                    dispatch(login(userData));
                }
                navigate('/restaurant-form');
                setLoading(false);
            }
        } catch (error) {
            setError(error.message || 'An unknown error occurred');
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2>Sign Up</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                    />
                </div>
                <div className="input-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                </div>
                {error && <span className="error-message">{error}</span>}
                <Button type='submit' name='Sign Up' loading={loading} />
            </form>
        </div>
    );
};

export default SignUp;
