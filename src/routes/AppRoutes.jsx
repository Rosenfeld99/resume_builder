import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<h1 className=' bg-red-600'>App</h1>} />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;
