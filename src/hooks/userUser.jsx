import React from 'react';
import { toast } from 'react-toastify';
import useAuth from './useAuth';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import useTemplate from './useTemplate';

const useUser = () => {
    const { currentUser, isLoading, setCurrentUser } = useAuth();
    const { setTemplates, templates, templateSingle, setTemplateSingle } = useTemplate();

    const saveToCollections = async (item) => {
        if (!currentUser) {
            toast.error("User is not logged in");
            return;
        }

        const userId = currentUser.id;
        const userCollections = currentUser.collections || [];

        if (!item || !item.id) {
            toast.error("Invalid item");
            return;
        }

        try {
            const docRef = doc(db, "users", userId);

            if (!userCollections.includes(item.id)) {
                console.log("Adding item to collections...");
                await updateDoc(docRef, {
                    collections: arrayUnion(item.id)
                });
                userCollections.push(item?.id);
                setCurrentUser({ ...currentUser, collections: userCollections });
                toast.success("Saved to collections");
            } else {
                console.log("Removing item from collections...");
                await updateDoc(docRef, {
                    collections: arrayRemove(item.id)
                });
                const filteredUserCollections = userCollections?.filter((single) => single != item?.id);
                setCurrentUser({ ...currentUser, collections: filteredUserCollections });
                toast.success("Removed from collections");
            }
        } catch (err) {
            console.error("Error updating document:", err);
            toast.error(`Error: ${err.message}`);
        }
        console.log(currentUser);
    };

    const saveToFavouries = async (item) => {
        if (!currentUser) {
            toast.error("User is not logged in");
            return;
        }

        if (!item || !item.id) {
            toast.error("Invalid item");
            return;
        }

        const userId = currentUser.id;
        const docRef = doc(db, "templates", item.id);
        const isFavourited = item.favouries?.includes(userId);

        try {
            const updatedFavouries = isFavourited
                ? arrayRemove(userId)
                : arrayUnion(userId);
            await updateDoc(docRef, { favouries: updatedFavouries });

            const newTemplates = templates.map(template =>
                template.id === item.id
                    ? {
                        ...template, favouries: isFavourited
                            ? template.favouries.filter(id => id !== userId)
                            : [...template.favouries, userId]
                    }
                    : template
            );

            setTemplates(newTemplates);
            if (templateSingle?.id === item.id) {
                setTemplateSingle({
                    ...templateSingle,
                    favouries: isFavourited
                        ? templateSingle.favouries.filter(id => id !== userId)
                        : [...templateSingle.favouries, userId]
                });
            }
            toast.success(isFavourited ? "Removed from favouries" : "Added to favouries");
            return true;
        } catch (err) {
            console.error("Error updating document:", err);
            toast.error(`Error: ${err.message}`);
            return false;
        }
    };

    return { currentUser, isLoading, saveToCollections, saveToFavouries };
};

export default useUser;
