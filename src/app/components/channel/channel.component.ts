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

  channels : Channel[];
  mouseOver = false;
 
  constructor(private serviceChannel : ChannelService) { 

  }

  ngOnInit(){
    this.serviceChannel.getChannels().subscribe((channels) => {
      this.channels = this.serviceChannel.mapChannels(channels);
    })

  }

  setCurrentChannel(id){
    this.serviceChannel.setCurrentChannel(id);
  }
 
}
