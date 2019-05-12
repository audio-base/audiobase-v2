import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity
} from 'react-native';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { createAppContainer } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import Search from './components/search.js';
import Playlist from './components/Playlist.js';
import TrackPlayer from 'react-native-track-player';
import MediaCtrls from './components/mediactrls.js';
import Chatbox from './components/Chat/Chatbox.js';
import { db } from './config.js';
console.disableYellowBox = true;

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

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: 'idle',
      songs: [],
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.next = this.next.bind(this);
    this.rewind = this.rewind.bind(this);
  }

  componentDidMount() {
    songsRef.once('value', snapshot => {
      let data = snapshot.val();
      let songs = Object.values(data);
      this.setState({ songs });
      // console.log(this.state.songs, 'FROM FETCH')
    })
      .then(() => {
        TrackPlayer.setupPlayer()
          .then(async () => {
            // console.log(this.state.songs, 'FROM SETUP')
            await TrackPlayer.add(this.state.songs);
          })
          .catch(err => console.error(err));
      })
  }

  play() {
    TrackPlayer.play();
    TrackPlayer.getState()
      .then((state) => this.setState({
        currentState: state,
        position: 0,
      }))
  }

  pause() {
    TrackPlayer.pause();
    TrackPlayer.getState()
      .then((state) => this.setState({
        currentState: state,
      }))
  }

  next() {
    TrackPlayer.skipToNext()
      .then(() => this.setState({
        currentState: 'playing',
      }))
  }

  rewind() {
    TrackPlayer.getPosition()
      .then((pos) => this.setState({
        position: pos,
      }))
      .then(() => {
        let { position } = this.state;
        if (position < 10) {
          TrackPlayer.seekTo(0);
          this.setState({
            position: 0,
          })
        } else {
          TrackPlayer.seekTo(position - 10);
          this.setState({
            position: position - 10,
          })
        }
      })
  }

  render() {
    const { currentState } = this.state;

    return (
      <View style={styles.homeScreenContainer} >
        <View style={styles.playlistContainer}>
          <View>
            <Playlist />
          </View>
        </View>
        <View style={styles.mediaContainer}>
          <View style={styles.mediaCtrls}>
            <MediaCtrls state={currentState} play={this.play} pause={this.pause} previous={this.previous} next={this.next} rewind={this.rewind} />
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

export default createAppContainer(
  createMaterialBottomTabNavigator(
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
  )
);

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: 'flex-start',
    top: 30,
    margin: 10
  },
  homeScreenContainer: {
    display: 'flex',
    flex: 6,
  },
  playlistContainer: {
    position: 'absolute',
    display: 'flex',
    flex: 5,
    top: 35,
    width: '100%',
  },
  mediaContainer: {
    position: 'absolute',
    display: 'flex',
    flex: 1,
    bottom: 0,
  },
  mediaCtrls: {
    shadowColor: "#000000",
    shadowOpacity: 0.6,
    shadowRadius: 4,
    shadowOffset: {
      height: 1,
      width: 1
    },
  },
  chatLogin: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
});
