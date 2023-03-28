import {getUnixTime} from 'date-fns';
import {
  collection,
  setDoc,
  doc,
  arrayUnion,
  DocumentData,
  arrayRemove,
} from 'firebase/firestore';

import {db} from '../firebase/firebase';

export const usersColRef = collection(db, 'users');

export const userDocRef = (id: string) => doc(db, 'users', `user${id}`);

export const uploadEmailToServer = async (id: string, email: string) => {
  await setDoc(doc(usersColRef, `user${id}`), {
    email,
  });
};

export const uploadUserOnlineStatus = async (
  id: string,
  onlineStatus: boolean,
) => {
  const signOutTime = getUnixTime(new Date());
  try {
    await setDoc(
      userDocRef(id),
      {onlineStatus, wasOnline: signOutTime},
      {merge: true},
    );
  } catch (e) {
    console.error(e);
  }
};

export const uploadProfileDataToServer = async (id: string, name: string) => {
  await setDoc(userDocRef(id), {name, id}, {merge: true});
};

export const uploadProfileAvatarToServer = async (
  id: string,
  image: string,
) => {
  await setDoc(userDocRef(id), {avatar: image}, {merge: true});
};

export const uploadContactToServer = async (id: string, userUid: string) => {
  try {
    await setDoc(
      userDocRef(id),
      {contacts: arrayUnion(userUid)},
      {merge: true},
    );
  } catch (e) {
    console.error(e);
  }
};

export const deleteContactFromDatabase = async (
  id: string,
  contactsUids: DocumentData[],
) => {
  try {
    contactsUids.forEach(async contact => {
      await setDoc(
        userDocRef(id),
        {contacts: arrayRemove(contact.id)},
        {merge: true},
      );
    });
  } catch (e) {
    console.error(e);
  }
};
