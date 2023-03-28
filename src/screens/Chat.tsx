import {useNavigation, useRoute} from '@react-navigation/native';
import {collection, DocumentData, onSnapshot} from 'firebase/firestore';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {useStore} from 'react-redux';
import {NavigationProps} from '../../App';
import {useAppSelector} from '../hooks/redux';
import {messageSlice} from '../store/slices/messageSlice';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';
import {Routes} from '../utils/routes';
import {UIMessage} from '../сomponents/UIMessage';
import {UIInfoModal} from '../сomponents/UIInfoModal';
import Modal from 'react-native-modal';
import {UISearchInput} from '../сomponents/UISearchInput';
import {LoadingOverlay} from '../сomponents/LoadingOverlay';
import {AudioImageModal} from '../сomponents/Audio&ImageModal.tsx';
import {
  editMessageAtDatabase,
  replyOnMessageToDatabase,
  sentMessageToDatabase,
} from '../services/chatManagment';
import {db} from '../firebase/firebase';

export const Chat = () => {
  const {type, messageId, message, sentByName} = useAppSelector(
    state => state.message,
  );

  const route = useRoute();
  const navigation = useNavigation<NavigationProps>();
  const {chatName, chatId, members}: any = route.params;
  const [messageText, setMessageText] = useState<string>('');
  const [messages, setMessages] = useState<DocumentData[]>();
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [searchView, setSearchView] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const flatListRef = useRef<FlatList>(null);
  const textInputRef = useRef<TextInput>(null);

  const store = useStore();

  const id = useAppSelector(state => state.user.id);
  const name = useAppSelector(state => state.user.name);

  const annulMessage = () => {
    store.dispatch(messageSlice.actions.annulMessage());
  };

  const cancelEditing = () => {
    annulMessage();
    setMessageText(' ');
  };

  const navigateToTabs = useCallback(() => {
    store.dispatch(messageSlice.actions.annulMessage());
    navigation.navigate(Routes.TABS, {screen: Routes.CHATS});
  }, [navigation]);

  const sentMessage = () => {
    setIsLoading(true);
    const newMessageId = Math.round(new Date().getTime() + Math.random() * 100);
    switch (type) {
      case 'Edit':
        editMessageAtDatabase(chatId, messageId, messageText);
        store.dispatch(messageSlice.actions.annulMessage());
        break;
      case 'Reply':
        replyOnMessageToDatabase(
          chatId,
          newMessageId,
          messageId,
          messageText,
          message,
          id,
          name,
          sentByName,
        );
        store.dispatch(messageSlice.actions.annulMessage());
        break;
      default:
        sentMessageToDatabase(chatId, newMessageId, messageText, id, name);
        store.dispatch(messageSlice.actions.annulMessage());

        break;
    }
    setMessageText('');
    setIsLoading(false);
  };

  const toggleInfo = useCallback(() => {
    setShowInfo(!showInfo);
  }, [showInfo]);

  const toggleSearch = useCallback(() => {
    setSearchView(!searchView);
  }, [searchView]);

  const toggleMessage = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  useEffect(() => {
    onSnapshot(
      collection(db, 'messages', chatId, 'messages'),
      doc => {
        setMessages(doc.docs.map(d => d.data()));
      },
      e => console.error(e),
    );
  }, []);

  let messagesToDispley = messages;
  if (search !== '' && messages) {
    messagesToDispley = messages.filter(messages =>
      messages.messageText.includes(search),
    );
  }

  return (
    <View style={styles.container}>
      {isLoading && <LoadingOverlay />}
      <UIInfoModal
        visble={showInfo}
        setVisble={toggleInfo}
        chatId={chatId}
        chatMembers={members}
      />
      <Modal
        style={styles.searchModal}
        backdropOpacity={0}
        onBackdropPress={toggleSearch}
        isVisible={searchView}
        animationIn="fadeInLeftBig"
        animationOut="fadeOutRightBig"
        animationInTiming={400}
        animationOutTiming={400}>
        <UISearchInput
          focusable={false}
          value={search}
          onChangeText={setSearch}
          fontColor={AppColors.white}
          placeholder="Search"
          placeholderTextColor={AppColors.playceholderColor}
        />
      </Modal>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backBtn} onPress={navigateToTabs}>
            <Image
              source={ASSETS.chevronLeft}
              style={[styles.button, {marginTop: 5}]}
            />
            <View style={styles.backBtnTextPos}>
              <Text
                style={[styles.text, {fontSize: 18, paddingTop: 3}]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {chatName}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.headerBtns}>
            <TouchableOpacity onPress={toggleSearch}>
              <Image style={styles.button} source={ASSETS.search} />
            </TouchableOpacity>
            <TouchableOpacity onPress={toggleInfo}>
              <Image
                style={[styles.button, {marginLeft: 7}]}
                source={ASSETS.hamburger}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.border} />
      <FlatList
        ref={flatListRef}
        onContentSizeChange={() =>
          messagesToDispley &&
          messagesToDispley.length !== 0 &&
          flatListRef.current?.scrollToEnd()
        }
        style={styles.messageList}
        data={messagesToDispley}
        renderItem={
          messages &&
          (message => (
            <UIMessage
              key={message.item.messageId}
              sentBy={message.item.sentBy}
              sentByName={message.item.sentByName}
              time={message.item.sentAt}
              message={message.item.messageText}
              setMessage={setMessageText}
              messageId={message.item.messageId}
              replyMessageId={message.item.replyMessageId}
              replyMessageText={message.item.replyMessageText}
              replySentByName={message.item.replySentByName}
              status={message.item.status}
              chatId={chatId}
              inputRef={textInputRef}
            />
          ))
        }
      />
      {messages && messages.length === 0 && (
        <Text style={styles.backgroundText}>No Messages Yet</Text>
      )}
      <View style={styles.border} />
      <View
        style={[
          styles.footer,
          type === 'Reply' && {height: 130, backgroundColor: 'fff'},
        ]}>
        {type === 'Reply' && (
          <View style={styles.replyView}>
            <Image source={ASSETS.reply} style={styles.replyImg} />
            <View style={styles.replyMessageView}>
              <View style={styles.frame} />
              <Text style={styles.replyMessage}>{message}</Text>
            </View>
            <TouchableOpacity onPress={annulMessage}>
              <Text style={styles.replyX}>ⓧ</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.messageField}>
          <AudioImageModal visible={isVisible} setVisible={toggleMessage} />
          {type === 'Edit' ? (
            <TouchableOpacity onPress={cancelEditing} style={styles.plusBtn}>
              <Text style={{fontSize: 24}}>x</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleMessage} style={styles.plusBtn}>
              <Text style={{fontSize: 28}}>+</Text>
            </TouchableOpacity>
          )}
          <TextInput
            ref={textInputRef}
            value={messageText}
            onChangeText={setMessageText}
            placeholder={
              type === 'Reply' ? 'Type reply here' : 'Type message here'
            }
            focusable={type && true}
            style={styles.inputMessage}
            placeholderTextColor={AppColors.playceholderColor}
          />
          <TouchableOpacity
            disabled={messageText === ''}
            style={styles.sentBtn}
            onPress={sentMessage}>
            <Image style={styles.sent} source={ASSETS.send} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  header: {
    width: '100%',
    height: 90,
    backgroundColor: AppColors.white,
    paddingTop: 47,
    paddingBottom: 13,
    alignItems: 'center',
  },
  headerContent: {
    width: 343,
    height: 30,
    flexDirection: 'row',
  },
  backBtn: {
    flexDirection: 'row',
    width: 247,
    height: 30,
  },
  text: {
    fontFamily: 'Mulish',
    fontWeight: '600',
  },
  backgroundText: {
    fontSize: 22,
    opacity: 0.4,
    position: 'absolute',
    marginTop: 380,
    marginLeft: 105,
    fontFamily: 'Mulish',
    fontWeight: '600',
  },
  headerBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 45,
  },
  button: {
    width: 20,
    height: 20,
  },
  backBtnTextPos: {
    width: 247,
    height: 30,
    paddingLeft: 8,
  },
  border: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AppColors.font,
  },
  messageList: {
    width: '100%',
    height: 667,
    backgroundColor: AppColors.inputFont,
  },
  footer: {
    backgroundColor: AppColors.white,
    width: '100%',
    height: 95,
  },
  messageField: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputMessage: {
    width: 279,
    height: 36,
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 4,
    borderColor: AppColors.white,
    backgroundColor: AppColors.inputFont,
    fontFamily: 'Mulish',
    fontWeight: '600',
    marginTop: 10,
  },
  sent: {
    width: 20,
    height: 20,
  },
  plusBtn: {
    paddingRight: 12,
    paddingTop: 10,
  },
  sentBtn: {
    paddingLeft: 12,
    paddingTop: 19,
  },
  replyView: {
    width: '85%',
    height: 30,
    marginTop: 15,
    marginLeft: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyImg: {
    width: 20,
    height: 20,
    opacity: 0.7,
  },
  replyMessageView: {
    width: 277,
    height: 25,
    marginLeft: 12,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 5,
    borderColor: AppColors.inputFont,
    backgroundColor: AppColors.inputFont,
  },
  replyMessage: {
    fontFamily: 'Mulish',
    marginLeft: 15,
  },
  replyX: {
    fontSize: 20,
    opacity: 0.7,
    fontWeight: '300',
    paddingLeft: 12,
  },
  frame: {
    width: 4,
    height: 25,
    position: 'absolute',
    backgroundColor: 'black',
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
  },
  searchModal: {
    alignItems: 'center',
    flex: 0,
    marginTop: 90,
    backgroundColor: AppColors.white,
    margin: 0,
  },
});
