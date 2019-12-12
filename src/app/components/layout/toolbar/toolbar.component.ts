import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  @Output()
  toggle : EventEmitter<null> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  sidenavToggle(){
    this.toggle.emit(null);
  }

}
