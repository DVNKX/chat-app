import React, {useEffect, useRef} from 'react';
import {View, TextInput, Image, StyleSheet, TextInputProps} from 'react-native';
import {ASSETS} from '../utils/assets';
import {AppColors} from '../utils/colors';

interface ISearch extends TextInputProps {
  fontColor?: string;
  focusable: boolean;
}

export const UISearchInput: React.FC<ISearch> = ({
  fontColor,
  focusable,
  ...props
}) => {
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (focusable) {
      inputRef.current?.focus();
    }
  }, []);

  return (
    <View style={styles.input}>
      <TextInput
        ref={inputRef}
        {...props}
        style={[styles.inputStyle, {backgroundColor: fontColor}]}
      />
      <View style={styles.iconPos}>
        <Image style={styles.inputIcon} source={ASSETS.search} />
      </View>
    </View>
  );
};

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
  inputStyle: {
    width: 327,
    height: 36,
    borderRadius: 5,
    backgroundColor: AppColors.inputFont,
    fontFamily: 'Mulish',
    paddingLeft: 32,
  },
});
