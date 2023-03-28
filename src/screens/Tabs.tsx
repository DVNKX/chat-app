import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Chats} from './Chats';
import {Contacts} from './Contacts';
import {More} from './More';
import Icon from 'react-native-vector-icons/Ionicons';
import {useCallback} from 'react';
import {Routes} from '../utils/routes';
import {RootStackParamList} from '../../App';

const Tab = createBottomTabNavigator<RootStackParamList>();

interface IGetIconProps {
  focused: boolean;
  color: string;
  size: number;
}

export type BottomTabParamList = {
  Contacts: undefined;
  Chats: undefined;
  More: undefined;
};

export const Tabs = () => {
  const getIcon = useCallback(
    (iconName: string) =>
      ({focused, color, size}: IGetIconProps) =>
        focused ? (
          <Icon name={iconName} size={size} color={color} />
        ) : (
          <Icon name={`${iconName}-outline`} size={size} color={color} />
        ),
    [],
  );

  const getScreenOptions = useCallback(
    (iconName: string) => ({
      headerShown: false,
      tabBarShowLabel: false,
      tabBarIcon: getIcon(iconName),
    }),
    [getIcon],
  );

  return (
    <Tab.Navigator initialRouteName="Contacts">
      <Tab.Screen
        name={Routes.CONTACTS}
        component={Contacts}
        options={getScreenOptions('people')}
      />
      <Tab.Screen
        name={Routes.CHATS}
        component={Chats}
        options={getScreenOptions('chatbubble')}
      />
      <Tab.Screen
        name={Routes.MORE}
        component={More}
        options={getScreenOptions('options')}
      />
    </Tab.Navigator>
  );
};
