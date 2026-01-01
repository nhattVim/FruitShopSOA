import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const success = await login(username, password);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid username or password');
        }
    };

    return (
        <div className="container min-vh-100 d-flex align-items-center justify-content-center bg-light">
            <div className="card shadow border-0" style={{ width: '400px' }}>
                <div className="card-body p-5">
                    <div className="text-center mb-4">
                        <i className="bi bi-shop display-4 text-primary"></i>
                        <h3 className="mt-3">Welcome Back</h3>
                        <p className="text-muted">Fruit Shop Management</p>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100 py-2">
                            Sign In
                        </button>
                    </form>

                    <div className="text-center mt-3 text-muted small">
                        <p>Default Admin: admin / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
