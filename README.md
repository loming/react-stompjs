# react-stompjs
React websocket High Order Component with @stomp/stompjs (V5) over SockJS

# Introduction
I need an updated STOMP client to work with latest version of React Native, but it probably works in Browser as well.

It exposed the global STOMP client to the react components with HOC 

It makes use of the great [@stomp/stompjs](https://github.com/stomp-js/stompjs) for STOMP, check it's [doc](https://stomp-js.github.io/api-docs/latest/) on how to use the Client

# Installation
```$xslt
npm install react-stompjs --save
```

# Example ( React-Native )
```javascript
import React, {Component} from 'react'
import {Platform, StyleSheet, Text, View} from 'react-native'
import {StompEventTypes, withStomp} from 'react-stompjs'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      status: 'Not Connected',
    }
  }

  componentDidMount(): void {
    this.props.stompContext.addStompEventListener(
        StompEventTypes.Connect,
        () => {this.setState({status: 'Connected'})}
    )
    this.props.stompContext.addStompEventListener(
        StompEventTypes.Disconnect,
        () => {this.setState({status: 'Disconnected'})}
    )
    this.props.stompContext.addStompEventListener(
        StompEventTypes.WebSocketClose,
        () => {this.setState({status: 'Disconnected (not graceful)'})}
    )
    this.props.stompContext.newStompClient(
        {your_server_and_path},  // https://www.example.com/stomp
        {user_name},  // loming
        {passcode},  // 12345678
        {host})  // it's '/' most likely
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}}>
        <View><Text>Status: {this.state.status}</Text></View>
      </View>
    );
  }
}

export default withStomp(App)
```

