import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NavigationProps} from '../../App';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';
import {Routes} from '../utils/routes';
import {PrivacyPolicyModal} from '../сomponents/PrivacyPolicyModal';

export const Walkthrough = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const toggleModal = useCallback(() => {
    setIsVisible(!isVisible);
  }, [isVisible]);

  const navigateToSignIn = useCallback(() => {
    navigation.navigate(Routes.SIGN_IN);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.imagePos}>
        <Image style={styles.startImg} source={ASSETS.walkthroughImage} />
        <Text style={styles.headerText}>
          Connect easily with your family and friends over countries
        </Text>
      </View>
      <View
        style={
          Platform.OS.includes('android')
            ? [styles.buttons, {paddingTop: 140}]
            : styles.buttons
        }>
        <TouchableOpacity style={styles.termsBtn} onPress={toggleModal}>
          <Text style={styles.text}>Terms & Privacy Policy</Text>
        </TouchableOpacity>
        <PrivacyPolicyModal isVisible={isVisible} setIsVisible={toggleModal} />
        <TouchableOpacity style={styles.startBtn} onPress={navigateToSignIn}>
          <Text style={[styles.text, {fontSize: 16}]}>Start Messaging</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: AppColors.white,
  },
  text: {
    fontFamily: 'Mulish',
  },
  headerText: {
    color: '#0F1828',
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
  },
  termsBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 148,
    height: 24,
    marginBottom: 20,
  },
  startBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 327,
    height: 52,
    borderRadius: 30,
    backgroundColor: AppColors.primary,
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  buttons: {
    paddingTop: 186,
    alignItems: 'center',
  },
  startImg: {
    width: 262,
    height: 271,
  },
  imagePos: {
    paddingTop: 135,
    paddingLeft: 51,
    paddingRight: 51,
  },
});
