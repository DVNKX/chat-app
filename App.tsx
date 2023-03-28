import {
  NavigationContainer,
  NavigatorScreenParams,
} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Walkthrough} from './src/screens/Walkthrough';
import {SignIn} from './src/screens/SignIn';
import {SignUp} from './src/screens/SignUp';
import {Provider} from 'react-redux';
import {setStore} from './src/store/store';
import './src/firebase/firebase';
import {ShavronLeft} from './src/сomponents/ChavronLeft';
import {ProfileAccount} from './src/screens/ProfileAccount';
import {BottomTabParamList, Tabs} from './src/screens/Tabs';
import {Chat} from './src/screens/Chat';
import {onAuthStateChanged} from 'firebase/auth';
import {auth} from './src/firebase/firebase';
import {uploadUserOnlineStatus} from './src/services/userManagement';
import {userSlice} from './src/store/slices/userSlice';
import {Routes} from './src/utils/routes';
import {SearchUser} from './src/screens/SearchUser';
import {ChangeAvatar} from './src/screens/ChangeAvatar';

export type RootStackParamList = {
  Walkthrough: {name: string} | undefined;
  SignIn: {name: string} | undefined;
  SignUp: {name: string} | undefined;
  ProfileAccount: {name: string} | undefined;
  Tabs: NavigatorScreenParams<BottomTabParamList>;
  Contacts: {name: string} | undefined;
  More: {name: string} | undefined;
  Chats: {name: string} | undefined;
  Chat: {name: string} | undefined;
  SearchUser: {name: string} | undefined;
  ChangeAvatar: {name: string} | undefined;
};

export type NavigationProps = StackNavigationProp<RootStackParamList>;

const RootStack = createStackNavigator<RootStackParamList>();

const App = () => {
  const store = setStore();

  const [authState, setAuthState] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, userData => {
      if (userData) {
        store.dispatch(
          userSlice.actions.setUser({
            id: userData.uid,
            email: userData.email,
          }),
        );
        setAuthState(true);
        uploadUserOnlineStatus(userData.uid, true);
      } else {
        const prevUserUid = store.getState().user.id;
        store.dispatch(userSlice.actions.logOut());
        if (prevUserUid) {
          uploadUserOnlineStatus(prevUserUid, false);
        } else {
          console.error('Impossible to set user status offline');
        }
        setAuthState(false);
      }
    });
  }, []); //eslint-disable-line

  const authSettings = {
    headerBackTitleVisible: false,
    headerTitle: '',
    headerShadowVisible: false,
    headerBackImage: () => <ShavronLeft />,
    gestureEnabled: false,
  };

  const tabsSettings = {
    headerShown: false,
    gestureEnabled: false,
  };

  return (
    <NavigationContainer>
      <Provider store={store}>
        <RootStack.Navigator>
          <RootStack.Screen
            name={Routes.WALKTHROUGH}
            component={Walkthrough}
            options={{
              headerShown: false,
            }}
          />
          <RootStack.Screen
            name={Routes.SIGN_IN}
            component={SignIn}
            options={authSettings}
          />
          <RootStack.Screen
            name={Routes.SIGN_UP}
            component={SignUp}
            options={authSettings}
          />
          {authState && (
            <RootStack.Group>
              <RootStack.Screen
                name={Routes.PROFILE_ACCOUNT}
                component={ProfileAccount}
                options={tabsSettings}
              />
              <RootStack.Screen
                name={Routes.CHANGE_AVATAR}
                component={ChangeAvatar}
                options={{
                  presentation: 'modal',
                  cardStyle: {
                    marginTop: 240,
                    marginBottom: 340,
                    marginLeft: 40,
                    marginRight: 40,
                    borderRadius: 15,
                  },
                  headerShown: false,
                }}
              />
              <RootStack.Screen
                name={Routes.TABS}
                component={Tabs}
                options={tabsSettings}
              />
              <RootStack.Screen
                name={Routes.CHAT}
                component={Chat}
                options={tabsSettings}
              />
              <RootStack.Screen
                name={Routes.SEARCH_USER}
                component={SearchUser}
                options={{
                  presentation: 'modal',
                  cardStyle: {
                    marginTop: 75,
                    marginBottom: 350,
                    marginLeft: 24,
                    marginRight: 24,
                    borderRadius: 15,
                  },
                  headerShown: false,
                }}
              />
            </RootStack.Group>
          )}
        </RootStack.Navigator>
      </Provider>
    </NavigationContainer>
  );
};

export default App;
