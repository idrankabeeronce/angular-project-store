import { Component, ViewEncapsulation, } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./app.component.css', './app.component.less']
})
export class AppComponent {

  logged = false;

  constructor(private authenticationService: AuthenticationService){
    authenticationService.isLoginSubject.subscribe(x => { this.logged = x })
  }
  
  


  title = 'NEO';
}
