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

let songsRef = db.ref('/songs'); //grab songs from the key songs in db
let querySort = songsRef.orderByChild('order');

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [],
      songOrder: []
    };
    this.updateState = this.updateState.bind(this);
    // this.fetch = this.fetch.bind(this);
    // this.fetchSort = this.fetchSort.bind(this);
  }
  componentDidMount() {
    this.fetch();
  }

  // fetch() {
  //   querySort.on('value', snapshot => {
  //     let data = snapshot.val();
  //     let songs = data ? Object.values(data) : [];
  //     // let i = 0;
  //     let previousOrder = 0;
  //     for (let key in data) {
  //       if (!data[key].hasOwnProperty('order')) {
  //         songs[previousOrder + 1].order = previousOrder + 1;
  //       } else {
  //         songs[data[key].order] = data[key].order;
  //       }
  //       // songs[data[key].order].id = key;
  //       previousOrder = data[key].order;
  //       // i++;
  //     }
  //     let songData = {};
  //     songs.forEach((song, i) => (songData[i] = song));
  //     this.setState(
  //       {
  //         songs: songData,
  //         songOrder: Object.keys(songs)
  //       },
  //       () => console.log(this.state)
  //     );
  //     // songData = songs;
  //     // console.log(this.state.songs);
  //   });
  // }
  // fetchSort() {
  //   querySort.on('value', snapshot => {
  //     let data = snapshot.val();
  //     let songs = data ? Object.values(data) : [];
  //     let songData = {};
  //     let i = 0;
  //     console.log(songs);
  //     for (let key in data) {
  //       songs[i].key = key;
  //       songs[i].order = data[key].order;
  //       i++;
  //     }
  //     songs.forEach((song, i) => (songData[i] = song));
  //     this.setState(
  //       {
  //         songs: songData,
  //         songOrder: Object.keys(songs)
  //       },
  //       () => console.log(this.state)
  //     );
  //   });
  // }

  fetch() {
    let songData = {};
    querySort.on('value', snapshot => {
      let i = 0;
      let songOrder = [];
      snapshot.forEach(childSnapshot => {
        let childKey = childSnapshot.key;
        let data = childKey ? childSnapshot.val() : [];
        // let songs = data ? Object.values(data) : [];
        // data.order = data.order ? data.order : i;
        data.uniqueId = childKey;
        console.log(data);
        songData[i] = data;
        songOrder.push(i);
        i++;
      });
      // songs.forEach((song, i) => (songData[i] = song));
      this.setState(
        {
          songs: songData,
          songOrder: songOrder
        },
        () => console.log(this.state)
      );
    });
  }

  handleRemove(uniqueId) {
    console.log(uniqueId);
    return songsRef.child(uniqueId).remove();
  }

  updateState(order, data) {
    let i = 0;
    for (let key in data) {
      let update = {};
      //compare current order and change the data.order to that number and update the database
      if (data[key].order !== order[i]) {
        data[key].order = order[i];
        update['/order'] = parseInt(order[i]); //change to number so i can get a sorted array on fetch
        songsRef.child(data[key].uniqueId).update(update);
      }
      i++;
    }
    // console.log(songsRef.orderByChild('order'));
    // let songData2 = {};
    // let songOrder2 = [];
    // songsRef.orderByChild('order').on('value', snapshot => {
    //   console.log(snapshot);
    //   snapshot.forEach(function(childSnapshot) {
    //     var childKey = childSnapshot.key;
    //     var childData = childSnapshot.val();
    //     // console.log(childKey);
    //     songData2[childData.order] = childData;
    //     songOrder2.push(childData.order);
    //     // console.log(childData);
    //   });
    //   this.setState({
    //     songs: songData2,
    //     songOrder: songOrder2
    //   });
    // });
    // // return data;
    // this.fetchSort();
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
        onPress={() => console.log(this.state.songOrder)}
      >
        <View
        // style={styles.songContainer}
        // uri={song.uri}

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
                onPress={() => this.handleRemove(song.uniqueId)}
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
            () => {
              return (
                this.updateState(this.state.songOrder, this.state.songs),
                console.log(this.state)
              );
            }
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
