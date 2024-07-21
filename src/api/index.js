import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.config";

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCard) => {
      console.log(userCard);
      if (userCard) {
        const userData = userCard.providerData[0];

        const unsubscribe = onSnapshot(
          doc(db, "users", userData?.uid),
          (_doc) => {
            if (_doc) {
              resolve(_doc.data());
            } else {
              setDoc(
                doc(doc(db, "users", userData?.uid), (_doc) => {
                  resolve(userData);
                })
              );
            }
          }
        );
        return unsubscribe;
      } else {
        reject(new Error("User not authenticatrd"));
      }

      //   make sure to unsubscribe listener
      unsubscribe();
    });
  });
};
