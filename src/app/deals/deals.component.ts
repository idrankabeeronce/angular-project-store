import { ViewportScroller } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
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
  constructor(private scroller: ViewportScroller, private router: Router, private Route: ActivatedRoute) {
  }
  ngOnInit(): void {
    
    this.getTitle();
  }
  ngAfterViewInit() {
    setTimeout(() => {this.scroller.scrollToAnchor(String(this.Route.snapshot.children[0]?.routeConfig?.path));}, 1000);
  }
  getTitle() {
    this.goodQueary = this.Route.routeConfig?.path;
    this.parent = true;
    this.title = String(this.goodQueary).toUpperCase();
    this.title = this.title.replace('-', ' ');
  }
}
