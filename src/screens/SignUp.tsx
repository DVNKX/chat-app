import {Alert, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {UIInput} from '../сomponents/UIInput';
import {Routes} from '../utils/routes';
import {useNavigation} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import type {NavigationProps} from '../../App';
import {useFormik} from 'formik';
import {authSchema} from '../utils/schemas';
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {auth} from '../firebase/firebase';
import {uploadEmailToServer} from '../services/userManagement';
import {LoadingOverlay} from '../сomponents/LoadingOverlay';
import {AppColors} from '../utils/colors';

export const SignUp: React.FC = () => {
  const navigation = useNavigation<NavigationProps>();

  const [isUserSigningUp, setIsUserSigningUp] = useState<boolean>(false);

  const navigateToProfile = useCallback(() => {
    navigation.navigate(Routes.PROFILE_ACCOUNT);
  }, [navigation]);

  const {values, errors, isValid, handleChange, handleSubmit} = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: authSchema,
    validateOnChange: true,
    onSubmit: async submittedValues => {
      try {
        setIsUserSigningUp(true);
        await createUserWithEmailAndPassword(
          auth,
          submittedValues.email,
          submittedValues.password,
        );
        await uploadEmailToServer(auth.currentUser!.uid, submittedValues.email);

        setIsUserSigningUp(false);
        navigateToProfile();
      } catch (e: any) {
        if (e.code.includes('auth/email-already-in-use')) {
          Alert.alert('Email already in use');
        }
      }
    },
  });

  return (
    <View style={styles.container}>
      {isUserSigningUp && <LoadingOverlay />}
      <View style={styles.textPos}>
        <Text style={styles.signUpText}>Sign up</Text>
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
          securedInput
        />
      </View>
      <View style={styles.btnPos}>
        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleSubmit as () => void}
          disabled={!isValid}>
          <Text style={styles.btnText}>Sign up</Text>
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
  btnText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 16,
  },
  btnPos: {
    paddingTop: 274,
  },
  signUpButton: {
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
  textPos: {
    paddingTop: 79,
    paddingBottom: 5,
  },
  signUpText: {
    fontFamily: 'Mulish',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
});
