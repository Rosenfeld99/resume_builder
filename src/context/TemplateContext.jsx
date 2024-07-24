import React, { createContext, useState } from 'react';

export const TemplateContext = createContext();

export const TemplateContextProvider = ({ children }) => {
  const [templates, setTemplates] = useState(null);
  const [templateSingle, setTemplateSingle] = useState(null);
  const [currentTag, setCurrentTag] = useState(null);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true);
  const [isLoadingSingleTemplate, setIsLoadingSingleTemplate] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <TemplateContext.Provider
      value={{
        templates,
        setTemplates,
        templateSingle,
        setTemplateSingle,
        currentTag,
        setCurrentTag,
        isLoadingTemplates,
        setIsLoadingTemplates,
        isLoadingSingleTemplate,
        setIsLoadingSingleTemplate,
        isError,
        setIsError,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};
