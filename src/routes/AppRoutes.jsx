import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Authentication, HomeScreen } from '../pages';
import { ToastContainer } from 'react-toastify';
import { MainLoading } from '../components';
import CreateTemplate from '../pages/CreateTemplate';

const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Suspense fallback={<MainLoading />}>
                <Routes>
                    <Route path='/' element={<HomeScreen />} />
                    <Route path='/auth' element={<Authentication />} />
                    <Route path='/create/template' element={<CreateTemplate />} />
                </Routes>
            </Suspense>
            <ToastContainer />
        </BrowserRouter>
    );
}

export default AppRoutes;
