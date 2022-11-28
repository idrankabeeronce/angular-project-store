import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  parent = false;
  goodQueary: any;
  title: string = '';
  
  constructor(private router: Router, private Route: ActivatedRoute) {
    // define the route path, if it's '/products' -> parent = true (display all products)
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
