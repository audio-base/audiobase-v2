import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import MediaCtrls from './components/mediactrls.js';

TrackPlayer.setupPlayer().then(async () => {
  await TrackPlayer.add({
    id: '496702374',
    url: 'https://api.soundcloud.com/tracks/255766429/stream?client_id=FweeGBOOEOYJWLJN3oEyToGLKhmSz0I7',
    title: 'Street Lights - Kanye West',
    artist: 'null',
    artwork: 'https://i1.sndcdn.com/artworks-000401422227-q9t0ac-large.jpg',
  });
});

class App extends React.Component {
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
    console.log(this.state);
  }
  
  pause() {
    TrackPlayer.pause();
    TrackPlayer.getState()
      .then((state) => this.setState({
        currentState: state,
      }))
    console.log(this.state);
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
      <View style={styles.container}>
        <MediaCtrls state={currentState} play={this.play} pause={this.pause} previous={this.previous} next={this.next} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});

export default App;
