import React from 'react';
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {AppColors} from '../utils/colors';

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
      <View style={styles.userStory}>
        <View style={styles.avatarPos}>
          <View style={styles.userAvatarPos}>
            <Image style={styles.usersAvatar} source={avatar} />
          </View>
        </View>
      </View>
    ) : (
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        locations={[0, 0.7]}
        colors={[AppColors.storyBorder, AppColors.activeStory]}
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
    backgroundColor: AppColors.white,
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
    backgroundColor: AppColors.storyBorder,
    borderRadius: 16,
  },
  usersAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: AppColors.black,
    borderWidth: 3,
    borderColor: AppColors.white,
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
    borderColor: AppColors.storyBorder,
    borderRadius: 16,
  },
});
