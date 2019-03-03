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

# Usage
Import 
```javascript
import {StompEventTypes, withStomp} from 'react-stompjs'
```

Connect your component withStomp(), it'll add stompContext into your component properties
```javascript
withStomp(App)
````
Now you can listen / remove the Stomp Events, ( check [EventEmitter3](https://github.com/primus/eventemitter3) for emitted, context )
```javascript
const StompEventTypes = {
    Connect: 0,
    Disconnect: 1,
    Error: 2,
    WebSocketClose: 3,
    WebSocketError: 4,
}

this.props.addStompEventListener(eventType: StompEventTypes, emitted: function, context, isOnce)
this.props.removeStompEventListener(eventType: StompEventTypes, emitted: function, context)
```
And create/destroy the client
```javascript
this.props.newStompClient(server_path, username, passcode, host)
this.props.removeStompClient()
```
You could access the [Client](https://stomp-js.github.io/api-docs/latest/classes/Client.html) directly ( Subscribe and unsubscribe etc )
```javascript
let rootSubscribed = this.props.stompClient.subscribe('/', (message) => {console.log(message.body)})
rootSubscribed.unsubscribe()
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
        {username},  // loming
        {passcode},  // 12345678
        {host})  // it's '/' most likely
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ffffff'}}>
        <View><Text>Status: {this.state.status}</Text></View>
      </View>
    )
  }
}

export default withStomp(App)
```

