import {ASSETS} from '../utils/assets';
import {StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {UIContacts} from '../сomponents/UIContacts';
import {doc, DocumentData, getDoc} from 'firebase/firestore';
import {UISearchInput} from '../сomponents/UISearchInput';
import {useCallback, useEffect, useState} from 'react';
import {auth, db} from '../firebase/firebase';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Routes} from '../utils/routes';
import {NavigationProps} from '../../App';
import {usersDocRef} from '../services/userManagement';

export const Contacts = () => {
  const navigation = useNavigation<NavigationProps>();
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<DocumentData[]>([]);
  const isFocused = useIsFocused();

  const navigateToSearchUsers = useCallback(async () => {
    navigation.navigate(Routes.SEARCH_USER);
  }, [navigation]);

  const getContacts = useCallback(async () => {
    const id = auth.currentUser!.uid;
    try {
      const docSnap = await getDoc(usersDocRef(id));
      if (docSnap.exists()) {
        setContacts(docSnap.data().contacts);
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  let listToDisplay = contacts;
  if (search !== '') {
    listToDisplay = contacts.filter(contact => {
      return contact.name.includes(search);
    });
  }

  useEffect(() => {
    getContacts();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Contacts</Text>
        <TouchableOpacity onPress={navigateToSearchUsers}>
          <Image style={styles.headerBtn} source={ASSETS.plus} />
        </TouchableOpacity>
      </View>
      <View style={styles.content}>
        <View style={styles.input}>
          <UISearchInput
            placeholder="Search"
            keyboardType="email-address"
            value={search}
            onChange={setSearch}
            autoCorrect={false}
          />
        </View>
        <ScrollView style={styles.scroll}>
          {contacts &&
            listToDisplay.map(({name, onlineStatus}) => {
              return (
                <UIContacts
                  key={Math.floor(Math.random() * 1000)}
                  userName={name}
                  onlineStatus={onlineStatus}
                  status={onlineStatus === true ? 'Online' : 'Offline'}
                  avatar={ASSETS.defaultAvatarImage}
                />
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 57,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 13,
  },
  headerText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 18,
  },
  headerBtn: {
    width: 14,
    height: 14,
  },
  content: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 24,
    paddingLeft: 24,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingTop: 16,
  },
  textInput: {
    width: 327,
    height: 36,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    paddingLeft: 32,
    fontFamily: 'Mulish',
  },
  input: {
    justifyContent: 'center',
  },
  inputIcon: {
    width: 16,
    height: 16,
    opacity: 0.3,
  },
  iconPos: {
    position: 'absolute',
    paddingLeft: 8,
  },
});
