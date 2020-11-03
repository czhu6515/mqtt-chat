import React, { Component } from 'react'
import { Launcher } from 'react-chat-window'
 
class Chat extends Component {
  constructor() {
    super();
    this.state = {
      messageList: []
    }
  }
 
  _appendIncomingMessage(text) {
    if (text.length > 0) {
      this.setState({
        messageList: [...this.state.messageList, {
          author: 'them',
          type: 'text',
          data: { text }
        }]
      })
    }
  }

  _onMessageWasSent(message) {
    this.setState({
      messageList: [...this.state.messageList, message]
    })

    this.props.publishMessage(message.data.text)
  }
 
  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.message) {
      this._appendIncomingMessage(nextProps.message)
    }
  }

  render() {
    return (<div>
      <Launcher
        agentProfile={{
          teamName: 'Free Chat!',
          imageUrl: 'https://img.icons8.com/doodle/48/000000/chat.png'
        }}
        onMessageWasSent={this._onMessageWasSent.bind(this)}
        messageList={this.state.messageList}

        showEmoji
      />
    </div>)
  }
}

export default Chat