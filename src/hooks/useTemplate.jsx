import { useContext, useEffect } from 'react';
import { TemplateContext } from '../context/TemplateContext';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';

const useTemplate = () => {
    const { templates, setTemplates, isLoadingTemplates, setIsLoadingTemplates, currentTag, setCurrentTag, isError, setIsError } = useContext(TemplateContext);

    useEffect(() => {
        fetchTemplates();
    }, [setTemplates, setIsLoadingTemplates]);

    const fetchTemplates = async () => {
        setIsLoadingTemplates(true);
        try {
            const templatesCollection = collection(db, 'templates');
            const templatesSnapshot = await getDocs(templatesCollection);
            const templatesList = templatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTemplates(templatesList);
        } catch (error) {
            console.error("Error fetching templates:", error);
            setIsError(true)
        } finally {
            setIsLoadingTemplates(false);
        }
    };

    return { templates, isLoadingTemplates, fetchTemplates, currentTag, setCurrentTag, isError, setIsError };
};

export default useTemplate;
