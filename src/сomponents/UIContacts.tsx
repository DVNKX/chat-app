import {formatDistance, subDays} from 'date-fns';
import React from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useStore} from 'react-redux';
import {useAppSelector} from '../hooks/redux';
import {markSlice} from '../store/slices/markSlice';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';

interface IContactsProps {
  avatar: string;
  userName: string;
  onlineStatus?: boolean;
  wasOnline?: number;
  id?: string;
  email?: string;
  markeble?: boolean;
}

export const UIContacts: React.FC<IContactsProps> = ({
  avatar,
  userName,
  onlineStatus,
  wasOnline,
  id,
  markeble,
  email,
}) => {
  const store = useStore();
  const uidsList = useAppSelector(state => state.mark.uids);
  const markedContacts = useAppSelector(state => state.mark.contacts);
  const uid = useAppSelector(state => state.user.id);
  const name = useAppSelector(state => state.user.name);

  const contact = {
    email,
    id,
    name: userName,
    onlineStatus,
  };

  const toggleMark = () => {
    if (
      Boolean(uidsList.find(id => id === contact.id)) ||
      Boolean(markedContacts.find(c => c.id === contact.id))
    ) {
      if (onlineStatus === undefined) {
        store.dispatch(markSlice.actions.deleteMemberUid(id));
        store.dispatch(markSlice.actions.deleteMemberName(userName));
      } else {
        store.dispatch(markSlice.actions.deleteContact(contact));
      }
    } else {
      if (onlineStatus === undefined) {
        store.dispatch(markSlice.actions.addMemberUid(uid));
        store.dispatch(markSlice.actions.addMemberUid(id));
        store.dispatch(markSlice.actions.addMemberName(name));
        store.dispatch(markSlice.actions.addMemberName(userName));
      } else {
        store.dispatch(markSlice.actions.addContact(contact));
      }
    }
  };

  return (
    <View style={styles.user}>
      <Image
        style={styles.avatar}
        source={avatar ? {uri: avatar} : ASSETS.defaultAvatarImage}
      />
      {onlineStatus && (
        <View style={styles.statusPos}>
          <View style={styles.status} />
        </View>
      )}
      {!onlineStatus ? (
        <View style={[styles.userData, {justifyContent: 'center'}]}>
          <Text style={styles.userName}>{userName}</Text>
          {wasOnline && (
            <Text style={styles.userStatus}>
              Last seen
              {' ' +
                formatDistance(subDays(wasOnline! * 1000, 0), new Date(), {
                  addSuffix: true,
                })}
            </Text>
          )}
        </View>
      ) : (
        <View style={styles.userData}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userStatus}>Online</Text>
        </View>
      )}
      {markeble && (
        <View
          style={
            !wasOnline
              ? styles.addContact
              : [styles.addContact, {marginLeft: 293, marginTop: 21}]
          }>
          <Pressable onPress={toggleMark}>
            <Image
              style={styles.circle}
              source={
                uidsList.includes(id!) ||
                Boolean(markedContacts.find(c => c.id === contact.id))
                  ? ASSETS.focusedCircle
                  : ASSETS.circle
              }
            />
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  user: {
    flexDirection: 'row',
    width: 327,
    height: 68,
    borderRadius: 15,
    marginBottom: 10,
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
    backgroundColor: AppColors.onlineStatus,
    width: 14,
    height: 14,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: AppColors.white,
  },
  userData: {
    paddingLeft: 12,
    width: 250,
    height: 56,
  },
  userNamePos: {
    justifyContent: 'center',
    alignItems: 'center',
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
    color: AppColors.storyBorder,
  },
  addContact: {
    position: 'absolute',
    justifyContent: 'center',
    marginLeft: 240,
    marginTop: 15,
  },
  circle: {
    width: 24,
    height: 24,
  },
});
