import React from 'react';
import { StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { List, ListItem, SearchBar } from 'react-native-elements';
import { SC_KEY, db } from '../config.js';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
// import { FlatList } from 'react-native-gesture-handler';

let addItem = (item, title, artwork) => {
  db.ref('/songs').push({
    uri: item,
    title: title,
    artwork: artwork
  });
};
// let addItem = (item, title, artwork) => {
//   db.ref('/songs').child(title).set()
// }

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      data: [],
      query: '',
      uri: '',
      title: '',
      artwork: ''
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.addSong = this.addSong.bind(this);
    // this.renderItem = this.renderItem.bind(this);
  }
  componentDidMount() {
    this.handleSearch();
  }
  handleSearch() {
    let limit = 20;
    let page = 0;
    let query = this.state.query;
    axios
      .get(
        `https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=${SC_KEY}&limit=${limit}&offset=${page *
          limit}&linked_partitioning=1`
      )
      .then(response =>
        this.setState({
          data: response.data.collection
        })
      )
      .catch(error => console.error(error));
  }
  addSong(uri, title, artwork) {
    this.setState(
      {
        uri: uri,
        title: title,
        artwork: artwork
      },
      () => addItem(this.state.uri, this.state.title, this.state.artwork)
    );
  }
  // renderItem(obj) {
  //   return this.state.data.map((obj, i) => {
  //     return (

  //       <ListItem
  //         key={i}
  //         leftAvatar={{
  //           source: {
  //             uri: obj.artwork_url ? obj.artwork_url : obj.user.avatar_url
  //           }
  //         }}
  //         title={obj.title}
  //         rightElement={
  //           <Icon
  //             containerStyle={{ alignSelf: 'flex-start' }}
  //             type="material"
  //             color="#C8C8C8"
  //             name="md-add"
  //             onPress={() =>
  //               this.addSong(
  //                 obj.uri,
  //                 obj.title,
  //                 obj.artwork_url ? obj.artwork_url : obj.user.avatar_url
  //               )
  //             }
  //           />
  //         }
  //       />

  //     );
  //   });
  // }
  render() {
    return (
      <ScrollView style={styles.searchContainer}>
        <SearchBar
          style={styles.searchBar}
          clearTextOnFocus={false}
          placeholder="search"
          autoCorrect={false}
          onChangeText={text => this.setState({ query: text })}
          value={this.state.query}
          onSubmitEditing={this.handleSearch}
          platform="ios"
          // showLoading={true}
        />
        {this.state.data.map((obj, i) => {
          return (
            <View key={i}>
              <ListItem
                leftAvatar={{
                  source: {
                    uri: obj.artwork_url ? obj.artwork_url : obj.user.avatar_url
                  }
                }}
                title={obj.title}
                rightElement={
                  <Icon
                    containerStyle={{ alignSelf: 'flex-start' }}
                    type="material"
                    color="#C8C8C8"
                    name="md-add"
                    onPress={() =>
                      this.addSong(
                        obj.uri,
                        obj.title,
                        obj.artwork_url ? obj.artwork_url : obj.user.avatar_url
                      )
                    }
                  />
                }
              />
            </View>
          );
        })}
      </ScrollView>
      // <FlatList
      //   style={styles.searchContainer}
      //   data={this.state.data}
      //   renderItem={this.renderItem}
      //   ListHeaderComponent={
      //     <SearchBar
      //       style={styles.searchBar}
      //       clearTextOnFocus={false}
      //       placeholder="search"
      //       autoCorrect={false}
      //       onChangeText={text => this.setState({ query: text })}
      //       value={this.state.query}
      //       onSubmitEditing={this.handleSearch}
      //       platform="ios"
      //       // showLoading={true}
      //     />
      //   }
      // />
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    width: '100%'
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1
  }
});

export default Search;
