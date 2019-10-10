import { Component, Input } from '@angular/core';
import { Channel } from './models/channel';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  channels : Channel[] = [];
  idMessageEvent : String = 'a';

  showMessages(id){
    this.idMessageEvent = id;
  }
  
}
