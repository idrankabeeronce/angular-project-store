import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.css']
})
export class DealsComponent implements OnInit {
  parent = false;
  goodQueary: any;
  title: string = '';
  
  constructor(private router: Router, private Route: ActivatedRoute) {
    // define the route path, if it's '/deals' -> parent = true (display all deals)
    router.events.subscribe((val) => {
      if (this.Route.children.length == 0) {
        this.goodQueary = this.Route.routeConfig?.path;
        this.title = String(this.goodQueary).toUpperCase();
        this.title = this.title.replace('-', ' ');
        this.parent = true
      } else {
        this.parent = false; // go to child
      }
  });
  }
  ngOnInit(): void {
  }

}
