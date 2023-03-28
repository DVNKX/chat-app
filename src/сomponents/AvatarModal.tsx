import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {AppColors} from '../utils/colors';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {first} from 'lodash';
import React, {useState} from 'react';
import {useStore} from 'react-redux';
import {useAppSelector} from '../hooks/redux';
import {LoadingOverlay} from './LoadingOverlay';
import {userSlice} from '../store/slices/userSlice';
import Modal from 'react-native-modal';
import {deleteObject, getDownloadURL, ref, uploadBytes} from 'firebase/storage';
import {storage} from '../firebase/firebase';
import {uploadProfileAvatarToServer} from '../services/userManagement';
import {ASSETS} from '../utils/assets';

interface IAvatar {
  visble: boolean;
  setVisble: () => void;
}

export const AvatarModal: React.FC<IAvatar> = ({visble, setVisble}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const store = useStore();
  const id = useAppSelector(state => state.user.id);
  const avatar = useAppSelector(state => state.user.image);

  const backDropPress = () => {
    setIsLoading(false);
    setVisble();
  };

  const takePhotoFromCamera = async () => {
    const image = await launchCamera({
      mediaType: 'photo',
      maxHeight: 100,
      maxWidth: 100,
      includeBase64: true,
      quality: 0.8,
    });
  };

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
      const uploadedImage = await uploadImage(imageAssets!.uri!);
      await uploadProfileAvatarToServer(id, imageAssets!.uri!);
      store.dispatch(userSlice.actions.setInfo({image: uploadedImage}));
      setInterval(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setInterval(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const uploadImage = async (uri: string) => {
    const blob: Blob = await new Promise((res, rej) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => {
        res(xhr.response);
      };
      xhr.onerror = e => {
        console.error(e);
        rej(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    try {
      setIsLoading(true);
      const storageRef = ref(storage, `avatars/user${id}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    } catch (e) {
      console.error(e);
    }
  };

  const deleteImage = async () => {
    setIsLoading(true);
    const deleteRef = ref(storage, `avatars/user${id}`);
    try {
      deleteObject(deleteRef);
      store.dispatch(userSlice.actions.setInfo({image: ASSETS.trashCan}));
      setInterval(() => {
        setIsLoading(false);
      }, 1000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Modal
      style={styles.container}
      isVisible={visble}
      onBackdropPress={backDropPress}>
      {isLoading && <LoadingOverlay />}
      <TouchableOpacity
        onPress={pickImage}
        style={[styles.button, {width: 135}]}>
        <Text style={styles.buttonText}>Choose Photo</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={takePhotoFromCamera}
        style={[styles.button, {width: 120}]}>
        <Text style={styles.buttonText}>Make Photo</Text>
      </TouchableOpacity>
      {avatar && (
        <TouchableOpacity
          onPress={deleteImage}
          style={[styles.button, {width: 160}]}>
          <Text style={styles.buttonText}>Delete Current Image</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={setVisble} style={styles.button}>
        <Text style={styles.buttonText}>Back</Text>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginLeft: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppColors.storyBackground,
    width: '100%',
    minHeight: 250,
    marginTop: 600,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 32,
    borderRadius: 15,
    margin: 10,
    backgroundColor: AppColors.primary,
    width: 100,
  },
  buttonText: {
    fontFamily: 'Mulish',
  },
});
