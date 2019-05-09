import React from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import Fire from './Fire';

type Props = {
  name?: string,
};

class Chat extends React.Component<Props> {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => ({
    title: 'Chat',
  });

  state = {
    messages: [],
  };

  get user() {
    return {
      name: this.props.name,
      _id: Fire.shared.uid,
    };
  }

  render() {
    return (
        <GiftedChat
          messages={this.state.messages}
          onSend={Fire.shared.send}
          user={this.user}
          renderUsernameOnMessage={true}
        />
    );
  }

  componentDidMount() {
    Fire.shared.on(message =>
      this.setState(previousState => ({
        messages: GiftedChat.append(previousState.messages, message),
      }))
    );
  }
  componentWillUnmount() {
    Fire.shared.off();
  }
}


export default Chat;
