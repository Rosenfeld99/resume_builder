import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Authentication, HomeScreen, Profile, TemplateDetail,CreateTemplate, CreateResume } from '../pages';
import { ToastContainer } from 'react-toastify';
import { MainLoading } from '../components';


const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Suspense fallback={<MainLoading />}>
                <Routes>
                    <Route path='/' element={<HomeScreen />} />
                    <Route path='/auth' element={<Authentication />} />
                    <Route path='/create/template' element={<CreateTemplate />} />
                    <Route path='/profile/:uid' element={<Profile />} />
                    <Route path='/resume/*' element={<CreateResume />} />
                    <Route path='/resumeDetail/:templateID' element={<TemplateDetail />} />
                    <Route path='/*' element={<div>Page not found 404</div>} />
                </Routes>
            </Suspense>
            <ToastContainer />
        </BrowserRouter>
    );
}

export default AppRoutes;
