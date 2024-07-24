import React, { createContext, useState } from 'react';

export const TemplateContext = createContext();

export const TemplateContextProvider = ({ children }) => {
    const [templates, setTemplates] = useState(null);
    const [currentTag, setCurrentTag] = useState(null);
    const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
    const [isError, setIsError] = useState(false);

    return (
        <TemplateContext.Provider value={{ isError, setIsError, templates, setTemplates, isLoadingTemplates, setIsLoadingTemplates, currentTag, setCurrentTag }}>
            {children}
        </TemplateContext.Provider>
    );
};
