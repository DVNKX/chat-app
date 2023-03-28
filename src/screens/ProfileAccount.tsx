import {useState, useCallback} from 'react';
import {View, Text, StyleSheet, Image, Modal, Pressable} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {UIInput} from '../сomponents/UIInput';
import {Routes} from '../utils/routes';
import type {NavigationProps} from '../../App';
import {useNavigation} from '@react-navigation/native';
import {useFormik} from 'formik';
import {profileSchema} from '../utils/schemas';
import {auth} from '../firebase/firebase';
import {ASSETS} from '../utils/assets';
import {uploadProfileDataToServer} from '../services/userManagement';
import {updateProfile, User} from 'firebase/auth';
import {LoadingOverlay} from '../сomponents/LoadingOverlay';
import Toast from 'react-native-toast-message';
import {useStore} from 'react-redux';
import {userSlice} from '../store/slices/userSlice';
import {useAppSelector} from '../hooks/redux';

export const ProfileAccount = () => {
  const [isDataUploading, setIsDataUploading] = useState<boolean>(false);

  const store = useStore();
  const userAvatar = useAppSelector(state => state.user.image);

  const navigation = useNavigation<NavigationProps>();
  const navigateToTabs = useCallback(() => {
    navigation.navigate(Routes.TABS, {screen: Routes.MORE});
  }, [navigation]);

  const avatar = ASSETS.defaultAvatarImage;

  const showErrorToast = () => {
    Toast.show({
      type: 'error',
      text1: 'Something went wrong❗️',
      text2: 'Please, try again.',
    });
  };

  const {values, errors, isValid, handleChange, handleSubmit} = useFormik({
    initialValues: {
      name: '',
      surname: '',
    },

    validationSchema: profileSchema,
    validateOnChange: true,
    onSubmit: async submittedValues => {
      try {
        setIsDataUploading(true);
        await updateProfile(auth.currentUser as User, {
          displayName: submittedValues.name + ' ' + submittedValues.surname,
        });

        store.dispatch(
          userSlice.actions.setInfo({
            name: submittedValues.name,
            surname: submittedValues.surname,
            email: auth.currentUser!.email,
          }),
        );

        await uploadProfileDataToServer(
          auth.currentUser!.uid,
          submittedValues.name + ' ' + submittedValues.surname,
        );
        setIsDataUploading(false);
        navigateToTabs();
      } catch (e) {
        console.error(e);
        setIsDataUploading(false);
        showErrorToast();
      }
    },
  });

  const navigateToChangeAvatar = useCallback(() => {
    navigation.navigate(Routes.CHANGE_AVATAR);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Toast position="bottom" bottomOffset={120} />
      {isDataUploading && <LoadingOverlay />}
      <View style={styles.header}>
        <View style={styles.headerPos}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={navigateToTabs}
            disabled={!isValid}>
            <View style={styles.chevronPos}>
              <Image style={styles.chevron} source={ASSETS.chevronLeft} />
            </View>
            <Text style={styles.backText}>Your profile</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.avatarPos}>
        <View style={styles.avatar}>
          <TouchableOpacity onPress={navigateToChangeAvatar}>
            <Image
              style={
                ASSETS.defaultAvatarImage && userAvatar
                  ? styles.avatarImg
                  : styles.defaultAvatarImg
              }
              source={
                userAvatar
                  ? {uri: `data:image/jpeg;base64,${userAvatar}`}
                  : avatar
              }
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.input}>
        <UIInput
          placeholder="Enter your name (Required)"
          value={values.name}
          onChangeText={handleChange('name')}
          error={errors.name}
          autoCorrect={false}
        />
        <UIInput
          placeholder="Enter your surname (Optional)"
          value={values.surname}
          onChangeText={handleChange('surname')}
          error={errors.surname}
          autoCorrect={false}
        />
      </View>
      <View style={styles.btnPos}>
        <TouchableOpacity
          disabled={!isValid}
          style={styles.saveButton}
          onPress={handleSubmit as () => void}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatar: {
    borderRadius: 50,
    backgroundColor: '#F0F0F0',
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPos: {
    paddingTop: 46,
  },
  defaultAvatarImg: {
    width: 70,
    height: 70,
    alignItems: 'center',
  },
  input: {
    paddingTop: 31,
  },
  btnPos: {
    paddingTop: 68,
  },
  saveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 327,
    height: 46,
    borderRadius: 30,
    backgroundColor: '#91b3fa',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  btnText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 55,
    alignItems: 'center',
    borderColor: '#91b3fa',
    borderWidth: 1,
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    margin: 10,
    elevation: 2,
    backgroundColor: '#91b3fa',
    width: 120,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    height: 90,
    paddingTop: 47,
    paddingBottom: 13,
    paddingLeft: 16,
    paddingRight: 16,
  },
  headerPos: {
    width: 343,
    height: 30,
  },
  chevron: {
    width: 20,
    height: 20,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    fontFamily: 'Mulish',
    fontSize: 18,
    fontWeight: '600',
  },
  chevronPos: {
    paddingTop: 5.99,
    paddingBottom: 5.99,
    paddingLeft: 8.29,
    paddingRight: 8.29,
  },
});
