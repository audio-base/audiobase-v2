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

// TrackPlayer.setupPlayer().then(async () => {
//   await TrackPlayer.add({
//     id: '496702374',
//     url: 'https://api.soundcloud.com/tracks/255766429/stream?client_id=FweeGBOOEOYJWLJN3oEyToGLKhmSz0I7',
//     title: 'Street Lights - Kanye West',
//     artist: 'null',
//     artwork: 'https://i1.sndcdn.com/artworks-000401422227-q9t0ac-large.jpg',
//   })
//   await TrackPlayer.add({
//     id: '496702374',
//     url: 'https://api.soundcloud.com/tracks/11591831/stream?client_id=FweeGBOOEOYJWLJN3oEyToGLKhmSz0I7',
//     title: 'Street Lights - Kanye West',
//     artist: 'null',
//     artwork: 'https://i1.sndcdn.com/artworks-000401422227-q9t0ac-large.jpg',
//   });
// });

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
        <View>
          <Text style={styles.title}>Audiobase Name:</Text>
          <TextInput
            style={styles.nameInput}
            textAlign="center"
            autoCorrect={false}
            onSubmitEditing={this.onSubmitEdit}
            onChangeText={roomName => this.setState({ roomName })}
          />
        </View>
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
      currentSong: {}
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.rewind = this.rewind.bind(this);
    this.queue = this.queue.bind(this);
  }

  componentDidMount() {
    this.fetchSongsAndSetupPlayer();
  }

  fetchSongsAndSetupPlayer() {
    songsRef
      .once('value', snapshot => {
        let data = snapshot.val();
        let songs = Object.values(data);
        // console.log(data, 'THIS IS MY DATA');
        let i = 0;
        for (let id in data) {
          songs[i].uniqueId = id;
          i++;
        }

        // console.log(songs, 'MY SONGSSSS');
        this.setState({
          songs: songs,
          currentSong: songs[0]
        });
        console.log(this.state.currentSong.uniqueId, 'THIS IS THE UNIQUE ID');
        // console.log(this.state, 'FROM FETCH')
      })
      .then(() => {
        TrackPlayer.setupPlayer()
          .then(async () => {
            // console.log(this.state.songs, 'FROM SETUP')
            await TrackPlayer.add(this.state.songs);
          })
          .catch(err => console.error(err));
      });
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
    this.fetchSongsAndSetupPlayer();
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

  queue() {
    TrackPlayer.getQueue().then(data => {
      console.log(data, 'current player queue');
    });
    TrackPlayer.getCurrentTrack().then(data => {
      console.log(data, 'current track');
    });
  }

  render() {
    const { currentState, currentSong } = this.state;

    return (
      <View style={styles.homeScreenContainer}>
        <View style={styles.playlistContainer}>
          <View>
            <Playlist />
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
              queue={this.queue}
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
          <TouchableOpacity onPress={this.onSubmitEdit}>
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
        tabBarLabel: 'Home',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-home" color={tintColor} size={24} />
        )
      }
    },
    Search: {
      screen: SearchScreen,
      navigationOptions: {
        tabBarLabel: 'Search',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-search" color={tintColor} size={24} />
        )
      }
    },
    Chat: {
      screen: ChatScreen,
      navigationOptions: {
        tabBarLabel: 'Chat',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="md-chatboxes" color={tintColor} size={24} />
        )
      }
    }
  },
  {
    initialRouteName: 'Search',
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
      screen: MainApp
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

// export default createAppContainer(MainApp)
export default createAppContainer(RootStack);

const styles = StyleSheet.create({
  signIn: {
    paddingVertical: 20,
    flex: 2,
    justifyContent: 'center'
  },
  button: {
    backgroundColor: '#694fad',
    padding: 10,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white'
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
    justifyContent: 'center'
  }
});
