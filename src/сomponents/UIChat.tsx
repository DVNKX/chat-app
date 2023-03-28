import {CommonActions, useNavigation} from '@react-navigation/native';
import {getUnixTime} from 'date-fns';
import {
  collection,
  doc,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, {useCallback, useEffect, useState} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useStore} from 'react-redux';
import {NavigationProps} from '../../App';
import {auth, db} from '../firebase/firebase';
import {useAppSelector} from '../hooks/redux';
import {userDocRef} from '../services/userManagement';
import {markSlice} from '../store/slices/markSlice';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';
import {Routes} from '../utils/routes';

interface IChatProps {
  chatAvatar?: string;
  chatName: string[];
  chatId: string;
  chatType: string;
  lastMessage?: string;
  status: boolean;
  members: string[];
  createdBy: string;
  markable: boolean;
}

export const UIChat: React.FC<IChatProps> = ({
  chatAvatar,
  chatName,
  chatId,
  chatType,
  members,
  createdBy,
  markable,
}) => {
  const [lastMessage, setLastMessage] = useState<DocumentData>();
  const [userAvatar, setUserAvatar] = useState<string>();
  const dateNow = getUnixTime(new Date());
  const navigation = useNavigation<NavigationProps>();
  const store = useStore();
  const markedChats = useAppSelector(state => state.mark.chats);
  const id = useAppSelector(state => state.user.id);

  const userId = members.filter(m => m !== id);

  const toggleMark = () => {
    if (markedChats.find(mc => mc.id === chatId)) {
      store.dispatch(
        markSlice.actions.deleteChats({
          id: chatId,
          membersCount: members.length,
        }),
      );
    } else {
      store.dispatch(
        markSlice.actions.addChats({id: chatId, membersCount: members.length}),
      );
    }
  };

  const chatN = chatName.filter(
    name => !name.includes(auth.currentUser?.displayName!),
  );

  const navigateToChat = useCallback(() => {
    navigation.dispatch(
      CommonActions.navigate({
        name: Routes.CHAT,
        params: {
          chatN,
          chatId,
          members,
        },
      }),
    );
  }, [navigation]);

  useEffect(() => {
    const messagesDocRef = doc(db, 'messages', chatId);
    const messagesDocColRef = collection(messagesDocRef, 'messages');
    const q = query(messagesDocColRef, orderBy('messageId', 'desc'), limit(1));
    onSnapshot(
      q,
      message => {
        setLastMessage(message.docs.map(m => m.data()));
      },
      e => console.error(e),
    );
    if (chatType === 'private chat') {
      onSnapshot(userDocRef(userId.toString()), doc => {
        if (doc.exists()) {
          setUserAvatar(doc.data().avatar);
        }
      });
    }
  }, []);

  return (
    <TouchableOpacity
      disabled={markable}
      style={styles.user}
      onPress={navigateToChat}>
      <Image
        style={chatType === 'group chat' ? styles.chatType : styles.avatar}
        source={
          chatAvatar
            ? chatAvatar
            : !chatAvatar
            ? {uri: userAvatar}
            : !userAvatar && ASSETS.defaultAvatarImage
        }
      />
      <View style={styles.userData}>
        <View style={styles.chatNameDate}>
          <Text
            style={[styles.text, {width: 200}]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {createdBy === id && chatType === 'private chat'
              ? chatName[1]
              : createdBy !== id && chatType === 'private chat'
              ? chatName[0]
              : chatName[0] && chatType === 'group chat' && chatN}
          </Text>
          {!markable && (
            <Text style={styles.lastMessageDate}>
              {lastMessage &&
              dateNow -
                lastMessage.map(
                  (m: {sentAt: {UnixSentAt: number}}) => m.sentAt.UnixSentAt,
                ) >=
                86400
                ? lastMessage.map(
                    (m: {sentAt: {HmmSentAt: string}}) => m.sentAt.HmmSentAt,
                  )
                : lastMessage &&
                  lastMessage.map(
                    (m: {sentAt: {dateSentAt: number}}) => m.sentAt.dateSentAt,
                  )}
            </Text>
          )}
        </View>
        <View style={styles.lastMessage}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.lastMessageText}>
            {lastMessage &&
              lastMessage.map((m: {messageText: string}) => m.messageText)}
          </Text>
        </View>
        {markable && chatType !== 'private chat' && (
          <TouchableOpacity style={styles.markBtn} onPress={toggleMark}>
            <Image
              source={
                Boolean(markedChats.find(mc => mc.id === chatId))
                  ? ASSETS.focusedCircle
                  : ASSETS.circle
              }
              style={styles.mark}
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  user: {
    width: 327,
    height: 68,
    paddingLeft: 33,
    flexDirection: 'row',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  chatType: {
    width: 48,
    height: 48,
    borderRadius: 16,
  },
  userData: {
    paddingLeft: 12,
    width: 259,
    height: 56,
  },
  chatNameDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 14,
  },
  lastMessage: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  lastMessageText: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 12,
    paddingTop: 6,
    color: AppColors.storyBorder,
    width: 200,
  },
  lastMessageDate: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 10,
    color: AppColors.storyBorder,
  },
  markBtn: {
    position: 'absolute',
    marginTop: 15,
    marginLeft: 250,
  },
  mark: {
    width: 20,
    height: 20,
  },
});
