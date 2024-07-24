import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Authentication, HomeScreen, Profile, TemplateDetail } from '../pages';
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
                    <Route path='/profile/:uid' element={<Profile />} />
                    <Route path='/resume/*' element={<div>Resume * all</div>} />
                    <Route path='/resumeDetail/:templateID' element={<TemplateDetail />} />
                </Routes>
            </Suspense>
            <ToastContainer />
        </BrowserRouter>
    );
}

export default AppRoutes;
