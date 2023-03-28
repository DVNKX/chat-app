import {StyleSheet, Alert} from 'react-native';
import {UIButton} from './UIButton';
import Modal from 'react-native-modal';
import React from 'react';
import {AppColors} from '../utils/colors';

interface IAudioImageModal {
  visible: boolean;
  setVisible: () => void;
}

export const AudioImageModal: React.FC<IAudioImageModal> = ({
  visible,
  setVisible,
}) => {
  const plugVideoWarning = () => {
    Alert.alert(
      'Warning',
      'This is plug button. Opportunity to sent audio message will be release in future updates!',
      [{text: 'Got it.'}],
    );
  };

  const plugAudioWarning = () => {
    Alert.alert(
      'Warning',
      'This is plug button. Opportunity to sent audio message will be release in future updates!',
      [{text: 'Got it.'}],
    );
  };

  return (
    <Modal
      backdropOpacity={0.3}
      isVisible={visible}
      onBackdropPress={setVisible}
      style={styles.container}>
      <UIButton onPress={plugVideoWarning} marginTop={20} text="Sent Photo" />
      <UIButton onPress={plugAudioWarning} marginTop={20} text="Sent Audio" />
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0,
    marginLeft: 0,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    backgroundColor: AppColors.storyBackground,
    marginTop: 755,
    height: 100,
    width: '100%',
  },
  text: {
    fontFamily: 'Mulish',
    fontSize: 16,
  },
});
