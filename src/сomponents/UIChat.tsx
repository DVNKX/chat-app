import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NavigationProps} from '../../App';
import {Routes} from '../utils/routes';

interface IChatProps {
  avatar: any;
  userName: string;
  date: string | number;
  message: string;
  messageCount?: number;
  status: boolean;
}

export const UIChat: React.FC<IChatProps> = ({
  avatar,
  userName,
  date,
  message,
  messageCount,
  status,
}) => {
  const navigation = useNavigation<NavigationProps>();

  const handleClickToChat = useCallback(() => {
    navigation.navigate(Routes.CHAT);
  }, [navigation]);

  return (
    <TouchableOpacity style={styles.user} onPress={handleClickToChat}>
      <Image style={styles.avatar} source={avatar} />
      {status ? (
        <View style={styles.statusPos}>
          <View style={styles.status} />
        </View>
      ) : null}
      <View style={styles.userData}>
        <View style={styles.chatNameDate}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.messageDate}>{date}</Text>
        </View>
        <View style={styles.chatMessageCount}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.lastMessage}>
            {message}
          </Text>
          {messageCount ? (
            <View style={styles.messageCountPos}>
              <Text style={styles.messageCount}>{messageCount}</Text>
            </View>
          ) : null}
        </View>
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
  statusPos: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 73,
  },
  status: {
    backgroundColor: '#2CC069',
    width: 14,
    height: 14,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
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
  userName: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 14,
  },
  messageDate: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 10,
    color: '#ADB5BD',
  },
  chatMessageCount: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  lastMessage: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 12,
    paddingTop: 6,
    color: '#ADB5BD',
    width: 235,
  },
  messageCountPos: {
    width: 22,
    height: 20,
    borderRadius: 40,
    backgroundColor: '#D2D5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageCount: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 10,
  },
});
