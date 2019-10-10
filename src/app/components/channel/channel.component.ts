import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Channel } from 'src/app/models/channel';
import { ChannelService } from 'src/app/services/channel.service';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {

  channels : Promise<Channel[]>;
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
 
  constructor(private serviceChannel : ChannelService,changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
   }

  ngOnInit(){
    this.channels =  this.serviceChannel.getChannels();
  }

  setCurrentChannel(id){
    this.serviceChannel.setCurrentChannel(id);
  }
 
}
