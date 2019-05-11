import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  StyleSheet,
  FlatList
} from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../config.js';
import SortableListView from 'react-native-sortable-listview';
// import Utils from './Utils.js';

let songsRef = db.ref('/songs'); //grab songs from the key songs in db

// function moveOrderItem(listView, fromIndex, toIndex) {
//   Utils.move(dataListOrder, parseInt(fromIndex), parseInt(toIndex));
//   if (listView.forceUpdate) listView.forceUpdate();
// }
// function getOrder(list) {
//   return Object.keys(list);
// }
let data = {
  hello: { text: 'world' },
  how: { text: 'are you' },
  test: { text: 123 },
  this: { text: 'is' },
  a: { text: 'a' },
  real: { text: 'real' },
  drag: { text: 'drag and drop' },
  bb: { text: 'bb' },
  cc: { text: 'cc' },
  dd: { text: 'dd' },
  ee: { text: 'ee' },
  ff: { text: 'ff' },
  gg: { text: 'gg' },
  hh: { text: 'hh' },
  ii: { text: 'ii' },
  jj: { text: 'jj' },
  kk: { text: 'kk' }
};
let songData = {};

// let order = Object.keys(data);

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [],
      songOrder: []
    };
    this.updateState = this.updateState.bind(this);
    this.fetch = this.fetch.bind(this);
  }
  componentDidMount() {
    this.fetch();
  }

  handleRemove(id) {
    return songsRef.child(id).remove();
  }
  fetch() {
    songsRef.on('value', snapshot => {
      let data = snapshot.val();
      let songs = data ? Object.values(data) : [];
      let i = 0;
      for (let key in data) {
        songs[i].id = key;
        songs[i].order = i;
        i++;
      }
      let songData = {};
      songs.forEach((song, i) => (songData[i] = song));
      this.setState(
        {
          songs: songData,
          songOrder: Object.keys(songs)
        },
        () => console.log(this.state)
      );
      // songData = songs;
      // console.log(this.state.songs);
    });
  }
  updateState(newOrder) {
    this.setState({
      songs: newOrder
    });
  }

  renderItem(song, order) {
    // console.log(data);
    return (
      <TouchableHighlight
        underlayColor={'#eee'}
        // style={{
        //   width: '100%',
        //   backgroundColor: '#F8F8F8',
        //   borderBottomWidth: 1,
        //   borderColor: '#eee'
        // }}
        // style={styles.songContainer}
        // {...data.sortHandlers}
        onPress={() => console.log(order)}
      >
        <View
          // style={styles.songContainer}
          uri={song.uri}

          // enableEmptySections
        >
          <ListItem
            // style={styles.songContainer}
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
          {/* <Text>{song.title}</Text> */}
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    // songData = this.state.songs;
    // console.log(data[0]);
    return (
      <SortableListView
        style={styles.playlistContainer}
        // style={{ flex: 1 }}
        data={this.state.songs}
        // order={Object.keys(this.state.songs)}
        // data={data}
        order={this.state.songOrder}
        onRowMoved={e => {
          let order = this.state.songOrder;
          order.splice(e.to, 0, order.splice(e.from, 1)[0]); //changes the order when moved
          this.forceUpdate();
          this.setState(
            {
              songOrder: order
            },
            () => console.log(this.state.songs)
          );
        }}
        renderRow={(row, order) => this.renderItem(row, order)} //passes individual item in the list to renderItem
      />
    );
  }
}

const styles = StyleSheet.create({
  playlistContainer: {
    width: 353
  },
  songContainer: {
    // flex: 1,
    // height: 50,
    width: '100%'
    // flexDirection: 'column'
  }
});

export default Playlist;
