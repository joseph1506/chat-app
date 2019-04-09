import {Component} from '@angular/core';
import {MessagingService} from './services/messaging.service';
import {Message} from '@stomp/stompjs';
import {StompState} from '@stomp/ng2-stompjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  connecting = false;
  connected = false;
  userName = null;
  private serverUrl = 'ws://localhost:8090/socket';
  messageArea = document.querySelector('#messageArea');
  typedMessage = null;
  private messagingService: MessagingService;

  constructor() {
    this.messagingService = new MessagingService(this.serverUrl);
  }

  joinChat() {
    if (this.userName) {
      this.connecting = true;
      this.messagingService.subscribe('/chat');
      console.log('1111');
      // this.messagingService.connect();
      this.messagingService.stream().subscribe((message: Message) => {
        this.afterMessageReceived(message.body);
      });

      this.messagingService.state().subscribe((state: StompState) => {
        console.log('state', state);
        if (state === 2) {
          this.connecting = false;
          this.connected = true;
          this.messagingService.send('/app/chat/join',{sender: this.userName, type: 'JOIN'});
        }
        if (state === 0) {
          this.connected = false;
        }
      });
    }
  }

  afterMessageReceived(payload) {
    this.messageArea = document.querySelector('#messageArea');
    const message = JSON.parse(payload);
    const messageEl = document.createElement('li');
    let content = null;
    if (message.type === 'JOIN') {
      content = message.sender + ' JOINED!!!';
    } else if (message.type === 'LEAVE') {
      content = message.content;
    } else {
      content = message.sender + ' says:::: ' + message.content;
    }
    if (content) {
      const textEl = document.createElement('p');
      const msgTxt = document.createTextNode(content);
      textEl.appendChild(msgTxt);
      messageEl.appendChild(textEl);
      this.messageArea.appendChild(messageEl);
    }
  }

  leaveChat() {
    this.messagingService.disconnect();
  }

  sendMessage() {
    if (this.typedMessage) {
      this.messagingService.send('/app/chat/message',
        {
          sender: this.userName, type: 'CHAT',
          content: this.typedMessage.trim()
        }
      );
      this.typedMessage = null;
    }
  }
}
