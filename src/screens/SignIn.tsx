import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import {UIInput} from '../сomponents/UIInput';
import {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import type {NavigationProps} from '../../App';
import {Routes} from '../utils/routes';
import {useFormik} from 'formik';
import {authSchema} from '../utils/schemas';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase/firebase';
import {LoadingOverlay} from '../сomponents/LoadingOverlay';
import {AppColors} from '../utils/colors';

export const SignIn = () => {
  const navigation = useNavigation<NavigationProps>();
  const [isUserSignIn, setIsUserSignIn] = useState<boolean>(false);

  const navigateToSignUp = useCallback(() => {
    navigation.navigate(Routes.SIGN_UP);
  }, [navigation]);

  const navigateToTabs = useCallback(() => {
    navigation.navigate(Routes.TABS, {screen: Routes.CHATS});
  }, [navigation]);

  const {values, errors, isValid, handleChange, handleSubmit} = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema,
    validateOnChange: true,
    onSubmit: async submitedValues => {
      try {
        setIsUserSignIn(true);
        await signInWithEmailAndPassword(
          auth,
          submitedValues.email.toLowerCase(),
          submitedValues.password,
        );
        setIsUserSignIn(false);
        navigateToTabs();
      } catch (e: any) {
        if (e.code.includes('auth/user-not-found')) {
          Alert.alert(
            'Wrong email!',
            'If you want to create a new account press "Sign Up"',
          );

          setIsUserSignIn(false);
        } else if (e.code.includes('auth/wrong-password')) {
          Alert.alert(
            'Wrong password!',
            'If you forgot your password now we cant help you, password change feauter will be add in future.',
          );
          setIsUserSignIn(false);
        }
      }
    },
  });

  return (
    <View style={styles.container}>
      {isUserSignIn && <LoadingOverlay />}
      <View style={styles.textPos}>
        <Text style={styles.headerText}>
          Enter your email address and password
        </Text>
        <Text style={styles.headerText2}>
          or sign up if you don`t have an account
        </Text>
      </View>
      <View style={styles.input}>
        <UIInput
          placeholder={'Enter your email'}
          placeholderTextColor={AppColors.playceholderColor}
          keyboardType={'email-address'}
          value={values.email}
          onChangeText={handleChange('email')}
          error={errors.email}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <UIInput
          placeholder={'Enter your password'}
          placeholderTextColor={AppColors.playceholderColor}
          value={values.password}
          onChangeText={handleChange('password')}
          error={errors.password}
          autoCorrect={false}
        />
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: AppColors.primary}]}
          onPress={handleSubmit as () => void}
          disabled={!isValid}>
          <Text style={styles.text}>Sign in</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, {marginTop: 15, width: 76, height: 25}]}
          onPress={navigateToSignUp}>
          <Text style={styles.text}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: AppColors.white,
  },
  input: {
    paddingTop: 95,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textPos: {
    marginTop: 79,
    marginBottom: 5,
  },
  text: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  headerText2: {
    fontWeight: '400',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 7,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 327,
    height: 46,
    borderRadius: 30,
    shadowColor: AppColors.black,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  buttons: {
    alignItems: 'center',
    marginTop: 195,
  },
});
