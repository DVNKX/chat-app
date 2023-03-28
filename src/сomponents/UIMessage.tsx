import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';
import Modal from 'react-native-modal';
import {deleteMessageFromDatabase} from '../services/chatManagment';
import {useStore} from 'react-redux';
import {messageSlice} from '../store/slices/messageSlice';
import {useAppSelector} from '../hooks/redux';
import getUnixTime from 'date-fns/getUnixTime';
import {onSnapshot} from 'firebase/firestore';
import {userDocRef} from '../services/userManagement';

interface IContextMenuOptionProps {
  text: string;
  img: ImageSourcePropType;
  onPress: () => void;
  style?: string;
}

const UIContextMenuOption: React.FC<IContextMenuOptionProps> = ({
  text,
  img,
  onPress,
  style,
}) => {
  return (
    <View>
      <TouchableOpacity onPress={onPress} style={styles.option}>
        <Text style={[styles.text, {paddingLeft: 10, color: style}]}>
          {text}
        </Text>
        <Image source={img} style={[styles.img, {tintColor: style}]} />
      </TouchableOpacity>
    </View>
  );
};

type dateType = {
  HmmSentAt: number;
  dateSentAt: string;
  unixSentAt: number;
};

interface IMessage {
  chatId: string;
  sentBy: string;
  sentByName: string;
  message: string;
  messageId: number;
  time: dateType;
  status: string;
  replyMessageId: string;
  replyMessageText: string;
  replySentByName: string;
  setMessage: Dispatch<SetStateAction<string>>;
  inputRef: React.RefObject<TextInput>;
}

