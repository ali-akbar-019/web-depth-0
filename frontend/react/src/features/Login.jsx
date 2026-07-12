import { useDispatch, useSelector } from 'react-redux'
import { clearError, login, selectAuthError, selectAuthLoading, selectUser } from './authSlice';
import { useState } from 'react';
const Login = () => {
    const disptch = useDispatch();
    const user = useSelector(selectUser)
    const error = useSelector(selectAuthError)
    const loading = useSelector(selectAuthLoading)
    const [formD, setFormD] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormD((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
        if (error) disptch(clearError())

    }

    const handleSubmit = (e) => {
        e.preventDefault();
        disptch(login(formD))

    }
    return (<div className="login-container">
        <h2>Login</h2>

        {error && (
            <div className="error-message">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                />
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="login-btn"
            >
                {isLoading ? 'Logging in...' : 'Login'}
            </button>
        </form>
    </div>
    );
}

export default Login