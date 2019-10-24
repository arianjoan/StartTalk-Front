import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { HttpClient } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';
import { FormControl } from '@angular/forms';
import { Client } from 'twilio-chat'

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentChannel: String;
  messages: Promise<Message[]>;
  messageToSend;
  tokenParse : string;



  constructor(private serviceChannel: ChannelService, private chatService: ChatService) { }

  ngOnInit() {
    this.messageToSend = new FormControl('');
    this.chatService.currentChannel$ = this.serviceChannel.getCurrentChannel$();

    this.chatService.currentChannel$.subscribe(currentChannel => {
      this.chatService.currentChannel = currentChannel;
      this.messages = this.chatService.loadMessages();
    });

    //this.pruebaMessages();

  }

  sendMessage() {
    console.log(this.messageToSend);
    this.chatService.sendMessage(this.messageToSend.value);
    this.messages = this.chatService.loadMessages();
  }

  viewMessages() {
    console.log(this.messages);
  }

  pruebaMessages() {
    setInterval(() => {
      this.messages = this.chatService.loadMessages();
    }, 5000);
  }

 /*  getToken() {
   this.serviceChannel.getToken().then((token) => {
     this.tokenParse = token;
     console.log(this.tokenParse);
     Client.create(this.tokenParse).then((client) => {
       console.log("hola");
     })
   })
  } */

   getToken(){
    this.serviceChannel.getToken().then((token) => {
      Client.create(token).then((client) => {
        console.log("hola");
      })
    })
  }

}
