import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {AppColors} from '../utils/colors';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {first} from 'lodash';
import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../App';
import {Routes} from '../utils/routes';
import {useStore} from 'react-redux';
import {userSlice} from '../store/slices/userSlice';

export const ChangeAvatar = () => {
  const navigation = useNavigation<NavigationProps>();
  const navigateToProfileAccount = useCallback(() => {
    navigation.navigate(Routes.PROFILE_ACCOUNT);
  }, [navigation]);

  const store = useStore();

  const takePhotoFromCamera = async () => {
    const image = await launchCamera({
      mediaType: 'photo',
      maxHeight: 100,
      maxWidth: 100,
      includeBase64: true,
      quality: 0.8,
    });

    const firstImage = first(image.assets);

    if (firstImage) {
      store.dispatch(userSlice.actions.setInfo({image: firstImage.base64}));
    }
  };

  const takePhotoFromGallery = async () => {
    const image = await launchImageLibrary({
      mediaType: 'photo',
      maxHeight: 100,
      maxWidth: 100,
      includeBase64: true,
      quality: 0.8,
      selectionLimit: 1,
    });

    const firstImage = first(image.assets);

    if (firstImage) {
      store.dispatch(userSlice.actions.setInfo({image: firstImage.base64}));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={takePhotoFromGallery}
        style={[styles.button, {width: 135}]}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={takePhotoFromCamera}
        style={[styles.button, {width: 120}]}>
        <Text style={styles.buttonText}>Make photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={navigateToProfileAccount}
        style={[styles.button, {width: 100}]}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    borderRadius: 15,
    margin: 10,
    backgroundColor: AppColors.primary,
  },
  buttonText: {
    fontFamily: 'Mulish',
  },
});
