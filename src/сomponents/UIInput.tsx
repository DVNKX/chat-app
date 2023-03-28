import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {AppColors} from '../utils/colors';
import {ASSETS} from '../utils/assets';

interface IInputProps extends TextInputProps {
  error?: string;
  securedInput?: boolean;
}

export const UIInput: React.FC<IInputProps> = ({
  error,
  value,
  style,
  securedInput,
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);

  const togglePassword = useCallback(() => {
    setSecureTextEntry(!secureTextEntry);
  }, [secureTextEntry]);

  return (
    <View style={styles.inputPad}>
      <TextInput
        {...props}
        secureTextEntry={securedInput && secureTextEntry}
        value={value}
        style={[error && value ? styles.notValidInput : styles.validInput]}
      />
      <View>{error && <Text style={styles.error}>{error}</Text>}</View>
      {props.placeholder?.includes('password') && (
        <TouchableOpacity style={styles.passwordBtn} onPress={togglePassword}>
          {value && (
            <Image
              style={styles.passwordIcon}
              source={
                secureTextEntry === true
                  ? ASSETS.hidePassword
                  : ASSETS.viewPasswor
              }
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputPad: {
    paddingBottom: 12,
  },
  validInput: {
    width: 327,
    height: 36,
    borderRadius: 5,
    backgroundColor: AppColors.inputFont,
    paddingLeft: 10,
    fontFamily: 'Mulish',
  },
  notValidInput: {
    width: 327,
    height: 36,
    borderWidth: 1,
    borderColor: '#ed4337',
    borderRadius: 5,
    backgroundColor: AppColors.inputFont,
    paddingLeft: 10,
    fontFamily: 'Mulish',
  },
  error: {
    fontFamily: 'Mulish',
    fontSize: 10,
    fontWeight: '500',
    color: 'red',
    paddingLeft: 10,
  },
  passwordIcon: {
    width: 24,
    height: 24,
    opacity: 0.65,
  },
  passwordBtn: {
    position: 'absolute',
    marginTop: 6.5,
    marginLeft: 290,
  },
});
