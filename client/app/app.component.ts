import { Component, OnInit } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({  
  selector: 'app',
  directives: [ ROUTER_DIRECTIVES ], 
  template: '<div>WOW</div>'
})

export class AppComponent implements OnInit {
  ngOnInit() {
      console.log('App loaded!!');
  }
}