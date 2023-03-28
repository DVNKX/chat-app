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
          submitedValues.email,
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
        <Text style={styles.signInText}>
          Enter your email address and password
        </Text>
      </View>
      <View>
        <Text style={styles.signUpText}>
          or sign up if you don`t have an account{' '}
        </Text>
      </View>
      <View style={styles.input}>
        <UIInput
          placeholder={'Enter your email'}
          keyboardType={'email-address'}
          value={values.email}
          onChangeText={handleChange('email')}
          error={errors.email}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <UIInput
          placeholder={'Enter your password'}
          value={values.password}
          onChangeText={handleChange('password')}
          error={errors.password}
          autoCorrect={false}
          securedInput={true}
        />
      </View>
      <View style={styles.buttons}>
        <View style={styles.signInBtnPos}>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={handleSubmit as () => void}
            // onPress={navigateToTabs}
            disabled={!isValid}>
            <Text style={styles.signInBtnText}>Sign in</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={navigateToSignUp}>
          <Text style={styles.signUpBtnText}>Sign up</Text>
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
    backgroundColor: '#fff',
  },
  input: {
    paddingTop: 95,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textPos: {
    paddingTop: 79,
    paddingBottom: 5,
  },
  signInText: {
    fontFamily: 'Mulish',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  signUpText: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 14,
  },
  signInBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 327,
    height: 46,
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
  signInBtnText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 16,
  },
  signInBtnPos: {
    paddingBottom: 15,
  },

  signUpButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 76,
    height: 25,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
  },
  signUpBtnText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 16,
  },
  buttons: {
    alignItems: 'center',
    paddingTop: 195,
  },
});
