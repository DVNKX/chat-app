import React from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  KeyboardTypeOptions,
} from 'react-native';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';

interface ISearchInput {
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  value?: string;
  onChange?: any;
  autoCorrect?: boolean;
}

export const UISearchInput: React.FC<ISearchInput> = ({
  placeholder,
  keyboardType,
  value,
  onChange,
  autoCorrect,
}) => (
  <View style={styles.input}>
    <TextInput
      placeholder={placeholder}
      keyboardType={keyboardType}
      value={value}
      onChangeText={onChange}
      style={styles.inputStyle}
      autoCorrect={autoCorrect}
      autoCapitalize="none"
    />
    <View style={styles.iconPos}>
      <Image style={styles.inputIcon} source={ASSETS.search} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  input: {
    justifyContent: 'center',
  },
  inputIcon: {
    width: 16,
    height: 16,
    opacity: 0.3,
  },
  iconPos: {
    position: 'absolute',
    paddingLeft: 8,
  },
  error: {
    fontFamily: 'Mulish',
    fontSize: 10,
    fontWeight: '500',
    color: 'red',
    paddingLeft: 10,
  },
  inputStyle: {
    width: 327,
    height: 36,
    borderRadius: 5,
    backgroundColor: AppColors.inputFont,
    fontFamily: 'Mulish',
    paddingLeft: 32,
  },
});
