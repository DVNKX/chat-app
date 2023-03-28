import {ASSETS} from '../utils/assets';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Image} from 'react-native';
import {UIContacts} from '../сomponents/UIContacts';
import {
  DocumentData,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {UISearchInput} from '../сomponents/UISearchInput';
import {useCallback, useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Routes} from '../utils/routes';
import {NavigationProps} from '../../App';
import {
  deleteContactFromDatabase,
  userDocRef,
  usersColRef,
} from '../services/userManagement';
import {useStore} from 'react-redux';
import {markSlice} from '../store/slices/markSlice';
import {useAppSelector} from '../hooks/redux';
import {AppColors} from '../utils/colors';
import {LoadingOverlay} from '../сomponents/LoadingOverlay';

export const Contacts = () => {
  const navigation = useNavigation<NavigationProps>();
  const [search, setSearch] = useState('');
  const [contacts, setContacts] = useState<DocumentData[]>([]);
  const [isMarkeble, setIsMarkeble] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const store = useStore();

  const id = useAppSelector(state => state.user.id);
  const markedContacts = useAppSelector(state => state.mark.contacts);

  const navigateToSearchUsers = useCallback(async () => {
    setIsMarkeble(false);
    navigation.navigate(Routes.SEARCH_USER);
  }, [navigation]);

  const toChangeContactsList = useCallback(() => {
    setIsMarkeble(!isMarkeble);
  }, [isMarkeble]);

  const deleteContact = () => {
    try {
      const fContacts = contacts.filter(c =>
        c.id.indexOf(markedContacts.map(mc => mc.id)),
      );
      setContacts(fContacts);
      deleteContactFromDatabase(id, markedContacts);
      store.dispatch(markSlice.actions.annulContactsList());
      toChangeContactsList();
    } catch (e) {
      console.error(e);
    }
  };

  let listToDisplay = contacts;
  if (search !== '') {
    listToDisplay = contacts.filter(contact => contact.name.includes(search));
  }

  useEffect(() => {
    onSnapshot(
      userDocRef(id),
      async doc => {
        setIsLoading(true);
        if (doc.exists()) {
          if (doc.data().contacts.length !== 0) {
            const q = query(
              usersColRef,
              where('id', 'in', doc.data().contacts),
            );
            const qs = await getDocs(q);
            setContacts(qs.docs.map(d => d.data()));
          }
        }
        setIsLoading(false);
      },
      e => {
        setIsLoading(false);
        console.log(e);
      },
    );

    if (!isFocused) {
      setIsMarkeble(false);
    }
  }, []);

  return (
    <View style={styles.container}>
      {isLoading && <LoadingOverlay />}
      <View style={styles.header}>
        <Text style={styles.headerText}>Contacts</Text>
        <View style={styles.headerBtns}>
          <TouchableOpacity onPress={navigateToSearchUsers}>
            <Image style={styles.headerBtn} source={ASSETS.plus} />
          </TouchableOpacity>
          <TouchableOpacity onPress={toChangeContactsList}>
            <Image
              style={[styles.headerBtn, {height: 18, width: 18}]}
              source={ASSETS.hamburger}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.input}>
          <UISearchInput
            focusable={false}
            placeholder="Search"
            placeholderTextColor={AppColors.playceholderColor}
            fontColor={AppColors.inputFont}
            keyboardType="email-address"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <FlatList
          style={styles.scroll}
          data={listToDisplay}
          renderItem={
            contacts &&
            (contact => (
              <UIContacts
                key={contact.item.id}
                userName={contact.item.name}
                onlineStatus={contact.item.onlineStatus}
                wasOnline={contact.item.wasOnline}
                avatar={contact.item.avatar}
                id={contact.item.id}
                email={contact.item.email}
                markeble={isMarkeble}
              />
            ))
          }
        />

        {isMarkeble && (
          <View style={styles.deleteContactsVeiw}>
            <View style={styles.border} />
            <TouchableOpacity
              disabled={markedContacts && markedContacts.length === 0}
              onPress={deleteContact}
              style={styles.deleteContactsButton}>
              <Image
                source={
                  markedContacts.length === 0
                    ? ASSETS.trashCan
                    : ASSETS.fullTrashCan
                }
                style={styles.trashCan}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: AppColors.white,
    flexDirection: 'column',
  },
  header: {
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
    height: 14,
    width: 14,
    margin: 5,
  },
  headerBtns: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 205,
  },
  content: {
    marginTop: 16,
    marginBottom: 16,
    marginRight: 24,
    marginLeft: 24,
    backgroundColor: AppColors.white,
  },
  scroll: {
    marginTop: 16,
    height: 550,
  },
  input: {
    justifyContent: 'center',
  },
  deleteContactsVeiw: {
    width: '100%',
    height: 40,
  },
  deleteContactsButton: {
    alignItems: 'center',
    width: '100%',
  },
  trashCan: {
    width: 30,
    height: 30,
    opacity: 0.8,
    tintColor: AppColors.error,
  },
  border: {
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AppColors.primaryBorder,
    marginBottom: 10,
  },
});
