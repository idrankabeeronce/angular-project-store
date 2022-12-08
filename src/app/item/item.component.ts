import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import data from "src/assets/content/products/products.json";

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  found: boolean = false;
  constructor(private router: Router, private actRoute: ActivatedRoute) { }

  ngOnInit(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    this.found = false
    let ref = '';
    if (this.actRoute.snapshot.url.length > 0) {
      ref = this.actRoute.snapshot.url[0].path;

      for (let dataAr of data) {
        for (let goods of dataAr.goods) {
          for (let item of goods.items) {
            if (item.ref == ref) { 
              this.found = true;
            }
          }
        }
      }
    }
  }

}
