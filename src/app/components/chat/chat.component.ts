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

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  /* messages: Promise<Message[]>; */
  messages;
  messageToSend;
  tokenParse : string;
  stompClient: Stomp.Client;
  messages$ : Observable<Message[]>;



  constructor(private serviceChannel: ChannelService, private chatService: ChatService) { }

  initializeWebSocketConnection(){
    let ws = new SockJs('http://localhost:8080/socket');
    this.stompClient = Stomp.over(ws);
    let that = this;
    this.stompClient.connect({},function (frame) {
      that.stompClient.subscribe("/chat/" + that.chatService.currentChannel, (message) => {
        let messageReceived : Message = new Message();
        if (message.body){
          console.log('mensaje' + message.body);
        }
        messageReceived.body = JSON.parse(message.body)['body'];
        messageReceived.from = JSON.parse(message.body)['from'];
        messageReceived.id = JSON.parse(message.body)['id'];
        
        that.chatService.onMessageReceived(messageReceived);
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
