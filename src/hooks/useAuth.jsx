import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, db } from '../config/firebase.config';
import { toast } from 'react-toastify';

const useAuth = () => {
    const { currentUser, setCurrentUser, isLoading, setIsLoading } = useContext(AuthContext);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            console.log(user);
            if (user) {
                await getUserExists(user, setCurrentUser);
                // setCurrentUser(user)
            } else {
                setCurrentUser(null);
                setIsLoading(false);
            }
        });
        return () => unsub();
    }, [setCurrentUser, setIsLoading]);

    const getUserExists = async (user, setCurrentUser) => {
        const docRef = doc(db, "users", user.uid);
        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setCurrentUser(docSnap.data());
                return true
            }
        } catch (error) {
            console.error("Error fetching user document:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignup = async (e, data, navigate) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await createUserWithEmailAndPassword(auth, data.email, data.password);
            await setDoc(doc(db, "users", res.user.uid), {
                email: data.email,
                displayName: data.displayName,
                photoURL: data.photoURL || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
                role: "user",
                timeStamp: serverTimestamp(),
                collections: [],
                id: res.user.uid
            });
            navigate('/login');
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegisterWithGoogle = async (navigate) => {
        setIsLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            const userExists = await getUserExists(user, setCurrentUser);
            if (!userExists) {
                await setDoc(doc(db, "users", user.uid), {
                    email: user.email,
                    displayName: user.displayName,
                    photoURL: user.photoURL,
                    role: "user",
                    date: serverTimestamp(),
                    collections: [],
                    id: user?.uid
                });
                toast.success(`Signup with Google ;)`);
                navigate('/');
            } else {
                toast.success(`Sign in with Google`);
                navigate('/');
            }
        } catch (error) {
            console.error("Error during Google sign-in:", error);
            toast.error(`Error signing in with ${provider}: ${error.message}`);

        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async (navigate) => {
        setIsLoading(true);
        try {
            await signOut(auth);
            setCurrentUser(null);
            navigate('/auth');
        } catch (error) {
            console.error("Error during sign-out:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return { currentUser, isLoading, handleSignup, handleRegisterWithGoogle, handleSignOut,setCurrentUser };
};

export default useAuth;
