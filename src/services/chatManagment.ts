import {format, getUnixTime} from 'date-fns';
import {
  doc,
  setDoc,
  arrayUnion,
  updateDoc,
  arrayRemove,
  collection,
  deleteDoc,
} from 'firebase/firestore';
import {db} from '../firebase/firebase';
import {ChatType} from '../store/slices/markSlice';
import {userDocRef} from './userManagement';

export const chatsColRef = collection(db, 'chats');
export const messagesColRef = collection(db, 'messages');

export const chatDocRef = (chatId: string) => doc(db, 'chats', chatId);
export const messagesDocRef = (chatId: string) => doc(messagesColRef, chatId);
export const chatMesDocRef = (chatId: string) => doc(db, 'messages', chatId);

const sentAt = format(new Date(), 'H:mm');
const dateSentAt = format(new Date(), 'MMM d');
const unixSentAt = getUnixTime(new Date());

export const createChatAtDatabase = async (
  userId: string,
  chatId: string,
  members: string[],
  name: string[],
) => {
  const usersDocRef = doc(db, 'users', `user${userId}`);
  const chatRef = doc(db, 'chats', chatId);
  try {
    await setDoc(usersDocRef, {chats: arrayUnion(chatId)}, {merge: true});
    await setDoc(chatRef, {
      createdBy: userId,
      chatId,
      name: name,
      members,
      type: members.length > 2 ? 'group chat' : 'private chat',
    });
  } catch (e) {
    console.error(e);
  }
};

export const deleteChatsFromDatabase = async (
  uid: string,
  chats: ChatType[],
) => {
  try {
    chats.forEach(
      async c =>
        await updateDoc(userDocRef(uid), {
          chats: arrayRemove(c.id),
        }),
    );
    chats.forEach(async c => {
      if (c.membersCount === 1) {
        await deleteDoc(chatDocRef(c.id));
      } else {
        await updateDoc(chatDocRef(c.id), {
          members: arrayRemove(uid),
        });
      }
    });
  } catch (e) {
    console.error(e);
  }
};

export const sentMessageToDatabase = async (
  chatId: string,
  messageId: number,
  messageText: string,
  sentBy: string,
  sentByName: string | null,
) => {
  const chatMesSubColRed = collection(chatMesDocRef(chatId), 'messages');
  const mesDocRef = doc(chatMesSubColRed, `id${messageId}`);
  try {
    await setDoc(mesDocRef, {
      messageText,
      sentBy,
      messageId,
      sentByName,
      sentAt: {
        dateSentAt,
        HmmSentAt: sentAt,
        unixSentAt,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

export const deleteMessageFromDatabase = async (
  chatId: string,
  messageId: number,
) => {
  const chatMesSubColRef = collection(chatMesDocRef(chatId), 'messages');
  const mesDocRef = doc(chatMesSubColRef, `id${messageId}`);
  try {
    await deleteDoc(mesDocRef);
  } catch (e) {
    console.error(e);
  }
};

export const editMessageAtDatabase = async (
  chatId: string,
  messageId: number,
  messageText: string,
) => {
  const chatMesSubColRef = collection(chatMesDocRef(chatId), 'messages');
  const mesDocRef = doc(chatMesSubColRef, `id${messageId}`);
  try {
    updateDoc(mesDocRef, {
      messageText: messageText,
      status: 'Edited',
    });
  } catch (e) {
    console.error(e);
  }
};

export const replyOnMessageToDatabase = async (
  chatId: string,
  messageId: number,
  replyMessageId: number,
  messageText: string,
  replyMessageText: string,
  sentBy: string,
  sentByName: string | null,
  replySentByName: string,
) => {
  const chatMesSubColRef = collection(chatMesDocRef(chatId), 'messages');
  const mesDocRef = doc(chatMesSubColRef, `id${messageId}`);
  try {
    setDoc(mesDocRef, {
      messageId,
      messageText,
      replyMessageId,
      replyMessageText,
      sentAt: {
        dateSentAt,
        HmmSentAt: sentAt,
        unixSentAt,
      },
      sentBy,
      sentByName,
      replySentByName,
    });
  } catch (e) {
    console.error(e);
  }
};

export const addMemberToChatAtDatabase = async (
  chatId: string,
  members: string[],
) => {
  try {
    members.forEach(m => {
      setDoc(chatDocRef(chatId), {members: arrayUnion(m)}, {merge: true});
    });
  } catch (e) {
    console.error(e);
  }
};

export const deleteMemberFromChatAtDatabase = async (
  chatId: string,
  members: string[],
) => {
  try {
    members.forEach(m => {
      setDoc(chatDocRef(chatId), {members: arrayRemove(m)}, {merge: true});
    });
  } catch (e) {
    console.error(e);
  }
};

export const uploadNewNameOfChatToDatabase = async (
  chatId: string,
  chatName: string,
) => {
  try {
    setDoc(chatDocRef(chatId), {name: [chatName]}, {merge: true});
  } catch (e) {
    console.error(e);
  }
};

export const uploadNewAvatrOfChatToDatabase = async (
  chatId: string,
  chatAvatar: string[],
) => {
  try {
    setDoc(chatDocRef(chatId), {chatAvatar}, {merge: true});
  } catch (e) {
    console.error(e);
  }
};
