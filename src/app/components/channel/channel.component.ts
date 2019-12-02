import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef, OnDestroy } from '@angular/core';
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
  mouseOver : Boolean[];
 
  constructor(private serviceChannel : ChannelService) { 

  }

  ngOnInit(){
    this.serviceChannel.getChannels().subscribe((channels) => {
      this.channels = this.serviceChannel.mapChannels(channels);
      this.mouseOver = new Array(this.channels.length).fill(false);
    })

  }

  //Luego se reemplazará por el login

  setCurrentChannel(channel : Channel){
    if (localStorage.getItem('name')){

      if (localStorage.getItem('name') != 'null'){
        this.serviceChannel.setCurrentChannel(channel);
      }else{
        localStorage.removeItem('name');
      }
    }else{
      localStorage.setItem('name',window.prompt('Ingrese su nombre','system'));
      this.setCurrentChannel(channel);
    }
    
  }

  getCurrentChannel(){
    return this.serviceChannel.getCurrentChannel();
  }
 
}
