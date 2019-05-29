import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { db } from '../config.js';
import SortableListView from 'react-native-sortable-listview';

let songsRef = db.ref('/songs');
let querySort = songsRef.orderByChild('order');

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      songs: [],
      songOrder: []
    };
    this.updateState = this.updateState.bind(this);
  }
  componentDidMount() {
    this.fetch();
  }

  fetch() {
    let songData = { 0: [] };
    querySort.on('value', snapshot => {
      let i = 0;
      let songOrder = [];
      snapshot.forEach(childSnapshot => {
        let childKey = childSnapshot.key;
        let data = childKey ? childSnapshot.val() : [];
        data.order = i;
        data.uniqueId = childKey;
        songData[i] = data;
        songOrder.push(i);
        i++;
      });
      this.setState({
        songs: songData,
        songOrder: songOrder
      });
    });
  }

  handleRemove(uniqueId) {
    songsRef.child(uniqueId).remove();
    this.fetch();
  }

  updateState(order, data) {
    let update = {};
    for (let key in data) {
      update[`${data[key].uniqueId}/order`] = order.findIndex(
        element => element === data[key].order
      );
    }
    //utilized firebase multiple update method to avoid the .on method from using its callback param on every change to the database values.
    songsRef.update(update);
  }

  renderItem(song) {
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
        <View>
          <ListItem
            leftAvatar={{
              source: {
                uri: song.artwork
              }
            }}
            title={song.title}
            rightElement={
              <Icon
                size={30}
                containerStyle={{ alignSelf: 'flex-start' }}
                type="material"
                color="#C8C8C8"
                name="md-close"
                onPress={() => this.handleRemove(song.uniqueId)}
              />
            }
          />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    return (
      <SortableListView
        style={styles.playlistContainer}
        data={this.state.songs}
        order={this.state.songOrder}
        onRowMoved={e => {
          let order = this.state.songOrder;
          //changes the order when moved
          order.splice(e.to, 0, order.splice(e.from, 1)[0]);
          this.forceUpdate();
          this.setState(
            {
              songOrder: order
            },
            () => {
              return this.updateState(this.state.songOrder, this.state.songs);
            }
          );
        }}
        //passes individual songs in the list to renderItem
        renderRow={(row, order) => this.renderItem(row, order)}
      />
    );
  }
}

const styles = StyleSheet.create({
  playlistContainer: {
    width: '100%'
  }
  // songContainer: {
  //   // flex: 1,
  //   // height: 50,
  //   width: '100%'
  //   // flexDirection: 'column'
  // }
});

export default Playlist;
