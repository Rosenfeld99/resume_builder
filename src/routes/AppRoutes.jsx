import React, { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Authentication, HomeScreen } from '../pages';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { ToastContainer } from 'react-toastify';

const AppRoutes = () => {
    const queryClient = new QueryClient(); // Create a QueryClient instance

    return (
        <QueryClientProvider client={queryClient}> {/* Pass the instance here */}
            <BrowserRouter>
                <Suspense fallback={<div>Loading...</div>}>
                    <Routes>
                        <Route path='/' element={<HomeScreen />} />
                        <Route path='/auth' element={<Authentication />} />
                    </Routes>
                </Suspense>
            </BrowserRouter>
            <ToastContainer />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default AppRoutes;
