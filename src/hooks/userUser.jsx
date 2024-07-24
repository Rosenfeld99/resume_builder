import React from 'react';
import { toast } from 'react-toastify';
import useAuth from './useAuth';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase.config';

const useUser = () => {
    const { currentUser, isLoading } = useAuth();

    const saveToCollections = async (item) => {
        if (!currentUser) {
            toast.error("User is not logged in");
            return;
        }

        const userId = currentUser.id;
        const userCollections = currentUser.collections || [];

        // Debugging logs
        console.log("currentUser:", currentUser);
        console.log("userCollections:", userCollections);
        console.log("item:", item);

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
                toast.success("Saved to collections");
            } else {
                console.log("Removing item from collections...");
                await updateDoc(docRef, {
                    collections: arrayRemove(item.id)
                });
                toast.success("Removed from collections");
            }
        } catch (err) {
            console.error("Error updating document:", err);
            toast.error(`Error: ${err.message}`);
        }
    };

    return { currentUser, isLoading, saveToCollections };
};

export default useUser;
