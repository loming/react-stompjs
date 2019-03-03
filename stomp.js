import React from 'react'

import EventEmitter from 'eventemitter3'
import PropTypes from 'prop-types'

import SockJS from 'sockjs-client'
import {Client} from '@stomp/stompjs'


if (typeof TextEncoder !== 'function') {
    const TextEncodingPolyfill = require('text-encoding')
    TextEncoder = TextEncodingPolyfill.TextEncoder
    TextDecoder = TextEncodingPolyfill.TextDecoder
}


// Stomp client
let stompClient = null

const logger = console // Use any logger you want here
const stompEvent = new EventEmitter()

// WebSocketError is more reliable on detecting the connection lost
const StompEventTypes = {
    Connect: 0,
    Disconnect: 1,
    Error: 2,
    WebSocketError: 3,
}


const newStompClient = (url, login, passcode, host) => {
    logger.log('Stomp trying to connect', url, login, passcode, host)

    // let socket = SockJS(url)
    stompClient = new Client({
        brokerURL: url,
        connectHeaders: {login, passcode, host},
        debug: (str) => {
            // logger.log(str)
        },
        reconnectDelay: 500,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        logRawCommunication: false,
        webSocketFactory: () => {
            return SockJS(url)
            // return new WebSocket('https://bddev.teamnoteapp.com:40007/')
        },
        onStompError: (frame) => {
            logger.log('Stomp Error', frame)
            stompEvent.emit(StompEventTypes.Error, frame)
        },
        onConnect: (frame) => {
            logger.log('Stomp Connect', frame)
            stompEvent.emit(StompEventTypes.Connect, frame)
        },
        onDisconnect: (frame) => {
            logger.log('Stomp Disconnect', frame)
            stompEvent.emit(StompEventTypes.Disconnect, frame)
        },
        onWebSocketError: (frame) => {
            logger.log('Stomp WebSocket Error', frame)
            stompEvent.emit(StompEventTypes.WebSocketError, frame)
        },
    })

    stompClient.activate()

    return stompClient
}

const removeStompClient = () => {
    if(stompClient) {
        logger.log('Stomp trying to disconnect')
        stompClient.deactivate()

        stompClient = null
    }
}

const addEventListener = (eventType, emitted, context, isOnce) => {
    if (isOnce) {
        stompEvent.once(eventType, emitted, context)
    } else {
        stompEvent.on(eventType, emitted, context)
    }
}

const removeEventListener = (eventType, emitted, context) => {
    stompEvent.removeListener(eventType, emitted, context)
}



// React Context and our functions
const stompContextDefault = {
    stompClient, newStompClient, removeStompClient, addEventListener, removeEventListener
}

const StompContext = React.createContext(stompContextDefault)


const withStompContext = (Component) => (
    (props) => {
        const wrapped = (context) => (<Component stompContext={context} {...props} />)

        wrapped.propTypes = {
            stompContext: PropTypes.shape({
                stompClient: PropTypes.instanceOf(Client),
                newStompClient: PropTypes.func,
                removeStompClient: PropTypes.func,
                addEventListener: PropTypes.func,
                removeEventListener: PropTypes.func,
            })
        }

        return (<StompContext.Consumer>{(context) => wrapped(context)}</StompContext.Consumer>)
    }
)

withStompContext.propTypes = {
    Component: PropTypes.element,
}


// Exports
export default StompContext
export {StompEventTypes, stompContextDefault, withStompContext}
