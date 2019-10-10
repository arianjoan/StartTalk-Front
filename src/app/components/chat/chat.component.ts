import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/models/message';
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  currentChannel$ : Observable<String>;
  currentChannel : String;
  messages;

  constructor(private serviceChannel : ChannelService) { }

  ngOnInit() {
    this.currentChannel$ = this.serviceChannel.getCurrentChannel$();
    this.currentChannel$.subscribe(currentChannel => {
      this.currentChannel = currentChannel;
      this.loadMessages();
    });
    
  }

  getMessages(id){
    return new Promise((resolve,eject) => {
      var request = new XMLHttpRequest();
      request.open('GET',environment.backend + 'channels/'+id+'/messages');
      request.responseType = 'json';
      request.onload = () => {
        resolve( request.response);
      }
      request.onerror = () => {
        eject(Error('Aqui hubo un error'));
      }
      request.send();
    })
  }

  async loadMessages(){
    var id = this.currentChannel;
    await console.log(id);
    var messages;
    messages = await this.getMessages(id);
    messages = this.mapMessages(messages);
    this.messages = messages;
    console.log(messages);
    }
  
    mapMessages (messages) : Message[]{
  
      var messagesReturn : Message[] = [];
  
     messages.forEach(msg => {
  
        let message : Message = new Message();
        message.body = msg.body;
        message.id = msg.sid;
        messagesReturn.push(message);
  
      });
  
      return messagesReturn;
    }

}
