import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert
} from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Search from './components/search.js';
import Playlist from './components/Playlist.js';
import TrackPlayer from 'react-native-track-player';
import MediaCtrls from './components/mediactrls.js';
import Chatbox from './components/Chat/Chatbox.js';
import { db } from './config.js';
console.disableYellowBox = true;

let roomsRef = db.ref('/rooms/');

let songsRef = db.ref('/songs');

class RoomScreen extends React.Component {
  state = {
    roomName: '',
    roomKey: ''
  };

  validateRoom() {
    roomsRef.on('value', snapshot => {
      var data = snapshot.val();
      var fbRoomName = Object.keys(data)[0];
      var fbRoomKey = data.hrla28.key;
      var userRoom = this.state.roomName.toLowerCase();
      var userKey = this.state.roomKey.toLowerCase();
      if (userRoom == fbRoomName && userKey == fbRoomKey) {
        this.props.navigation.navigate('Main');
      } else {
        Alert.alert(
          'Unauthorized',
          'Invalid Audiobase or Key',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
          { cancelable: false }
        );
      }
    });
  }

  render() {
    return (
      <View style={styles.signIn}>
        <Text style={styles.title}>Audiobase Name:</Text>
        <TextInput
          style={styles.nameInput}
          textAlign="center"
          autoCorrect={false}
          onSubmitEditing={this.onSubmitEdit}
          onChangeText={roomName => this.setState({ roomName })}
        />
        <Text style={styles.title}>Key:</Text>
        <TextInput
          style={styles.nameInput}
          textAlign="center"
          autoCorrect={false}
          onSubmitEditing={this.onSubmitEdit}
          onChangeText={roomKey => this.setState({ roomKey })}
        />
        <TouchableOpacity
          buttonStyle={{ marginTop: 20 }}
          style={styles.button}
          onPress={() => this.validateRoom()}
        >
          <Text style={styles.buttonText}>Join audiobase</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: 'idle',
      songs: [],
      currentSong: {},
      isSorted: false
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.rewind = this.rewind.bind(this);
    this.fetchSongsAndSetupPlayer = this.fetchSongsAndSetupPlayer.bind(this);
    this.handleSorted = this.handleSorted.bind(this);
  }

  componentDidMount() {
    this.fetchSongsAndSetupPlayer();
  }

  handleSorted() {
    // this.setState({
    //   isSorted: true,
    // })
    // setTimeout(
    //   this.setState({
    //     isSorted: false,
    //   }), 300)
  }

  fetchSongsAndSetupPlayer() {
    songsRef.on('value', snapshot => {
      let data = snapshot.val();
      let songs = data ? Object.values(data) : [];
      let i = 0;
      for (let id in data) {
        songs[i].uniqueId = id;
        i++;
      }
      this.setState(
        {
          songs: songs,
          currentSong: songs[0]
            ? songs[0]
            : {
                artist: 'null',
                artwork: '',
                id: '0',
                title: '',
                url: 'null'
              }
        },
        () => {
          // TrackPlayer.setupPlayer();
          // .then(() => {
          TrackPlayer.add(this.state.songs);
          // })
          // .catch(err => console.error(err));
        }
      );
    });
    // .then(() => {
    //   TrackPlayer.setupPlayer()
    //     .then(async () => {
    //       await TrackPlayer.add(this.state.songs);
    //     })
    //     .catch(err => console.error(err));
    // });
  }

  play() {
    TrackPlayer.play();
    TrackPlayer.getState().then(state =>
      this.setState({
        currentState: state,
        position: 0
      })
    );
  }

  pause() {
    TrackPlayer.pause();
    TrackPlayer.getState().then(state =>
      this.setState({
        currentState: state
      })
    );
  }

  next() {
    TrackPlayer.skipToNext().then(() =>
      this.setState({
        currentState: 'playing'
      })
    );
    this.removeFromDB();
    // this.fetchSongsAndSetupPlayer();
  }

  removeFromDB() {
    const { currentSong } = this.state;
    return songsRef.child(currentSong.uniqueId).remove();
  }

  rewind() {
    TrackPlayer.getPosition()
      .then(pos =>
        this.setState({
          position: pos
        })
      )
      .then(() => {
        let { position } = this.state;
        if (position < 10) {
          TrackPlayer.seekTo(0);
          this.setState({
            position: 0
          });
        } else {
          TrackPlayer.seekTo(position - 10);
          this.setState({
            position: position - 10
          });
        }
      });
  }

  render() {
    const { currentState, currentSong, isSorted } = this.state;

    return (
      <View style={styles.homeScreenContainer}>
        <View style={styles.playlistContainer}>
          <View>
            <Playlist mediaFetch={this.fetchSongsAndSetupPlayer} />
          </View>
        </View>
        <View style={styles.mediaContainer}>
          <View style={styles.mediaCtrls}>
            <MediaCtrls
              state={currentState}
              currentSong={currentSong}
              play={this.play}
              pause={this.pause}
              previous={this.previous}
              next={this.next}
              rewind={this.rewind}
            />
          </View>
        </View>
      </View>
    );
  }
}
class SearchScreen extends React.Component {
  render() {
    return (
      <View style={styles.appContainer}>
        <Search />
      </View>
    );
  }
}

class ChatScreen extends React.Component {
  state = {
    text: '',
    name: ''
  };

