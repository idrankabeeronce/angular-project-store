import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {
  parent = false;
  goodQueary: any;
  title: string = '';
  
  constructor(private router: Router, private Route: ActivatedRoute) {
    // define the route path, if it's '/support' -> parent = true (display all available)
    router.events.subscribe((val) => {
      if (this.Route.children.length == 0) {
        this.goodQueary = this.Route.routeConfig?.path;
        this.title = String(this.goodQueary).toUpperCase();
        this.title = this.title.replaceAll('-', ' ');
        this.parent = true
      } else {
        this.parent = false; // go to child
      }
  });
  }
  ngOnInit(): void {
  }

}