export const UIMessage: React.FC<IMessage> = ({
  chatId,
  sentBy,
  sentByName,
  message,
  messageId,
  time,
  status,
  replyMessageId,
  replyMessageText,
  replySentByName,
  setMessage,
  inputRef,
}) => {
  const [avatar, setAvatar] = useState<string>();
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [measure, setMeasure] = useState<MessageTouch>();
  const store = useStore();
  const id = useAppSelector(state => state.user.id);
  const name = useAppSelector(state => state.user.name);
  const dateNow = getUnixTime(new Date());

  type MessageTouch = {
    pageX: number;
    pageY: number;
  };

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 750,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 750,
      useNativeDriver: true,
    }).start();
  };

  const showContextMenu = useCallback(() => {
    setShowMenu(true);
  }, [showMenu]);

  const deleteMessage = async () => {
    deleteMessageFromDatabase(chatId, messageId);
    setShowMenu(false);
  };
  const replyMessage = () => {
    inputRef.current?.focus();
    store.dispatch(
      messageSlice.actions.replyMessage({
        type: 'Reply',
        messageId: messageId,
        message,
        sentByName,
      }),
    );
    setShowMenu(false);
  };

  const editMessage = () => {
    inputRef.current?.focus();
    store.dispatch(messageSlice.actions.editMessage({type: 'Edit', messageId}));
    setMessage(message);
    setShowMenu(false);
  };

  useEffect(() => {
    onSnapshot(userDocRef(sentBy), doc => {
      if (doc.exists()) {
        setAvatar(doc.data().avatar);
      }
    });
  }, []);

  return (
    <Pressable
      onLongPress={e => {
        fadeIn();
        setMeasure({
          pageX: e.nativeEvent.pageX,
          pageY: e.nativeEvent.pageY,
        });
        showContextMenu();
        setTimeout(() => {
          fadeOut();
        }, 750);
      }}
      style={
        sentBy === id
          ? {alignItems: 'flex-end', marginRight: 5}
          : {alignItems: 'flex-start'}
      }>
      <Animated.View style={[styles.longPressAnim, {opacity: fadeAnim}]} />
      <View
        style={[
          sentBy === id
            ? [styles.container, {borderTopRightRadius: 0}]
            : [
                styles.container,
                {
                  backgroundColor: AppColors.white,
                  borderRadius: 16,
                  borderTopLeftRadius: 0,
                  marginLeft: 30,
                },
              ],
        ]}>
        {replyMessageId && (
          <View
            style={
              sentBy === id
                ? styles.replyMessage
                : [
                    styles.replyMessage,
                    {
                      alignItems: 'flex-start',
                    },
                  ]
            }>
            <View style={styles.frame}></View>
            <Text
              style={[
                styles.replyText,
                {marginTop: 8, color: AppColors.primary},
              ]}>
              {replySentByName === name ? name : replySentByName}
            </Text>
            <Text style={[styles.replyText, {marginTop: 4}]}>
              {replyMessageText}
            </Text>
          </View>
        )}
        <Text
          style={
            !replyMessageId
              ? [styles.text, {margin: 10}]
              : [styles.text, {margin: 10, marginTop: 0}]
          }>
          {message}
        </Text>
        <View
          style={
            sentBy === id
              ? [styles.mesInfo, {paddingBottom: 7}]
              : styles.mesInfo
          }>
          <Text style={styles.infoText}>
            {time && dateNow - time.unixSentAt <= 864000
              ? time.HmmSentAt
              : time && time.dateSentAt}
          </Text>
          <Text style={styles.infoText}>
            {sentBy === id && status && ` · ${status}`}
          </Text>
        </View>
      </View>
      <View style={styles.avatarPos}>
        <Image
          source={avatar ? {uri: avatar} : ASSETS.defaultAvatarImage}
          style={styles.avatar}
        />
      </View>
      <Modal
        isVisible={showMenu}
        onBackdropPress={() => {
          setShowMenu(false);
        }}
        animationIn="zoomIn"
        animationOut="zoomOut"
        backdropOpacity={0}
        style={
          sentBy === id && measure
            ? [
                styles.modal,
                {
                  marginTop: measure.pageY - 40,
                  marginLeft:
                    measure.pageX < 60
                      ? measure.pageX - 5
                      : measure?.pageX > 320
                      ? measure.pageX - 130
                      : measure.pageX - 60,
                },
              ]
            : measure && [
                styles.modal,
                {
                  marginTop: measure.pageY - 40,
                  marginLeft:
                    measure.pageX < 60
                      ? measure.pageX - 5
                      : measure?.pageX > 320
                      ? measure.pageX - 130
                      : measure.pageX - 60,
                },
              ]
        }>
        <ScrollView>
          {sentBy !== id && (
            <UIContextMenuOption
              onPress={replyMessage}
              img={ASSETS.reply}
              text="Reply"
            />
          )}
          {sentBy === id && (
            <UIContextMenuOption
              onPress={editMessage}
              img={ASSETS.edit}
              text="Edit"
            />
          )}
          <View style={styles.border} />
          <UIContextMenuOption
            onPress={deleteMessage}
            img={ASSETS.fullTrashCan}
            text="Delete"
            style={AppColors.error}
          />
        </ScrollView>
      </Modal>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    minWidth: 120,
    maxWidth: 337,
    minHeight: 64,
    backgroundColor: AppColors.primary,
    borderRadius: 25,
    marginRight: 30,
  },
  longPressAnim: {
    width: '100%',
    height: '100%',
    borderTopColor: AppColors.primary,
    borderBottomColor: AppColors.primary,
    borderTopWidth: 1.5,
    borderBottomWidth: 1.5,
    position: 'absolute',
  },
  text: {
    fontFamily: 'Mulish',
  },
  mesInfo: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    marginRight: 10,
  },
  infoText: {
    fontFamily: 'Mulish',
    opacity: 0.6,
  },
  avatarPos: {
    position: 'absolute',
    marginTop: 20,
    margin: 5,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 50,
  },
  replyMessage: {
    margin: 10,
    minWidth: 150,
    height: 60,
    borderRadius: 7,
    borderColor: AppColors.primary,
    backgroundColor: AppColors.inputFont,
  },
  replyText: {
    fontFamily: 'Mulish',
    marginLeft: 14,
  },
  frame: {
    width: 4,
    height: 60,
    position: 'absolute',
    backgroundColor: 'black',
    borderTopStartRadius: 10,
    borderBottomStartRadius: 10,
    marginLeft: 0,
  },
  modal: {
    flex: 0,
    width: 130,
    borderRadius: 15,
    borderColor: AppColors.primary,
    borderWidth: 0.5,
    backgroundColor: AppColors.font,
  },
  option: {
    height: 40,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  img: {
    position: 'absolute',
    marginLeft: 100,
    height: 14,
    width: 14,
  },
  border: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: AppColors.primary,
  },
});
