import {useNavigation} from '@react-navigation/native';
import {useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {NavigationProps} from '../../App';
import {ASSETS} from '../utils/assets';
import {Routes} from '../utils/routes';

export const Chat = () => {
  const navigation = useNavigation<NavigationProps>();
  const navigateToTabs = useCallback(() => {
    navigation.navigate(Routes.TABS, {screen: Routes.CHATS});
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerPos}>
          <TouchableOpacity style={styles.backBtn} onPress={navigateToTabs}>
            <View style={styles.chevronPos}>
              <Image source={ASSETS.chevronLeft} style={styles.chevron} />
            </View>
            <View style={styles.backBtnTextPos}>
              <Text style={styles.backBtnText}>User</Text>
            </View>
          </TouchableOpacity>
          <View style={styles.searchHamburgerBtn}>
            <TouchableOpacity>
              <View style={styles.searchPos}>
                <Image style={styles.search} source={ASSETS.search} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Image style={styles.hamburger} source={ASSETS.hamburger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.borderPos}>
        <View style={styles.border} />
      </View>
      <View style={styles.chatPos} />
      <View style={styles.borderPos}>
        <View style={styles.border} />
      </View>
      <View style={styles.messageField}>
        <View style={styles.messageFieldPos}>
          <View>
            <TouchableOpacity style={styles.plusBtn}>
              <Text style={styles.plus}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputMessagePos}>
            <TextInput
              autoCorrect={true}
              autoCapitalize={'words'}
              style={styles.inputMessage}
            />
          </View>
          <View>
            <TouchableOpacity style={styles.sendBtn}>
              <Image style={styles.send} source={ASSETS.send} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  header: {
    width: '100%',
    height: 90,
    backgroundColor: '#fff',
    paddingTop: 47,
    paddingBottom: 13,
    alignItems: 'center',
  },
  headerPos: {
    width: 343,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    flexDirection: 'row',
  },
  backBtnText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 18,
    paddingTop: 2,
  },
  chevron: {
    width: 20,
    height: 20,
  },
  search: {
    width: 20,
    height: 20,
  },
  hamburger: {
    width: 20,
    height: 20,
  },
  chevronPos: {paddingTop: 5},
  backBtnTextPos: {
    width: 247,
    height: 30,
    paddingLeft: 8,
  },
  searchHamburgerBtn: {
    paddingLeft: 8,
    flexDirection: 'row',
  },
  searchPos: {
    paddingRight: 8,
  },
  border: {
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  borderPos: {
    alignItems: 'center',
  },
  chatPos: {
    width: '100%',
    height: 667,
  },
  messageField: {
    backgroundColor: '#fff',
    width: '100%',
    height: 95,
  },
  messageFieldPos: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  inputMessage: {
    width: 279,
    height: 36,
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 4,
    borderColor: '#fff',
    backgroundColor: '#efefef',
    fontFamily: 'Mulish',
    fontWeight: '600',
  },
  send: {
    width: 20,
    height: 20,
  },
  plus: {
    fontSize: 28,
  },
  plusBtn: {
    paddingRight: 12,
    paddingTop: 10,
  },
  sendBtn: {
    paddingLeft: 12,
    paddingTop: 19,
  },
  inputMessagePos: {
    paddingTop: 10,
  },
});
