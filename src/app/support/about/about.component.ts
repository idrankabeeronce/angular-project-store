import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  goodQueary: any;
  title :string;
  constructor(private router: Router, private Route: ActivatedRoute) { 
    this.goodQueary = Route.routeConfig?.path;
    this.title = String(this.goodQueary).toUpperCase();
    this.title = this.title.replaceAll('-', ' ');
  }
  ngOnInit(): void {
  }

}
