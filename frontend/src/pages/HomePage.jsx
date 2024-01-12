import React, { useState } from 'react'
import Login from '../components/Authentication/Login'
import Register from '../components/Authentication/Register';

export default function HomePage() {
    const [formDisplay, setFormDisplay] = useState('login');
    return (
        <div className='bg-blue-50 h-screen flex flex-col justify-center'>
            <div className='bg-white md:w-3/4 lg:w-1/3 w-full border rounded-xl shadow-lg mx-auto p-6 mb-12'>
                <h2 className='text-center mb-6 mt-6 text-xl'>Welcome To SL-Chat!</h2>
                <div className='w-2/3 mx-auto flex justify-center'>
                    <button
                        className={`${formDisplay === 'login' ? 'home text-white' : 'text-black'} w-1/2   border border-black-300 rounded-l-xl py-1 px-3`}
                        onClick={() => setFormDisplay('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`${formDisplay === 'register' ? 'home text-white' : 'text-black'} w-1/2  border border-black-300 rounded-r-xl py-1 px-3`}
                        onClick={() => setFormDisplay('register')}
                    >
                        Register
                    </button>
                </div>
                {formDisplay === 'login' ? <Login /> : <Register />}

            </div>
        </div>
    )
}
