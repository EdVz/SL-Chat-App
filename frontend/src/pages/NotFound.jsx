import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
    return (
        <div className='flex flex-col items-center'>
            <h1 className='mt-12 text-xl mb-2'>
                Oops! It looks like the page you are looking for does not exist
            </h1>
            <Link className='text-gray-400' to={'/chat'}>Back to Chat Page</Link>
        </div>
    )
}

export default NotFound