  onSubmitEdit = () => this.setState({ name: this.state.text });

  render() {
    if (this.state.name === '') {
      return (
        <View style={styles.chatLogin}>
          <Text style={styles.title}>Enter your name:</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="center"
            autoCorrect={false}
            onSubmitEditing={this.onSubmitEdit}
            onChangeText={text => this.setState({ text })}
          />
          <TouchableOpacity style={styles.button} onPress={this.onSubmitEdit}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return <Chatbox name={this.state.name} />;
    }
  }
}

const MainApp = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeScreen,
      navigationOptions: {
        gesturesEnabled: false,
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={24} />
        )
      }
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        gesturesEnabled: false,
        tabBarLabel: 'Search',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-search" color={tintColor} size={24} />
        )
      }
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        gesturesEnabled: false,
        tabBarLabel: 'Chat',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-chatboxes" color={tintColor} size={24} />
        )
      }
    }
  },
  {
    initialRouteName: 'Home',
    order: ['Home', 'Search', 'Chat'],
    // defaultNavigationOptions: {
    //   headerStyle: {
    //     backgroundColor: '#fff'
    //   }
    // },
    barStyle: { backgroundColor: '#694fad' }
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: MainApp,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    MyModal: {
      screen: RoomScreen
    }
  },
  {
    initialRouteName: 'MyModal',
    mode: 'modal',
    headerMode: 'none'
  }
);

//to start without having to signIn uncomment the next line and comment out the line after it
// export default createAppContainer(MainApp);
export default createAppContainer(RootStack);

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    fontSize: 16
  },
  nameInput: {
    borderColor: '#694fad',
    borderBottomWidth: 1,
    margin: 10,
    width: '80%',
    fontSize: 16
  },
  signIn: {
    paddingVertical: 20,
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16
  },
  button: {
    backgroundColor: '#694fad',
    padding: 10,
    alignItems: 'center',
    width: '70%'
  },
  buttonText: {
    color: 'white',
    fontSize: 16
  },
  appContainer: {
    flex: 1,
    alignItems: 'flex-start',
    top: 30,
    margin: 10
  },
  homeScreenContainer: {
    display: 'flex',
    flex: 6
  },
  playlistContainer: {
    position: 'absolute',
    display: 'flex',
    flex: 5,
    top: 35,
    width: '100%'
  },
  mediaContainer: {
    position: 'absolute',
    display: 'flex',
    flex: 1,
    bottom: 0
  },
  mediaCtrls: {
    shadowColor: '#000000',
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 1
    }
  },
  chatLogin: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 16
  }
});
