import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {ASSETS} from '../utils/assets';
import {UIStory} from '../сomponents/UIStory';
import {UIChat} from '../сomponents/UIChat';
import {UISearchInput} from '../сomponents/UISearchInput';

export const Chats = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.content}>
          <View style={styles.textBlock}>
            <Text style={styles.headerText}>Chats</Text>
          </View>
          <View style={styles.btnBlock}>
            <TouchableOpacity style={styles.addChat}>
              <Image style={styles.headerBtn} source={ASSETS.addChat} />
            </TouchableOpacity>
            <View>
              <TouchableOpacity style={styles.hamburger}>
                <Image style={styles.headerBtn} source={ASSETS.hamburger} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.storyContainer}>
        <ScrollView horizontal={true}>
          <View style={styles.storyPos}>
            <TouchableOpacity style={styles.story}>
              <View>
                <View style={styles.userStory}>
                  <View style={styles.avatarPos}>
                    <View style={styles.userAvatarPos}>
                      <Text style={styles.userAvatar}>+</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.namePos}>
                  <Text style={styles.storyName}>Your Story</Text>
                </View>
              </View>
            </TouchableOpacity>
            <UIStory
              avatar={ASSETS.president}
              userName={'Zelenskiy Volodimir'}
              isViewed={false}
            />
            <UIStory
              avatar={ASSETS.women1}
              userName={'Natalia'}
              isViewed={true}
            />
            <UIStory avatar={ASSETS.blob} userName={'Blob'} isViewed={true} />
          </View>
        </ScrollView>
      </View>
      <View style={styles.borderPos}>
        <View style={styles.border} />
      </View>
      <View style={styles.contactList}>
        <View style={styles.inputPos}>
          <UISearchInput placeholder="Search" />
        </View>
        <ScrollView>
          <UIChat
            avatar={ASSETS.women1}
            userName={'Natalia'}
            date={'Today'}
            message={'Dress looking pretty good! Thank you)slfkmslfbm.'}
            status={true}
            messageCount={1}
          />
          <UIChat
            avatar={ASSETS.president}
            userName={'Zelenskiy'}
            date={11.11}
            message={'Watermalone was retuned!. Be brave!'}
            status={false}
          />
          <UIChat
            avatar={ASSETS.blob}
            userName={'Blob'}
            date={'Everyday'}
            message={'Pathetic'}
            status={true}
            messageCount={14}
          />
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  header: {
    width: '100%',
    height: 90,
    paddingTop: 47,
    paddingBottom: 13,
    paddingLeft: 24,
    paddingRight: 24,
  },
  content: {
    height: 30,
    width: 327,
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  textBlock: {
    width: 263,
    height: '100%',
  },

  headerText: {
    fontFamily: 'Mulish',
    fontWeight: '600',
    fontSize: 18,
    paddingTop: 3,
  },
  headerBtn: {
    height: 19,
    width: 19,
  },

  btnBlock: {
    width: 56,
    height: 24,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 8,
    flexDirection: 'row',
  },
  addChat: {paddingTop: 2, paddingBottom: 2, paddingLeft: 3, paddingRight: 3},
  hamburger: {paddingTop: 2, paddingBottom: 2, paddingLeft: 8},
  storyContainer: {
    width: '100%',
    height: 104,
  },
  storyPos: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingLeft: 24,
    paddingRight: 24,
    flexDirection: 'row',
  },
  story: {
    backgroundColor: '#fff',
    paddingRight: 16,
  },
  userStory: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#ADB5BD',
    borderRadius: 16,
  },

  userAvatarPos: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    backgroundColor: '#F7F7FC',
    borderRadius: 16,
  },
  avatarPos: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  userAvatar: {
    fontSize: 21,
    color: '#000',
  },

  namePos: {
    paddingTop: 4,
    alignItems: 'center',
  },
  storyName: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 10,
  },
  border: {
    width: 400,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EDEDED',
  },
  borderPos: {
    alignItems: 'center',
  },
  contactList: {
    width: '100%',
    height: 284,
  },
  inputPos: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
});
