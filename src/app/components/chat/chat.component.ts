import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { HttpClient } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { FormControl } from '@angular/forms';
import {Client} from 'twilio-chat';
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  messages;
  messageToSend;
  tokenParse : string;
  stompClient: Stomp.Client;
  messages$ : Observable<Message[]>;



  constructor(private serviceChannel: ChannelService, private chatService: ChatService) { }

  initializeWebSocketConnection(){
    let ws = new SockJs(environment.backend + 'socket');
    let that = this;

    this.stompClient = Stomp.over(ws);
    
    this.stompClient.connect({},function (frame) {

      that.stompClient.subscribe("/chat/" + that.chatService.currentChannel, (message) => {
        
        if (message.body){
          let messageReceived : Message = new Message();
          let messageParse = JSON.parse(message.body);

          messageReceived.body = messageParse['body'];
          messageReceived.from = messageParse['from'];
          messageReceived.id = messageParse['sid'];

          that.chatService.onMessageReceived(messageReceived);
        }

      })

    })

  }


  sendMessage(){
    this.stompClient.send("/app/messages/" + this.chatService.currentChannel, {}, this.messageToSend.value);
  }

  ngOnInit() {

    this.messageToSend = new FormControl('');
    this.chatService.currentChannel$ = this.serviceChannel.getCurrentChannel$();
    this.messages$ = this.chatService.getMessages$();
    this.messages$.subscribe((messages) => this.messages = messages);
    this.chatService.currentChannel$.subscribe(currentChannel => {
      this.chatService.currentChannel = currentChannel;
      this.chatService.loadMessages();
      this.initializeWebSocketConnection();
    });

  }

}
