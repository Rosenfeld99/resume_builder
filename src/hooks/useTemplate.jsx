import { useContext, useEffect, useCallback } from 'react';
import { TemplateContext } from '../context/TemplateContext';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { toast } from 'react-toastify';

const useTemplate = () => {
  const {
    templates,
    setTemplates,
    isLoadingTemplates,
    setIsLoadingTemplates,
    currentTag,
    setCurrentTag,
    templateSingle,
    setTemplateSingle,
    isError,
    setIsError,
    isLoadingSingleTemplate,
    setIsLoadingSingleTemplate,
  } = useContext(TemplateContext);

  // Use useCallback to memoize the function
  const fetchTemplates = useCallback(async () => {
    setIsLoadingTemplates(true);
    try {
      const templatesCollection = collection(db, 'templates');
      const templatesSnapshot = await getDocs(templatesCollection);
      const templatesList = templatesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTemplates(templatesList);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setIsError(true);
    } finally {
      setIsLoadingTemplates(false);
    }
  }, [setIsLoadingTemplates, setTemplates, setIsError]);

  // Use useCallback to memoize the function
  const fetchSingleTemplateByID = useCallback(async (templateID) => {
    setIsLoadingSingleTemplate(true);
    const docRef = doc(db, 'templates', templateID);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTemplateSingle(docSnap.data());
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
      console.error('Error fetching user document:', error);
    } finally {
      setIsLoadingSingleTemplate(false);
    }
  }, [setIsLoadingSingleTemplate, setTemplateSingle, toast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  return {
    templates,
    setTemplates,
    isLoadingTemplates,
    fetchTemplates,
    currentTag,
    setCurrentTag,
    isError,
    setIsError,
    fetchSingleTemplateByID,
    templateSingle,
    setTemplateSingle,
    isLoadingSingleTemplate,
    setIsLoadingSingleTemplate,
  };
};

export default useTemplate;
