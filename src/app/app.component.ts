import { Component, Input, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Channel } from './models/channel';
import { ChannelComponent } from './components/channel/channel.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

}

