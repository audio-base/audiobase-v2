import React from 'react';
import { View, TouchableOpacity, Image } from 'react-native';

const MediaCtrls = (props) => {
  const { play, pause, previous, next, state } = props;
  if (state === 'playing') {
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: "center" }} >
      <TouchableOpacity activeOpacity={0.0} onPress={previous}>
        <Image source={require('../img/skip-previous.png')} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.0} onPress={pause}>
        <Image source={require('../img/pause.png')} />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.0} onPress={next}>
        <Image source={require('../img/skip-next.png')} />
      </TouchableOpacity>
    </View>
    )
  } else {
    return (
      <View style={{ flex: 1, flexDirection: 'row', justifyContent: "center", alignItems: "center" }} >
        <TouchableOpacity activeOpacity={0.0} onPress={previous}>
          <Image source={require('../img/skip-previous.png')} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.0} onPress={play}>
          <Image source={require('../img/play-arrow.png')} />
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.0} onPress={next}>
          <Image source={require('../img/skip-next.png')} />
        </TouchableOpacity>
      </View>
    )
  }
}

export default MediaCtrls;
