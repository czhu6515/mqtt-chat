import React, { Component } from 'react';
import './App.css';
import mqtt from 'mqtt'
import Chat from './components/Chat'

const HOST = process.env.REACT_APP_HOST
const PORT = process.env.REACT_APP_PORT
const PROTOCOL = process.env.REACT_APP_PROTOCOL
const CLIENT_ID = 'client_' + Math.random().toString(16).substr(2, 8)
const CHAT_TOPIC = 'chat' 

const options = {
  protocol: PROTOCOL,
  port: PORT,
  hostname: HOST,
  clientId: CLIENT_ID
};

const client = mqtt.connect('', options)

class App extends Component {
  constructor(){
    super()
    this.state = {
      message: ''
    }
  }
  
  componentDidMount() {
    client.on('connect', () => {	
      client.subscribe(CHAT_TOPIC + '/+', (err) => {
        if (!err) {
          console.log('subscribed') 
        }
      })
    })

    client.on('message', (topic, message) => {
      this.handleIncomingMessage(topic, message)
    })
  }

  componentWillUnmount() {
    if(client){
      client.end()
    }
  }
  
  handleIncomingMessage = (topic, message) => {
    let clientId = topic.split('/')[1]
    if (clientId !== CLIENT_ID){
      this.setState({message: message.toString()})
    }
  }

  publishMessage = (message) => {
    client.publish(CHAT_TOPIC + '/' + CLIENT_ID, message)
  }

  render() {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1>Chat!</h1>
          <Chat 
            publishMessage={this.publishMessage} 
            message={this.state.message}
          />
        </header>
      </div>
    );
  }
}

export default App;