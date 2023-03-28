import {Image, StyleSheet} from 'react-native';
import {ASSETS} from '../utils/assets';

export const ShavronLeft = () => (
  <Image source={ASSETS.chevronLeft} style={styles.shavron} />
);

const styles = StyleSheet.create({
  shavron: {
    height: 14.5,
    width: 24,
    marginLeft: 7,
  },
});
