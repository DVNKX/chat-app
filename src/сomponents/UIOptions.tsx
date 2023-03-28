import React from 'react';
import {Alert, ImageSourcePropType} from 'react-native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ASSETS} from '../utils/assets';

interface IOptionsProps {
  action?: () => void;
  icon: ImageSourcePropType;
  optionTitle: string;
}

export const UIOptions: React.FC<IOptionsProps> = ({
  action,
  icon,
  optionTitle,
}) => {
  const plugWarning = () => {
    Alert.alert(
      'Warning',
      `This is plug button. ${optionTitle} will be release in future updates!`,
      [{text: 'Got it.'}],
    );
  };

  return (
    <View style={styles.tabsPos}>
      <TouchableOpacity
        style={styles.tabsButton}
        onPress={action ? action : plugWarning}>
        <View style={styles.contentPos}>
          <Image style={styles.icon} source={icon} />
        </View>
        <View style={[styles.contentPos, {paddingLeft: 6}]}>
          <Text style={styles.text}>{optionTitle}</Text>
        </View>
        <View style={styles.chevronPos}>
          <Image style={styles.chevron} source={ASSETS.chevronRight} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabsPos: {
    marginTop: 8,
    marginLeft: 16,
    marginRight: 16,
  },
  tabsButton: {
    width: 343,
    height: 40,
    flexDirection: 'row',
  },
  contentPos: {
    justifyContent: 'center',
  },
  icon: {
    width: 17,
    height: 17,
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Mulish',
    fontWeight: '600',
  },
  chevronPos: {
    position: 'absolute',
    marginTop: 15,
    marginLeft: 320,
  },
  chevron: {
    width: 7.42,
    height: 12.02,
  },
});
