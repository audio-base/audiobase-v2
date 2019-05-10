import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../config.js';
import SortableList from 'react-native-sortable-list';

let songsRef = db.ref('/songs'); //grab songs from the key songs in db

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: []
    };
  }
  componentDidMount() {
    songsRef.on('value', snapshot => {
      let data = snapshot.val();
      let songs = data ? Object.values(data) : [];
      let i = 0;
      for (let key in data) {
        songs[i].id = key;
        songs[i].order = i;
        i++;
      }
      this.setState({ songs });
    });
  }

  handleRemove(id) {
    return songsRef.child(id).remove();
  }

  render() {
    return (
      <View style={styles.playlistContainer}>
        {this.state.songs.map((song, i) => (
          <View
            key={i}
            uri={song.uri}
            style={styles.songContainer}
            enableEmptySections
          >
            <ListItem
              leftAvatar={{
                source: {
                  uri: song.artwork
                }
              }}
              title={song.title}
              rightElement={
                <Icon
                  containerStyle={{ alignSelf: 'flex-start' }}
                  type="material"
                  color="#C8C8C8"
                  name="md-close"
                  onPress={() => this.handleRemove(song.id)}
                />
              }
            />
          </View>
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  playlistContainer: {
    width: '100%'
  }
  // songContainer: {
  //   flex: 1,
  //   // height: 50,
  //   // width: 50,
  //   flexDirection: 'row'
  // }
});

export default Playlist;
