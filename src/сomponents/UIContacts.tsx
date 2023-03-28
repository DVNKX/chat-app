import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';

interface IContactsProps {
  avatar: any;
  userName: string;
  status: string;
  onlineStatus: boolean;
}

export const UIContacts: React.FC<IContactsProps> = ({
  avatar,
  userName,
  status,
  onlineStatus,
}) => {
  return (
    <View style={styles.user}>
      <Image style={styles.avatar} source={avatar} />
      {onlineStatus && (
        <View style={styles.statusPos}>
          <View style={styles.status} />
        </View>
      )}
      <View style={styles.userData}>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userStatus}>{status}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    width: 327,
    height: 68,
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
    paddingLeft: 40,
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
  userName: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 14,
  },
  userStatus: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 12,
    paddingTop: 2,
    color: '#ADB5BD',
  },
});
