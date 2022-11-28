import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css']
})
export class VacancyComponent implements OnInit {
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
