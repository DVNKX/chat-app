import React from 'react';
import {ImageSourcePropType} from 'react-native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ASSETS} from '../utils/assets';

interface IOptionsProps {
  navigate?: () => void;
  icon: ImageSourcePropType;
  text: string;
}

export const UIOptions: React.FC<IOptionsProps> = ({navigate, icon, text}) => (
  <View style={styles.tabsPos}>
    <TouchableOpacity style={styles.tabsButton} onPress={navigate}>
      <View style={styles.iconPos}>
        <Image style={styles.icon} source={icon} />
      </View>
      <View style={styles.textPos}>
        <Text style={styles.text}>{text}</Text>
      </View>
      <View style={styles.chevronPos}>
        <Image style={styles.chevron} source={ASSETS.chevronRight} />
      </View>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  tabsButton: {
    width: 343,
    height: 40,
    flexDirection: 'row',
  },
  iconPos: {
    justifyContent: 'center',
  },
  icon: {
    width: 17,
    height: 17,
  },
  textPos: {
    paddingLeft: 6,
    justifyContent: 'center',
  },
  text: {
    fontFamily: 'Mulish',
    fontWeight: '600',
  },
  chevronPos: {
    position: 'absolute',
    paddingTop: 15,
    paddingLeft: 320,
  },
  chevron: {
    width: 7.42,
    height: 12.02,
  },
  tabsPos: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 16,
  },
});
