import {
  collection,
  setDoc,
  doc,
  arrayUnion,
  DocumentData,
} from 'firebase/firestore';
import {db} from '../firebase/firebase';

export const usersColRef = collection(db, 'Users');

export const usersDocRef = (id: string) => doc(db, 'Users', `user${id}`);

export const uploadEmailToServer = async (id: string, email: string) => {
  await setDoc(doc(usersColRef, `user${id}`), {
    email,
  });
};

export const uploadUserOnlineStatus = async (id: string, online: boolean) => {
  const usersDocRef = doc(db, 'Users', `user${id}`);
  await setDoc(usersDocRef, {onlineStatus: online}, {merge: true});
};

export const uploadProfileDataToServer = async (id: string, name: string) => {
  const usersDocRef = doc(db, 'Users', `user${id}`);
  await setDoc(usersDocRef, {name}, {merge: true});
};

export const uploadContactToServer = async (id: string, user: DocumentData) => {
  const usersDocRef = doc(db, 'Users', `user${id}`);
  await setDoc(usersDocRef, {contacts: arrayUnion(user)}, {merge: true});
};
