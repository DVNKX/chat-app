import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {AppColors} from '../utils/colors';

interface IIndecator {
  paddingBottom?: number;
  marginTop?: number;
}

export const LoadingOverlay: React.FC<IIndecator> = ({
  paddingBottom,
  marginTop,
}) => (
  <View
    style={[
      StyleSheet.absoluteFill,
      styles.container,
      {paddingBottom: paddingBottom, marginTop: marginTop},
    ]}>
    <ActivityIndicator color={AppColors.primary} size="large" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    backgroundColor: 'rgba(255,255,255,0.30)',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
