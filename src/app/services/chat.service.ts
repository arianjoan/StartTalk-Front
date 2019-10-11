import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Message } from '../models/message';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ChatService {

  currentChannel$: Observable<String>;
  currentChannel: String;
  messages: any;

  constructor(private http: HttpClient) { }

  getMessages(id) {
    return new Promise((resolve, eject) => {

      this.http.get(environment.backend + 'channels/' + id + '/messages').toPromise().then((messagesPromise) => {
        resolve(messagesPromise);
      });

    })
  }

  public async loadMessages() {
    var id = this.currentChannel;
    var messages;
    messages = await this.getMessages(id);
    messages = this.mapMessages(messages);
    return messages;
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
}
