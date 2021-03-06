import React from 'react';
import { Text, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';

class MediaCtrls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onSwipeLeft = this.onSwipeLeft.bind(this);
  }

  onSwipeLeft(gestureState) {
    this.props.next();
  }

  render() {
    const { play, pause, rewind, state, currentSong } = this.props;

    if (state === 'playing') {
      return (
        <GestureRecognizer onSwipeLeft={(state) => this.onSwipeLeft(state)}>
          <Image style={styles.image} source={{ uri: `${currentSong.artwork}` }} />
          <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail" >
            {currentSong.title}
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
          <GestureRecognizer onSwipeLeft={(state) => this.onSwipeLeft(state)}>
            <Image style={styles.image} source={{ uri: `${currentSong.artwork}` }} />
            <Text style={styles.songTitle} numberOfLines={1} ellipsizeMode="tail" >
              {currentSong.title}
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
        </View >
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
    width: 200,
  },
  textContainer: {
    width: 100,
  }
});

export default MediaCtrls;
