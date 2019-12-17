import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { Message } from 'src/app/models/message';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import * as SockJs from 'sockjs-client';
import * as Stomp from 'stompjs';
import { environment } from 'src/environments/environment.prod';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  private messages: Message[];
  private messageToSend: Message = new Message();
  private messages$: Observable<Message[]>;
  private formMessageGroup: FormGroup;
  private stompClient: Stomp.Client;

  @ViewChild('chat', { static: false })
  chatDivElement: ElementRef;



  constructor(
    private serviceChannel: ChannelService,
    private chatService: ChatService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {

    this.formMessageGroup = this.fb.group({
      'body': [this.messageToSend.body]
    })

    this.chatService.currentChannel$ = this.serviceChannel.getCurrentChannel$();

    this.messages$ = this.chatService.getMessages$();
    this.messages$.subscribe((messages) => this.messages = messages);

    this.chatService.currentChannel$.subscribe(currentChannel => {

      this.chatService.currentChannel = currentChannel;
      this.chatService.loadMessages();
      this.initializeWebSocketConnection();
      
    });

    

  }

  initializeWebSocketConnection() {

    let ws = new SockJs(environment.backend + 'socket');
    let that = this;

    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, function (frame) {

      that.stompClient.subscribe("/chat/" + that.chatService.currentChannel, (message) => {

        if (message.body) {
          let messageReceived: Message = new Message();
          let messageParse = JSON.parse(message.body);

          messageReceived.body = messageParse['body'];
          messageReceived.from = messageParse['from'];
          messageReceived.id = messageParse['sid'];

          that.chatService.onMessageReceived(messageReceived);
          setTimeout(() => {
            that.chatDivElement.nativeElement.scrollTop = that.chatDivElement.nativeElement.scrollHeight;
          },100);          

        }

      })

    })

  }

  sendMessage() {
    this.messageToSend = this.formMessageGroup.value;
    this.messageToSend.from = localStorage.getItem('name');
    this.stompClient.send("/app/messages/" + this.chatService.currentChannel, {}, JSON.stringify(this.messageToSend));
    this.formMessageGroup.get('body').setValue("");
  }

  getName() {
    return localStorage.getItem('name');
  }

}
