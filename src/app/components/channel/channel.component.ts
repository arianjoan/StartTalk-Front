import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Channel } from 'src/app/models/channel';
import { ChannelService } from 'src/app/services/channel.service';
import { Client } from 'twilio-chat';



@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  channels : Promise<Channel[]>;
 
  constructor(private serviceChannel : ChannelService) { 

  }

  ngOnInit(){
    this.channels =  this.serviceChannel.getChannels();

  }

  setCurrentChannel(id){
    this.serviceChannel.setCurrentChannel(id);
  }
 
}
