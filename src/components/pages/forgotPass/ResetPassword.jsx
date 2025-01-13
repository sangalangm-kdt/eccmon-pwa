import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        navigate("/")
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-secondary">
            <div className="text-center bg-white p-8 rounded-lg shadow-md">
                <h1 className="text-xl font-bold mb-2 text-gray-700">Reset password</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className='text-sm text-gray-600'>You can now change your password.</p>
                    <label className="block text-left text-sm text-gray-600">Password</label>
                    <input 
                        type="password" 
                        placeholder='Enter new password'
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full p-2 border text-sm border-gray-300 rounded focus:outline-cyan-400"
                    />
                    <label className="block text-left text-sm text-gray-600">Confirm password</label>
                    <input 
                        type="password" 
                              placeholder='Confirm new password'
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="w-full p-2 border text-sm border-gray-300 rounded focus:outline-cyan-400"
                    />
           
                    <button type="submit" className="w-full bg-cyan-to-blue text-white p-2 rounded hover:bg-blue-600">Submit</button>
                </form>
                {message && <p className="mt-4 text-green-500">{message}</p>}
            </div>
        </div>
    );
};

export default ResetPassword;
