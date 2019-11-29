import { Injectable } from '@angular/core';
import { Channel } from '../models/channel';
import { environment } from 'src/environments/environment.prod';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http: HttpClient) { }

  channels: Channel[] = [];
  private currentChannel$ = new Subject<String>();
  private currentChannel: String = "CH35e0a2e365ed4875b0ac5712bd9d671f";


  public getChannels(): Observable<any> {
    return this.http.get(environment.backend + 'channels')
  }

  mapChannels(channelsJson): Channel[] {

    var channelsArrayDTO: Channel[] = [];

    channelsJson.forEach(channel => {

      let channelDTO: Channel = new Channel();
      channelDTO.name = channel.friendlyName;
      channelDTO.id = channel.sid;
      channelsArrayDTO.push(channelDTO);

    });

    return channelsArrayDTO;
  }

  public setCurrentChannel(currentChannel: String) {
    this.currentChannel = currentChannel;
    this.currentChannel$.next(this.currentChannel);
    console.log(this.currentChannel);
  }

  public getCurrentChannel$(): Observable<String> {
    return this.currentChannel$.asObservable();
  }

  public getToken() {
    return this.http.get(environment.backend + 'token', { responseType: 'text' }).toPromise();
  }
}
