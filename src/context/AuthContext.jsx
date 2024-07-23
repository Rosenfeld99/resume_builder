import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, isLoading, setIsLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
