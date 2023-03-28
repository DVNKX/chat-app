import {useNavigation} from '@react-navigation/native';
import React, {useCallback} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import type {NavigationProps} from '../../App';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';
import {Routes} from '../utils/routes';

export const Walkthrough = () => {
  const navigation = useNavigation<NavigationProps>();

  const navigateToSignIn = useCallback(() => {
    navigation.navigate(Routes.SIGN_IN);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.imagePos}>
          <Image style={styles.startImg} source={ASSETS.walkthroughImage} />
        </View>
        <View style={styles.textPos}>
          <Text style={styles.text}>
            Connect easily with your family and friends over countries
          </Text>
        </View>
      </View>
      <View style={styles.buttons}>
        <View style={styles.termsPos}>
          <TouchableOpacity style={styles.termsBtn}>
            <Text style={styles.termsText}>Terms & Privacy Policy</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.startBtn} onPress={navigateToSignIn}>
          <Text style={styles.startText}>Start Messaging</Text>
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
    backgroundColor: '#fff',
  },
  text: {
    color: '#0F1828',
    fontWeight: '700',
    fontSize: 24,
    fontFamily: 'Mulish',
    textAlign: 'center',
  },
  textPos: {
    paddingBottom: 42,
    paddingLeft: 47,
    paddingRight: 48,
  },
  termsBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 148,
    height: 24,
  },
  termsPos: {
    paddingBottom: 18,
  },
  startBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 327,
    height: 52,
    borderRadius: 30,
    backgroundColor: AppColors.primary,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },

  buttons: {
    paddingTop: 126,
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
  termsText: {
    fontFamily: 'Mulish',
    fontSize: 14,
  },
  startText: {
    fontFamily: 'Mulish',
    fontSize: 16,
  },
});
