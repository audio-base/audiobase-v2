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

TrackPlayer.setupPlayer().then(async () => {
  await TrackPlayer.add({
    id: '496702374',
    url: 'https://api.soundcloud.com/tracks/255766429/stream?client_id=FweeGBOOEOYJWLJN3oEyToGLKhmSz0I7',
    title: 'Street Lights - Kanye West',
    artist: 'null',
    artwork: 'https://i1.sndcdn.com/artworks-000401422227-q9t0ac-large.jpg',
  });
});

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentState: 'idle',
    };
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.previous = this.previous.bind(this);
    this.next = this.next.bind(this);
  }
  play() {
    TrackPlayer.play();
    TrackPlayer.getState()
      .then((state) => this.setState({
        currentState: state,
      }))
  }
  
  pause() {
    TrackPlayer.pause();
    TrackPlayer.getState()
      .then((state) => this.setState({
        currentState: state,
      }))
  }

  previous() {
    TrackPlayer.skipToPrevious();
  }

  next() {
    TrackPlayer.skipToNext();
  }
  
  render() {
    const { currentState } = this.state;

    return (
      <View style={styles.appContainer}>
        <Playlist />
        <View style={styles.container}>
          <MediaCtrls state={currentState} play={this.play} pause={this.pause} previous={this.previous} next={this.next} />
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

  render(){
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
    // backgroundColor: '#fff',
    alignItems: 'flex-start',
    // justifyContent: 'center',
    top: 30,
    margin: 10
  },
  chatLogin: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
