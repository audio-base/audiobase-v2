import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

class MediaCtrls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onSwipeRight = this.onSwipeRight.bind(this);
  }

  onSwipeRight(gestureState) {
    console.log('YOU SWIPED RIGHT');
    this.props.next();
  }

  render() {
    const { play, pause, rewind, state } = this.props;

    if (state === 'playing') {
      return (
        <GestureRecognizer
          onSwipeRight={(state) => this.onSwipeRight(state)}
        >
          <Image style={styles.image} source={{ uri: 'https://i1.sndcdn.com/artworks-000401422227-q9t0ac-large.jpg' }} />
          <Text style={styles.songTitle} >
            BLAHBLAHBLAH
            </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity activeOpacity={0.0} onPress={rewind}>
              <Image style={{ width: 40, height: 40 }} source={require('../img/rewind-10-black.png')} />
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.0} onPress={pause}>
              <Image style={{ width: 40, height: 40 }} source={require('../img/pause-black.png')} />
            </TouchableOpacity>
          </View>
        </GestureRecognizer>
      )
    } else {
      return (
        <View>
          <GestureRecognizer
            onSwipeRight={(state) => this.onSwipeRight(state)}
          >
            <Image style={styles.image} source={{ uri: 'https://i1.sndcdn.com/artworks-000401422227-q9t0ac-large.jpg' }} />
            <Text style={styles.songTitle} >
              BLAHBLAHBLAH
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity activeOpacity={0.0} onPress={rewind}>
                <Image style={{ width: 40, height: 40 }} source={require('../img/rewind-10-black.png')} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.0} onPress={play}>
                <Image style={{ width: 40, height: 40 }} source={require('../img/play-black.png')} />
              </TouchableOpacity>
            </View>
          </GestureRecognizer>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    maxHeight: '100%',
    height: 60,
    paddingRight: 14,
    // top: '100%',
    backgroundColor: '#e5e5e5',
  },
  image: {
    width: 60,
    height: 60,
    zIndex: 10,
    position: 'absolute'
  },
  songTitle: {
    justifyContent: 'center',
    alignItems: 'center',
    lineHeight: 60,
    zIndex: 10,
    position: 'absolute',
    left: 72,
    fontSize: 17,
  }
});

export default MediaCtrls;
