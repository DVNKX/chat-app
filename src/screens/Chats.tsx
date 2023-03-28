import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {ASSETS} from '../utils/assets';
import {UIChat} from '../сomponents/UIChat';
import {UISearchInput} from '../сomponents/UISearchInput';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../App';
import {Routes} from '../utils/routes';
import {
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {auth} from '../firebase/firebase';
import {useStore} from 'react-redux';
import {userSlice} from '../store/slices/userSlice';
import {userDocRef} from '../services/userManagement';
import {AppColors} from '../utils/colors';
import {useAppSelector} from '../hooks/redux';
import {markSlice} from '../store/slices/markSlice';
import {chatsColRef, deleteChatsFromDatabase} from '../services/chatManagment';
import {LoadingOverlay} from '../сomponents/LoadingOverlay';

export const Chats = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProps>();
  const store = useStore();
  const [chats, setChats] = useState<DocumentData[]>();
  const [search, setSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isMarkable, setIsMarkeble] = useState<boolean>(false);
  const markedChats = useAppSelector(state => state.mark.chats);
  const id = useAppSelector(state => state.user.id);

  const navigateToCreateChat = useCallback(() => {
    store.dispatch(markSlice.actions.annulContactsList());
    setIsMarkeble(false);
    navigation.navigate(Routes.CREATE_CHAT);
  }, [navigation]);

  const toggleDeleteChats = useCallback(() => {
    setIsMarkeble(!isMarkable);
    store.dispatch(markSlice.actions.annulChats());
  }, [isMarkable]);

  const deleteGroup = () => {
    deleteChatsFromDatabase(id, markedChats);
    store.dispatch(markSlice.actions.annulChats());
    setIsMarkeble(false);
  };

  const plugStoryWarning = () => {
    Alert.alert(
      'Warning',
      'This is plug button. Opportunity story share feature will be release in future updates!',
      [{text: 'Got it.'}],
    );
  };

  const getChats = async () => {
    try {
      const q = query(
        chatsColRef,
        where('members', 'array-contains', auth.currentUser!.uid),
      );
      const chatsSnap = await getDocs(q);
      setChats(chatsSnap.docs.map(doc => doc.data()));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    getChats();
    const q = query(chatsColRef, where('members', 'array-contains', id));
    onSnapshot(
      q,
      chats => {
        setIsLoading(true);
        setChats(chats.docs.map(c => c.data()));
        setIsLoading(false);
      },
      e => {
        console.error(e);
        setIsLoading(false);
      },
    );
    onSnapshot(userDocRef(id), doc => {
      if (doc.exists()) {
        store.dispatch(
          userSlice.actions.setInfo({
            name: doc.data().name,
            image: doc.data().avatar,
          }),
        );
      }
    });
    store.dispatch(
      userSlice.actions.setUser({
        id: auth.currentUser!.uid,
      }),
    );

    store.dispatch(
      userSlice.actions.setInfo({
        name: auth.currentUser!.displayName,
        email: auth.currentUser!.email,
      }),
    );
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getChats();
  }, [isFocused]);

  let chatsToDisplay = chats;

  if (chats) {
    if (search !== '') {
      chatsToDisplay = chats.filter(chat =>
        chat.name.toString().includes(search),
      );
    }
  }

  return (
    <View style={styles.container}>
      {isLoading && <LoadingOverlay />}
      <View style={styles.header}>
        <View style={styles.content}>
          <View style={styles.textBlock}>
            <Text style={styles.headerText}>Chats</Text>
          </View>
          <View style={styles.btnBlock}>
            <TouchableOpacity
              style={styles.addChat}
              onPress={navigateToCreateChat}>
              <Image style={styles.headerBtn} source={ASSETS.addChat} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.hamburger}
              onPress={toggleDeleteChats}>
              <Image style={styles.headerBtn} source={ASSETS.hamburger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.storyContainer}>
        <ScrollView horizontal={true}>
          <View style={styles.storyPos}>
            <TouchableOpacity style={styles.story} onPress={plugStoryWarning}>
              <View style={styles.userStory}>
                <View style={styles.avatarPos}>
                  <View style={styles.userAvatarPos}>
                    <Text style={styles.userAvatar}>+</Text>
                  </View>
                </View>
              </View>
              <View style={styles.namePos}>
                <Text style={styles.storyName}>Your Story</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <View style={styles.border} />
      <View style={styles.contactList}>
        <View style={styles.inputPos}>
          <UISearchInput
            placeholder="Search"
            placeholderTextColor={AppColors.playceholderColor}
            fontColor={AppColors.inputFont}
            value={search}
            onChangeText={setSearch}
            focusable={false}
          />
        </View>
        <FlatList
          data={chatsToDisplay}
          renderItem={
            chatsToDisplay &&
            (chat => (
              <UIChat
                key={chat.item.chatId}
                chatAvatar={chat.item.chatAvatar}
                chatName={chat.item.name}
                chatId={chat.item.chatId}
                status={false}
                chatType={chat.item.type}
                lastMessage={chat.item.lastMessage}
                members={chat.item.members}
                createdBy={chat.item.createdBy}
                markable={isMarkable}
              />
            ))
          }
        />
      </View>
      {isMarkable && (
        <View style={styles.deleteChatsVeiw}>
          <View style={styles.border} />
          <TouchableOpacity
            disabled={markedChats.length === 0}
            onPress={deleteGroup}
            style={styles.deleteChatsButton}>
            <Image
              source={
                markedChats.length === 0 ? ASSETS.trashCan : ASSETS.fullTrashCan
              }
              style={styles.trashCan}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: AppColors.white,
  },
  header: {
    width: '100%',
    height: 90,
    paddingTop: 47,
    paddingBottom: 13,
    paddingLeft: 24,
    paddingRight: 24,
  },
  content: {
    height: 30,
    width: 327,
    backgroundColor: AppColors.white,
    flexDirection: 'row',
  },
  textBlock: {
    width: 263,
    height: '100%',
  },

  headerText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 18,
    paddingTop: 3,
  },
  headerBtn: {
    height: 19,
    width: 19,
  },
  btnBlock: {
    width: 56,
    height: 24,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    flexDirection: 'row',
  },
  addChat: {paddingTop: 2, paddingBottom: 2, paddingLeft: 3, paddingRight: 3},
  hamburger: {paddingTop: 2, paddingBottom: 2, paddingLeft: 8},
  storyContainer: {
    width: '100%',
    height: 104,
  },
  storyPos: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
  },
  story: {
    backgroundColor: AppColors.white,
    paddingRight: 16,
  },
  userStory: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: AppColors.storyBorder,
    borderRadius: 16,
  },
  userAvatarPos: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    backgroundColor: AppColors.storyBackground,
    borderRadius: 16,
  },
  avatarPos: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  userAvatar: {
    fontSize: 21,
    color: AppColors.black,
  },
  namePos: {
    paddingTop: 4,
    alignItems: 'center',
  },
  storyName: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 10,
  },
  border: {
    width: 400,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.primaryBorder,
  },
  contactList: {
    width: '100%',
    height: '100%',
  },
  inputPos: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  deleteChatsVeiw: {
    position: 'absolute',
    marginTop: 725,
    width: '100%',
    height: 50,
    backgroundColor: AppColors.white,
  },
  deleteChatsButton: {
    alignItems: 'center',
    marginTop: 7,
    width: '100%',
  },
  trashCan: {
    width: 30,
    height: 30,
    opacity: 0.8,
    paddingTop: 10,
    tintColor: AppColors.error,
  },
});
