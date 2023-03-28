import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface IStoryProps {
  avatar: any;
  userName: string;
  isViewed: boolean;
}

export const UIStory: React.FC<IStoryProps> = ({
  avatar,
  userName,
  isViewed,
}) => (
  <TouchableOpacity style={styles.story}>
    {isViewed ? (
      <View>
        <View style={styles.userStory}>
          <View style={styles.avatarPos}>
            <View style={styles.userAvatarPos}>
              <Image style={styles.usersAvatar} source={avatar} />
            </View>
          </View>
        </View>
      </View>
    ) : (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        locations={[0, 0.7]}
        colors={['#D2D5F9', '#2C37E1']}
        style={styles.usersStory}>
        <View style={styles.avatarPos}>
          <View style={styles.userAvatarPos}>
            <Image style={styles.usersAvatar} source={avatar} />
          </View>
        </View>
      </LinearGradient>
    )}
    <View style={styles.namePos}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.storyName}>
        {userName}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  story: {
    backgroundColor: '#fff',
    paddingRight: 16,
  },
  usersStory: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
  },
  avatarPos: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
    paddingBottom: 2,
  },
  userAvatarPos: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    backgroundColor: '#F7F7FC',
    borderRadius: 16,
  },
  usersAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: '#fff',
  },
  namePos: {
    paddingTop: 4,
    alignItems: 'center',
  },
  storyName: {
    fontFamily: 'Mulish',
    fontWeight: '400',
    fontSize: 10,
    width: 56,
  },
  userStory: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#ADB5BD',
    borderRadius: 16,
  },
});
