import { auth } from "../config/firebase.config";

export const getUserDetail = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged((userCard) => {
      console.log(userCard);
      if (userCard) {
        const userData = userCard.providerData[0];
      } else {
        reject(new Error("User not authenticatrd"));
      }

      //   make sure to unsubscribe listener
      unsubscribe();
    });
  });
};
