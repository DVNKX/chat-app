import {useIsFocused, useNavigation} from '@react-navigation/native';
import {DocumentData, getDoc, getDocs, query, where} from 'firebase/firestore';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {NavigationProps} from '../../App';
import {userDocRef, usersColRef} from '../services/userManagement';
import {AppColors} from '../utils/colors';
import {UIContacts} from '../сomponents/UIContacts';
import {UIButton} from '../сomponents/UIButton';
import {useAppSelector} from '../hooks/redux';
import {useStore} from 'react-redux';
import {markSlice} from '../store/slices/markSlice';
import {LoadingOverlay} from '../сomponents/LoadingOverlay';
import {createChatAtDatabase} from '../services/chatManagment';

export const CreateChat = () => {
  const [isContactsLoaded, setIsContactsLoaded] = useState<boolean>(false);
  const [contacts, setContacts] = useState<DocumentData[]>();
  const isFocused = useIsFocused();
  const navigation = useNavigation<NavigationProps>();
  const store = useStore();

  const members = useAppSelector(state => state.mark.uids);
  const chatName = useAppSelector(state => state.mark.names);
  const id = useAppSelector(state => state.user.id);

  const navigateToChats = useCallback(() => {
    store.dispatch(markSlice.actions.annulMembers());
    navigation.goBack();
  }, [navigation]);

  const createNewGroup = () => {
    const groupId = Math.random().toString(20).slice(2);
    createChatAtDatabase(id, groupId, members, chatName);
    store.dispatch(markSlice.actions.annulMembers());
    navigation.goBack();
  };

  const getContacts = async () => {
    try {
      setIsContactsLoaded(true);
      const docSnap = await getDoc(userDocRef(id));
      if (docSnap.exists()) {
        const contactsUids: string[] = docSnap.data().contacts;
        const q = query(usersColRef, where('id', 'in', contactsUids));
        const qs = await getDocs(q);
        setContacts(qs.docs.map(c => c.data()));
      }
      setIsContactsLoaded(false);
    } catch (e) {
      console.error(e);
    }
    setIsContactsLoaded(false);
  };

  useEffect(() => {
    getContacts();
  }, [isFocused]);

  return (
    <View style={styles.container}>
      {isContactsLoaded && <LoadingOverlay paddingBottom={70} />}
      <Text style={styles.headerText}>Make new chat with:</Text>
      {contacts && contacts.length !== 0 ? (
        <ScrollView style={styles.listOfContacts}>
          {contacts.map(({name, id, avatar}) => {
            return (
              <UIContacts
                key={id}
                userName={name}
                avatar={avatar}
                id={id}
                markeble={true}
              />
            );
          })}
        </ScrollView>
      ) : (
        <View style={styles.warning}>
          <Text style={styles.warningText}>There are nobody here!</Text>
          <Text style={styles.warningText}>
            At first you need to add somebody at your contact list.
          </Text>
        </View>
      )}
      <View style={{marginTop: 20}}>
        <UIButton
          onPress={navigateToChats}
          text={contacts === undefined ? 'Ok' : 'Cancel'}
        />
      </View>
      {contacts && members.length > 2 && (
        <View style={styles.backButton}>
          <UIButton onPress={createNewGroup} text="Create" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 16,
  },
  headerText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 17,
  },
  listOfContacts: {
    width: '95%',
    maxHeight: '70%',
    marginTop: 16,
    paddingTop: 10,
    paddingLeft: 10,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  backButton: {
    paddingTop: 20,
  },
  warning: {
    margin: 15,
    alignItems: 'center',
  },
  warningText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    textAlign: 'center',
    color: AppColors.primary,
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
});
