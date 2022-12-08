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
  }
  ngOnInit(): void {
    this.getTitle();
  }
  getTitle() {
    if (this.Route.snapshot.children.length == 0) {
      this.goodQueary = this.Route.routeConfig?.path;
      this.parent = true;
    } else {
    this.goodQueary = this.Route.snapshot.children[0].routeConfig?.path;
    this.parent = false
  }
    this.title = String(this.goodQueary).toUpperCase();
    this.title = this.title.replace('-', ' ');
  }
}
