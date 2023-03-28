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

export const More = () => {
  const navigation = useNavigation<NavigationProps>();

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
    await uploadUserOnlineStatus(auth.currentUser!.uid, false);
    await auth.signOut().catch(e => {
      Alert.alert(e);
    });
    navigation.navigate(Routes.WALKTHROUGH);
  }, [navigation]);

  const {name, surname} = useAppSelector(state => state.user);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>More</Text>
      </View>
      <View>
        <View style={styles.profileContent}>
          <View style={styles.profileButtonPos}>
            <TouchableOpacity
              onPress={handleClickToProfile}
              style={styles.profileButton}>
              <View style={styles.avatarPos}>
                <Image
                  style={styles.profileAvatar}
                  source={ASSETS.defaultAvatarImage}
                />
              </View>
              <View style={styles.userData}>
                <View style={styles.namePos}>
                  <Text style={styles.text}>
                    {name === null
                      ? auth.currentUser?.displayName
                      : name + ' ' + surname}
                  </Text>
                </View>
                <Text style={styles.userEmail}>{auth.currentUser?.email}</Text>
              </View>
              <View style={styles.chevronPos}>
                <Image style={styles.chevron} source={ASSETS.chevronRight} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tabsContent}>
          <UIOptions
            navigate={handleClickToContacts}
            icon={ASSETS.avatar}
            text={'Account'}
          />
          <UIOptions
            navigate={handleClickToChats}
            icon={ASSETS.chats}
            text={'Chats'}
          />
        </View>
        <View style={styles.optionsContent}>
          <UIOptions icon={ASSETS.appereance} text={'Appearence'} />
          <UIOptions icon={ASSETS.notifications} text={'Notifications'} />
          <UIOptions icon={ASSETS.privacy} text={'Privacy'} />
          <UIOptions icon={ASSETS.data} text={'Data Usage'} />
        </View>
        <View style={styles.borderPos}>
          <View style={styles.border} />
        </View>
        <View style={styles.tabsContent}>
          <UIOptions icon={ASSETS.help} text={'Help'} />
          <UIOptions icon={ASSETS.message} text={'Invite your friends'} />
          <UIOptions
            icon={ASSETS.signOut}
            text={'Sign Out'}
            navigate={handleClickToSignOut}
          />
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
    backgroundColor: '#fff',
  },
  header: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingTop: 57,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 13,
  },
  headerText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 16,
  },
  profileContent: {
    alignItems: 'center',
    width: 375,
    height: 66,
  },
  profileButton: {
    width: 343,
    height: 50,
    flexDirection: 'row',
  },
  profileButtonPos: {
    paddingBottom: 8,
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
  avatarPos: {
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatar: {
    width: 24,
    height: 24,
  },
  userData: {
    paddingLeft: 20,
  },
  namePos: {
    paddingBottom: 2,
  },
  userEmail: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 12,
    opacity: 0.5,
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
    width: 342,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  borderPos: {
    paddingTop: 8,
    paddingBottom: 8,
    alignItems: 'center',
  },
});
