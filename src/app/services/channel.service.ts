import { Injectable } from '@angular/core';
import { Channel } from '../models/channel';
import { environment } from 'src/environments/environment.prod';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ChannelService {

  constructor(private http : HttpClient) { }

  channels: Channel[] = [];
  private currentChannel$  = new Subject<String>();
  private currentChannel  : String = "CH35e0a2e365ed4875b0ac5712bd9d671f";

  public getChannels(): Promise<Channel[]> {
    return new Promise((resolve, reject) => {
      this.http.get(environment.backend + 'channels').toPromise()
      .then((response) => {
      return resolve(this.mapChannels(response));
      });
    })
  }

  private mapChannels(channels): Channel[] {

    var channelsReturn: Channel[] = [];

    channels.forEach(ch => {

      let channel: Channel = new Channel();
      channel.name = ch.friendlyName;
      channel.id = ch.sid;
      channelsReturn.push(channel);

    });

    return channelsReturn;
  }

  public setCurrentChannel(currentChannel : String){
    this.currentChannel = currentChannel;
    this.currentChannel$.next(this.currentChannel);
  }

  public getCurrentChannel$() : Observable<String>{
    return this.currentChannel$.asObservable();
  }

  public getToken(){
    return this.http.get(environment.backend + 'token',{responseType : 'text'}).toPromise();
  }
}
