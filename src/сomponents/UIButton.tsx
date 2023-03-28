import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {AppColors} from '../utils/colors';

interface IButtonProps extends TouchableOpacityProps {
  text: string;
  marginTop?: number;
  marginBottom?: number;
}

export const UIButton: React.FC<IButtonProps> = ({
  text,
  marginTop,
  marginBottom,
  ...props
}) => (
  <View style={{marginTop: marginTop, marginBottom: marginBottom}}>
    <TouchableOpacity {...props} style={styles.button}>
      <Text style={styles.btnText}>{text}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 130,
    height: 33,
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
  btnText: {
    fontFamily: 'Mulish',
    fontWeight: '500',
    fontSize: 14,
  },
});
