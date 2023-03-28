import {useNavigation} from '@react-navigation/native';
import {DocumentData, getDocs, query, where} from 'firebase/firestore';
import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDebounce} from 'use-debounce';
import {NavigationProps} from '../../App';
import {auth} from '../firebase/firebase';
import {uploadContactToServer, usersColRef} from '../services/userManagement';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';
import {UIButton} from '../сomponents/UIButton';
import {UIContacts} from '../сomponents/UIContacts';
import {UISearchInput} from '../сomponents/UISearchInput';

export const SearchUser = () => {
  const [text, setText] = useState<string>('');
  const [user, setUser] = useState<DocumentData>();
  const [debouncedText] = useDebounce(text, 500);

  const navigation = useNavigation<NavigationProps>();

  const navigateToContacts = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getUser = async (search: string) => {
    const email = auth.currentUser?.email;
    try {
      const q = query(
        usersColRef,
        where('email', '==', search.toLowerCase()),
        where('email', '!=', email),
      );

      const qSnapshot = await getDocs(q);
      return qSnapshot.forEach(doc => setUser(doc.data()));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (debouncedText) {
      getUser(text);
    } else {
      setUser(undefined);
    }
  }, [debouncedText]);

  const addToContacts = async () => {
    try {
      uploadContactToServer(auth.currentUser!.uid, user!);
      navigateToContacts();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText1}>
          Enter name of user which you want to find
        </Text>
        <Text style={styles.headerText2}>or write his email</Text>
      </View>
      <View style={styles.input}>
        <UISearchInput placeholder="Email" value={text} onChange={setText} />
      </View>
      <View style={styles.scrollPos}>
        <ScrollView style={styles.scroll}>
          {user === undefined || text === '' ? null : (
            <View style={styles.user}>
              <UIContacts
                userName={user.name}
                onlineStatus={user.onlineStatus}
                status={user.onlineStatus === true ? 'Online' : 'Offline'}
                avatar={ASSETS.defaultAvatarImage}
              />
            </View>
          )}
        </ScrollView>
      </View>
      <View style={styles.buttons}>
        <UIButton onPress={navigateToContacts} text={'Back'} />
      </View>
      {user === undefined || text === '' ? null : (
        <View style={styles.addButton}>
          <UIButton onPress={addToContacts} text={'Add to contact'} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.font,
    paddingTop: 10,
  },
  header: {
    width: '95%',
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 13,
  },
  headerText1: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 17,
    textAlign: 'center',
  },
  headerText2: {
    paddingTop: 10,
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 13,
  },
  input: {padding: 10},
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 15,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    width: '95%',
    backgroundColor: AppColors.inputFont,
    maxHeight: 140,
    borderRadius: 15,
    paddingLeft: 10,
  },
  scrollPos: {
    alignItems: 'center',
  },
  user: {
    paddingTop: 15,
  },
});
