import React, { createContext, useState } from 'react';

export const ResumeContext = createContext();

export const ResumeContextProvider = ({ children }) => {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <ResumeContext.Provider
      value={{
        resume, setResume,
        isLoading, setIsLoading,
        isError, setIsError,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};
