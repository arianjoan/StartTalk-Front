import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/models/message';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { HttpClient } from '@angular/common/http';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentChannel : String;
  messages;

  constructor(private serviceChannel : ChannelService, private chatService : ChatService) { }

  ngOnInit() {
    this.chatService.currentChannel$ = this.serviceChannel.getCurrentChannel$();
    
    this.chatService.currentChannel$.subscribe(currentChannel => {
      this.chatService.currentChannel = currentChannel;
      this.messages = this.chatService.loadMessages();
    });
    
  }

}
