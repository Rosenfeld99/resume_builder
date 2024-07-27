import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase.config";

export const getTemplateDetailEditByUser = (uid, id) => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onSnapshot(
      doc(db, "users", uid, "resumes", id),
      (doc) => {
        resolve(doc.data());
        // console.log(doc.data());
      }
    );

    return unsubscribe;
  });
};
