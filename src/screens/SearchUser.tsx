import {useNavigation} from '@react-navigation/native';
import {DocumentData, getDocs, query, where} from 'firebase/firestore';
import {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useDebounce} from 'use-debounce';
import {NavigationProps} from '../../App';
import {auth} from '../firebase/firebase';
import {useAppSelector} from '../hooks/redux';
import {chatsColRef, createChatAtDatabase} from '../services/chatManagment';
import {uploadContactToServer, usersColRef} from '../services/userManagement';
import {AppColors} from '../utils/colors';
import {UIButton} from '../сomponents/UIButton';
import {UIContacts} from '../сomponents/UIContacts';
import {UISearchInput} from '../сomponents/UISearchInput';

export const SearchUser = () => {
  const navigation = useNavigation<NavigationProps>();
  const [text, setText] = useState<string>('');
  const [debouncedText] = useDebounce(text, 500);
  const [user, setUser] = useState<DocumentData>();

  const id = useAppSelector(state => state.user.id);
  const name = auth.currentUser!.displayName;

  const navigateToContacts = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const getUser = async (search: string) => {
    const email = auth.currentUser!.email;
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

  const addToContacts = async () => {
    const chatId = Math.random().toString(20).slice(2);
    const members: string[] = [id, user && user.id];
    const chatName: string[] = [name, user && user.name];
    try {
      const q = query(
        chatsColRef,
        where('members', 'array-contains', id && user && user.id),

        where('type', '==', 'private chat'),
      );
      const qs = await getDocs(q);
      uploadContactToServer(id, user && user.id);
      if (qs.docs.map(d => !d.exists())) {
        createChatAtDatabase(id, chatId, members, chatName);
      }
      navigateToContacts();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (debouncedText) {
      getUser(debouncedText);
    } else {
      setUser(undefined);
    }
  }, [debouncedText]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText1}>
          Enter email of user which you want to find
        </Text>
      </View>
      <View style={styles.input}>
        <UISearchInput
          focusable={true}
          placeholder={'Email'}
          placeholderTextColor={AppColors.playceholderColor}
          fontColor={AppColors.inputFont}
          value={text}
          onChangeText={setText}
          autoCapitalize={'none'}
          autoCorrect={false}
        />
      </View>
      <View style={styles.scrollPos}>
        <ScrollView style={styles.scroll}>
          {user === undefined || text === '' ? null : (
            <View style={styles.user}>
              <UIContacts
                userName={user.name}
                onlineStatus={user.onlineStatus}
                avatar={user.avatar}
              />
            </View>
          )}
        </ScrollView>
      </View>
      <View style={styles.navButton}>
        <UIButton onPress={navigateToContacts} text={'Back'} />
      </View>
      {user === undefined ||
        (text !== '' && (
          <View style={styles.addButton}>
            <UIButton onPress={addToContacts} text={'Add to contact'} />
          </View>
        ))}
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
  input: {padding: 10},
  navButton: {
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
