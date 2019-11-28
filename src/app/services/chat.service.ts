import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Message } from '../models/message';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentChannel$: Observable<String>;
  currentChannel: String;
  messages: Message[];
  private messages$ = new Subject<Message[]>();

  constructor(private http: HttpClient) { }


  getMessages(id) {
    return this.http.get(environment.backend + 'channels/' + id + '/messages');
  }

  public loadMessages(){

    var id = this.currentChannel;
    this.getMessages(id).subscribe((messages) => {
      let messagesMapped : Message[];
      messagesMapped = this.mapMessages(messages);
      this.messages = messagesMapped;
      this.messages$.next(messagesMapped);
    });
  }

  public getMessages$(){
    return this.messages$.asObservable();
  }

  private mapMessages(messages): Message[] {

    var messagesReturn: Message[] = [];

    messages.forEach(msg => {

      let message: Message = new Message();
      message.body = msg.body;
      message.id = msg.sid;
      message.from = msg.from;
      messagesReturn.push(message);

    });

    return messagesReturn;
  }

  onMessageReceived(message : Message){
    console.log('mensajeee' + message);
    this.messages.push(message);
    this.messages$.next(this.messages);
  }

}
