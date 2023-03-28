import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';
import Modal from 'react-native-modal';
import {
  doc,
  DocumentData,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import {db} from '../firebase/firebase';
import {userDocRef, usersColRef} from '../services/userManagement';
import {useStore} from 'react-redux';
import {markSlice} from '../store/slices/markSlice';
import {useAppSelector} from '../hooks/redux';
import {formatDistance, subDays} from 'date-fns';
import {LoadingOverlay} from './LoadingOverlay';
import {launchImageLibrary} from 'react-native-image-picker';
import {first} from 'lodash';
import {useDebounce} from 'use-debounce';
import {
  uploadNewAvatrOfChatToDatabase,
  uploadNewNameOfChatToDatabase,
  addMemberToChatAtDatabase,
  deleteMemberFromChatAtDatabase,
  chatDocRef,
} from '../services/chatManagment';

interface IMember {
  name?: string | null;
  avatar?: any;
  markable: boolean;
  memberId: string;
  owner?: boolean;
}

const UIMember: React.FC<IMember> = ({
  markable,
  name,
  avatar,
  memberId,
  owner,
}) => {
  const store = useStore();
  const uidsList = useAppSelector(state => state.mark.uids);

  const toggleMark = () => {
    if (Boolean(uidsList.find(id => id === memberId))) {
      store.dispatch(markSlice.actions.deleteMemberUid(memberId));
    } else {
      store.dispatch(markSlice.actions.addMemberUid(memberId));
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={toggleMark} style={styles.member}>
        <Image
          source={avatar ? {uri: avatar} : ASSETS.defaultAvatarImage}
          style={styles.memberAvatar}
        />
        <Text style={[styles.text, {fontSize: 14, marginLeft: 10}]}>
          {name}
        </Text>
        {markable && (
          <Image
            style={styles.markMemmber}
            source={
              uidsList.includes(memberId) ? ASSETS.focusedCircle : ASSETS.circle
            }
          />
        )}
        {owner && <Text style={styles.owner}>owner</Text>}
      </TouchableOpacity>
    </View>
  );
};

interface IInfo {
  visble: boolean;
  setVisble: () => void;
  chatId: string;
  chatMembers: string[];
}

export const UIInfoModal: React.FC<IInfo> = ({
  visble,
  setVisble,
  chatId,
  chatMembers,
}) => {
  const store = useStore();
  const [chatData, setGroupData] = useState<DocumentData>();
  const [changeChatName, setNewChatName] = useState<boolean>(false);
  const [chatName, setChatName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toggleDeleteMember, setToggleDeleteMember] = useState<boolean>(false);
  const [toggleAddMember, setToggleAddMember] = useState<boolean>(false);
  const [membersData, setMembersData] = useState<DocumentData[]>();
  const [onDeleteMembers, setOnDeleteMembers] = useState<DocumentData[]>();
  const [notMembersData, setNotMembersData] = useState<DocumentData[]>();
  const [privateDate, setPrivateData] = useState<DocumentData>();
  const [debouncedGroupName] = useDebounce(chatName, 500);

  const inputRef = useRef<TextInput>(null);

  const markedMembersUids = useAppSelector(state => state.mark.uids);
  const id = useAppSelector(state => state.user.id);
  const userName = useAppSelector(state => state.user.name);

  const pickImage = async () => {
    let result = await launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 100,
      maxWidth: 100,
      quality: 1,
      includeBase64: true,
    });
    if (!result.didCancel) {
      const imageAssets = first(result.assets);
      await uploadNewAvatrOfChatToDatabase(chatId, [imageAssets!.uri!]);
      setInterval(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setInterval(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const toggleGroupName = () => {
    setNewChatName(!changeChatName);
    if (!changeChatName) {
      setChatName('');
    }
  };

  const closeModal = () => {
    store.dispatch(markSlice.actions.annulMembers());
    setVisble();
  };

  const setNewGroupName = () => {
    setIsLoading(true);
    try {
      uploadNewNameOfChatToDatabase(chatId, chatName);
      toggleGroupName();
      setChatName('');
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const getNotMembersData = async () => {
    try {
      const ds = await getDoc(userDocRef(id));
      if (ds.exists()) {
        const contacts = ds.data().contacts;
        const fContacts = contacts.filter(
          (c: string) => !chatData!.members.includes(c),
        );
        if (fContacts.length !== 0) {
          const q = query(usersColRef, where('id', 'in', fContacts));
          const filteredUsers = await getDocs(q);
          setNotMembersData(filteredUsers.docs.map(d => d.data()));
        }
      }
      setIsLoading(false);
    } catch (e: any) {
      if (e.includes('Query')) {
        console.log('Empty');
      } else if (e.includes('Possible')) {
        console.error(e);
      }
    }
  };

  const openAddMemberView = () => {
    if (!toggleDeleteMember) {
      getNotMembersData();
      setToggleAddMember(true);
    }
  };

  const closeAddMemberView = () => {
    setToggleAddMember(false);
    setNotMembersData([]);
    store.dispatch(markSlice.actions.annulMembers());
  };

  const addMemberToGroup = () => {
    addMemberToChatAtDatabase(chatId, markedMembersUids);
    store.dispatch(markSlice.actions.annulMembers());
    setToggleAddMember(false);
  };

  const openDeleteMemberVeiw = () => {
    if (!toggleAddMember) {
      setToggleDeleteMember(true);
      if (membersData) {
        setOnDeleteMembers(
          membersData.filter(m => chatData && chatData.createdBy !== m.id),
        );
      }
    }
  };

  const closeDeleteMemberView = () => {
    setToggleDeleteMember(false);
    store.dispatch(markSlice.actions.annulMembers());
  };

  const deletMemberFromGroup = () => {
    deleteMemberFromChatAtDatabase(chatId, markedMembersUids);
    store.dispatch(markSlice.actions.annulMembers());
    setToggleDeleteMember(false);
  };

  useEffect(() => {
    const member = chatMembers.filter((m: any) => m !== id);
    const memberDocRef = doc(db, 'users', `user${member}`);
    onSnapshot(
      chatDocRef(chatId),
      async doc => {
        setIsLoading(true);
        if (doc.exists()) {
          setGroupData(doc.data());
          if (doc.data().type === 'private chat') {
            const qs = await getDoc(memberDocRef);
            if (qs.exists()) {
              setPrivateData(qs.data());
            }
          }
          if (doc.data().members) {
            const q = query(usersColRef, where('id', 'in', doc.data().members));
            const qs = await getDocs(q);
            setMembersData(qs.docs.map(m => m.data()));
          } else {
            console.log('nema');
          }
        }
        setIsLoading(false);
      },
      e => {
        console.error(e);
        setIsLoading(false);
      },
    );
  }, []);

  return (
    <Modal
      style={styles.infoModal}
      backdropOpacity={0}
      onBackdropPress={closeModal}
      isVisible={visble}
      animationIn="fadeInDown"
      animationOut="fadeOutUp"
      animationInTiming={600}
      animationOutTiming={600}>
      {chatData && chatData.type === 'group chat' ? (
        <View style={styles.info}>
          <View style={styles.infoHeader}>
            <TouchableOpacity
              disabled={chatData.createdBy !== id}
              onPress={pickImage}>
              <Image
                style={styles.chatAvatar}
                source={
                  chatData.chatAvatar ? chatData.chatAvatar : ASSETS.group
                }
              />
            </TouchableOpacity>
            <TouchableOpacity
              disabled={chatData.createdBy !== id}
              style={styles.chatName}
              onPress={toggleGroupName}>
              {!changeChatName ? (
                <Text style={[styles.text, {marginTop: 6.5}]}>
                  {chatData.name.length < 2
                    ? chatData.name[0]
                    : chatData.name.filter(
                        (n: string) => !n.includes(userName),
                      )}
                </Text>
              ) : (
                <TextInput
                  placeholder="Enter new name of chat"
                  placeholderTextColor={AppColors.primary}
                  ref={inputRef}
                  focusable={true}
                  style={[styles.text, {marginTop: 6.5}]}
                  value={chatName}
                  onChangeText={setChatName}
                />
              )}
            </TouchableOpacity>
            {isLoading && <LoadingOverlay marginTop={180} />}
            {changeChatName && debouncedGroupName && (
              <TouchableOpacity
                onPress={setNewGroupName}
                style={styles.applyBtn}>
                <Text style={styles.text}>✓</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.membersCount}>
            <Text
              style={[
                styles.text,
                {paddingTop: 10},
              ]}>{`${chatData.members.length} members`}</Text>
            <View style={styles.members}>
              {!toggleAddMember && !toggleDeleteMember && (
                <FlatList
                  style={styles.membersScroll}
                  data={membersData}
                  renderItem={
                    chatData.members &&
                    (member => (
                      <UIMember
                        markable={toggleDeleteMember}
                        key={member.item.id}
                        memberId={member.item.id}
                        name={member.item.name}
                        owner={chatData.createdBy === member.item.id}
                        avatar={member.item.avatar}
                      />
                    ))
                  }
                />
              )}
              {toggleDeleteMember && (
                <FlatList
                  style={styles.membersScroll}
                  data={onDeleteMembers}
                  renderItem={
                    chatData.members
                      ? member => (
                          <UIMember
                            markable={toggleDeleteMember}
                            key={member.item.id}
                            memberId={member.item.id}
                            name={member.item.name}
                            owner={chatData.createdBy === member.item.id}
                            avatar={member.item.avatar}
                          />
                        )
                      : membersData && chatData.members.length === 1
                      ? () => (
                          <Text style={styles.owner}>
                            You are alone in this chat!
                          </Text>
                        )
                      : null
                  }
                />
              )}
              {toggleAddMember && (
                <FlatList
                  style={styles.membersScroll}
                  data={notMembersData}
                  renderItem={
                    notMembersData &&
                    (notMember => (
                      <UIMember
                        markable={toggleAddMember}
                        key={notMember.item.id}
                        memberId={notMember.item.id}
                        name={notMember.item.name}
                      />
                    ))
                  }
                />
              )}
              {chatData && chatData.createdBy === id && (
                <View style={styles.ownerBtns}>
                  {toggleAddMember === true ? (
                    <View style={styles.ownerBtnsView}>
                      <TouchableOpacity
                        style={[
                          styles.ownerBtn,
                          {
                            marginTop: 12,
                          },
                        ]}
                        disabled={markedMembersUids.length === 0}
                        onPress={
                          toggleAddMember === true
                            ? addMemberToGroup
                            : openAddMemberView
                        }>
                        <Image
                          source={ASSETS.addMember}
                          style={[
                            styles.memberBtn,
                            {
                              tintColor:
                                markedMembersUids.length === 0
                                  ? AppColors.addMember
                                  : AppColors.focusedAddMember,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.ownerBtn, {marginTop: 24}]}
                        onPress={closeAddMemberView}>
                        <Text style={styles.text}>ⓧ</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={openAddMemberView}
                      style={styles.buttonView}>
                      <Image
                        source={ASSETS.addMember}
                        style={styles.memberBtn}
                      />
                    </TouchableOpacity>
                  )}
                  {toggleDeleteMember === true ? (
                    <View style={styles.ownerBtnsView}>
                      <TouchableOpacity
                        style={[styles.ownerBtn, {marginTop: 12}]}
                        disabled={markedMembersUids.length === 0}
                        onPress={
                          toggleDeleteMember === true
                            ? deletMemberFromGroup
                            : openDeleteMemberVeiw
                        }>
                        <Image
                          source={
                            markedMembersUids.length === 0
                              ? ASSETS.trashCan
                              : ASSETS.fullTrashCan
                          }
                          style={[
                            styles.memberBtn,
                            {
                              tintColor: AppColors.error,
                            },
                          ]}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.ownerBtn, {marginTop: 24}]}
                        onPress={closeDeleteMemberView}>
                        <Text style={styles.text}>ⓧ</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={styles.buttonView}
                      onPress={openDeleteMemberVeiw}>
                      <Image
                        source={ASSETS.trashCan}
                        style={[
                          styles.memberBtn,
                          [toggleDeleteMember && {tintColor: AppColors.error}],
                        ]}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.privateInfo}>
          <Image
            style={styles.chatAvatar}
            source={
              privateDate && privateDate.avatar
                ? {uri: privateDate.avatar}
                : ASSETS.defaultAvatarImage
            }
          />
          {privateDate && (
            <View style={styles.privateDataBackground}>
              <Text style={styles.privateData}>{privateDate.name}</Text>
              <Text style={[styles.privateData, {marginTop: 10}]}>
                {privateDate.email}
              </Text>
              {privateDate.onlineleStatus ? (
                <Text
                  style={[
                    styles.privateDataOnlineStatus,
                    {color: AppColors.onlineStatus, opacity: 0.7},
                  ]}>
                  Online
                </Text>
              ) : (
                <Text style={styles.privateDataOnlineStatus}>
                  Last seen{' '}
                  {formatDistance(
                    subDays(privateDate.wasOnline! * 1000, 0),
                    new Date(),
                    {
                      addSuffix: true,
                    },
                  )}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  infoModal: {
    flex: 1,
    margin: 0,
    height: '45%',
    width: '100%',
    position: 'absolute',
    backgroundColor: AppColors.font,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  info: {
    marginTop: '30%',
    marginLeft: '10%',
    marginRight: '10%',
    height: '100%',
  },
  infoHeader: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: AppColors.primary,
    borderRadius: 50,
  },
  chatName: {
    marginLeft: 30,
    width: '60%',
    height: 35,
    backgroundColor: AppColors.inputFont,
    borderWidth: 2,
    borderColor: AppColors.primary,
    borderRadius: 15,
    paddingLeft: 15,
  },
  applyBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
    width: 34,
    height: 34,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: AppColors.primary,
    backgroundColor: AppColors.white,
  },
  membersCount: {
    alignItems: 'center',
    marginTop: 20,
    height: '60%',
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: AppColors.primary,
  },
  members: {
    flexDirection: 'row',
    borderRadius: 15,
  },
  memberBtn: {
    width: 25,
    height: 25,
    opacity: 0.6,
  },
  buttonView: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 35,
    height: 35,
    backgroundColor: AppColors.primaryBorder,
    borderRadius: 50,
    marginTop: 35,
    marginRight: 9,
  },
  ownerBtnsView: {
    marginTop: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 40,
    height: 100,
    borderRadius: 30,
    borderColor: AppColors.primary,
    borderWidth: 1,
    backgroundColor: AppColors.primaryBorder,
  },
  ownerBtn: {
    margin: 5,
    borderRadius: 15,
  },
  owner: {
    fontFamily: 'Mulish',
    opacity: 0.3,
    fontSize: 12,
    marginLeft: 190,
    position: 'absolute',
  },
  membersScroll: {
    margin: 10,
    height: 180,
    width: 250,
    borderColor: AppColors.primary,
    borderWidth: 0.4,
    borderRadius: 15,
  },
  ownerBtns: {
    width: 40,
    alignItems: 'center',
  },
  text: {
    fontFamily: 'Mulish',
  },
  memberAvatar: {
    width: 24,
    height: 24,
    borderRadius: 50,
  },
  member: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    margin: 10,
  },
  markMemmber: {
    position: 'absolute',
    width: 17,
    height: 17,
    marginLeft: 210,
  },
  privateInfo: {
    flex: 1,
    marginTop: 80,
    alignItems: 'center',
  },
  privateData: {
    fontFamily: 'Mulish',
    marginTop: 10,
  },
  privateDataOnlineStatus: {
    fontFamily: 'Mulish',
    marginTop: 40,
    textAlign: 'center',
    opacity: 0.5,
  },
  privateDataBackground: {
    alignItems: 'center',
    width: 240,
    height: 70,
    marginTop: 20,
    backgroundColor: AppColors.primary,
    borderRadius: 60,
  },
});
