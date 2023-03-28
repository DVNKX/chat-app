import {View, Text, StyleSheet, Image, Alert} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {ASSETS} from '../utils/assets';
import type {NavigationProps} from '../../App';
import {Routes} from '../utils/routes';
import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {auth} from '../firebase/firebase';
import {UIOptions} from '../сomponents/UIOptions';
import {uploadUserOnlineStatus} from '../services/userManagement';
import {useAppSelector} from '../hooks/redux';
import {AppColors} from '../utils/colors';
import {useStore} from 'react-redux';
import {userSlice} from '../store/slices/userSlice';

export const More = () => {
  const navigation = useNavigation<NavigationProps>();

  const store = useStore();

  const userAvatar = useAppSelector(state => state.user.image);
  const id = useAppSelector(state => state.user.id);
  const name = auth.currentUser?.displayName;
  const email = auth.currentUser?.email;

  const handleClickToProfile = useCallback(() => {
    navigation.navigate(Routes.PROFILE_ACCOUNT);
  }, [navigation]);

  const handleClickToContacts = useCallback(() => {
    navigation.navigate(Routes.CONTACTS);
  }, [navigation]);

  const handleClickToChats = useCallback(() => {
    navigation.navigate(Routes.CHATS);
  }, [navigation]);

  const handleClickToSignOut = useCallback(async () => {
    await uploadUserOnlineStatus(id, false);
    store.dispatch(userSlice.actions.logOut());
    await auth.signOut().catch(e => {
      Alert.alert(e);
    });
    navigation.navigate(Routes.WALKTHROUGH);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.text, {fontSize: 16}]}>More</Text>
      </View>
      <View style={styles.profileContent}>
        <View style={styles.profileBtnPos}>
          <TouchableOpacity
            onPress={handleClickToProfile}
            style={styles.profileBtn}>
            <View style={styles.avatarPos}>
              <Image
                style={
                  userAvatar
                    ? styles.profileAvatar
                    : styles.defaultProfileAvatar
                }
                source={
                  userAvatar ? {uri: userAvatar} : ASSETS.defaultAvatarImage
                }
              />
            </View>
            <View style={styles.userData}>
              <Text style={[styles.text, {paddingBottom: 2}]}>{name}</Text>
              <Text
                style={[
                  styles.text,
                  {fontWeight: '400', fontSize: 12, opacity: 0.5},
                ]}>
                {email}
              </Text>
            </View>
            <View style={styles.chevronPos}>
              <Image style={styles.chevron} source={ASSETS.chevronRight} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.tabsContent}>
        <UIOptions
          action={handleClickToContacts}
          icon={ASSETS.avatar}
          optionTitle={'Contacts'}
        />
        <UIOptions
          action={handleClickToChats}
          icon={ASSETS.chats}
          optionTitle={'Chats'}
        />
      </View>
      <View style={styles.optionsContent}>
        <UIOptions icon={ASSETS.appereance} optionTitle={'Appearence'} />
        <UIOptions icon={ASSETS.notifications} optionTitle={'Notifications'} />
        <UIOptions icon={ASSETS.privacy} optionTitle={'Privacy'} />
        <UIOptions icon={ASSETS.data} optionTitle={'Data Usage'} />
      </View>
      <View style={styles.border} />
      <View style={styles.tabsContent}>
        <UIOptions icon={ASSETS.help} optionTitle={'Help'} />
        <UIOptions icon={ASSETS.message} optionTitle={'Invite your friends'} />
        <UIOptions
          icon={ASSETS.signOut}
          optionTitle={'Sign Out'}
          action={handleClickToSignOut}
        />
      </View>
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
    flexDirection: 'row',
    paddingTop: 57,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 13,
  },
  profileContent: {
    width: 375,
    height: 66,
  },
  profileBtn: {
    width: 343,
    height: 50,
    flexDirection: 'row',
  },
  profileBtnPos: {
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  avatarPos: {
    borderRadius: 50,
    backgroundColor: AppColors.inputFont,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultProfileAvatar: {
    width: 24,
    height: 24,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  userData: {
    paddingLeft: 20,
  },
  chevron: {
    width: 7.42,
    height: 12.02,
  },
  text: {
    fontFamily: 'Mulish',
    fontWeight: '600',
  },
  tabsContent: {
    width: 375,
    height: 104,
  },
  chevronPos: {
    position: 'absolute',
    paddingTop: 15,
    paddingLeft: 320,
  },
  optionsContent: {
    width: 375,
    height: 204,
  },
  border: {
    marginLeft: 25,
    width: 350,
    borderWidth: 1,
    borderColor: AppColors.primaryBorder,
    marginTop: 8,
    marginBottom: 8,
  },
});
