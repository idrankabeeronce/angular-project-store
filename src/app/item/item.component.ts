import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import data from "src/assets/content/products/products.json";

interface struct {
  color: string;
  amperage?: number;
  watt?: number;
  length?: number;
}

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  found: boolean = false;
  amount: number = 1;
  ratingSrcNull = "tuiIconStarLarge";
  ratingSrcFull = "tuiIconStarFilledLarge";
  ratingSrcHalf = `<svg focusable="false" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg">
  <defs>
      <linearGradient id="grad">
        <stop offset="50%" stop-color="currentColor"/>
        <stop offset="50%" stop-color="transparent"/>
      </linearGradient>
    </defs>
    <g id="tuiIconStarFilledLarge" xmlns="http://www.w3.org/2000/svg"><svg fill="url(#grad)" height="1.5em" overflow="visible" viewBox="0 0 24 24" width="1.5em" x="50%" y="50%"><svg x="-12" xmlns="http://www.w3.org/2000/svg" y="-12"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/></svg></svg></g></svg>`;
  disabled = true;

  constructor(private router: Router, private actRoute: ActivatedRoute) { }
  item: any = {};
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
              let prop: struct = item.properties;

              if (!this.found) {
                this.found = true;
                this.item = item;
                this.item.indexOfImage = 0;

                this.item.price = [item.price];
                this.item.actualPrice = [Math.round((item.price - (item.price * item.discount / 100)) * 100) / 100];
                this.item.discount = [item.discount];

                //this.item.discount.push(item.discount);
                //this.item.price.push(item.price);
                //if (item.discount > 0)
                //  this.item.actualPrice.push(Math.round((item.price - (item.price * item.discount / 100)) * 100) / 100);
                //else
                //  this.item.actualPrice.push(item.price);

                this.item.indexOfColor = 0;
                this.item.indexOfSecondProperty = 0;

                this.item.imagesSrc = [];
                this.item.imagesSrc.push(item.imageSrc);

                this.item.color = [];
                this.item.color.push(item.properties.color);

                this.item.secondProperty = [];
                console.log(this.item);

                if (prop.length !== undefined) {
                  this.item.secondProperty.push(prop.length);
                  this.item.suffixOfSecProp = "m";
                  this.item.labelSecondProperty = "Size";
                }
                else if (prop.watt !== undefined) {
                  this.item.secondProperty.push(prop.watt);
                  this.item.suffixOfSecProp = "w";
                  this.item.labelSecondProperty = "Power";
                }
              } else {
                if (!this.item.color.includes(prop.color))
                  this.item.color.push(prop.color);
                
                if (prop.length !== undefined) {
                  if (!this.item.secondProperty.includes(prop.length))
                    this.item.secondProperty.push(prop.length);
                } 
                else if (prop.watt !== undefined) {
                  if (!this.item.secondProperty.includes(prop.watt))
                    this.item.secondProperty.push(prop.watt);
                }
                if (!this.item.imagesSrc.includes(item.imageSrc))
                  this.item.imagesSrc.push(item.imageSrc)

                this.item.discount.push(item.discount);
                this.item.price.push(item.price);
                if (item.discount > 0)
                  this.item.actualPrice.push(Math.round((item.price - (item.price * item.discount / 100)) * 100) / 100);
                else
                  this.item.actualPrice.push(item.price);
              }
            }
          }
        }
      }
    }
  }
  goToImage(index: number, item: any) {
    if (index > item.imagesSrc.length - 1)
      item.indexOfImage = 0;
    else if (index < 0)
      item.indexOfImage = item.imagesSrc.length - 1
    else
      item.indexOfImage = index;

  }
  selectColorProperty(color: string, item: any, indexOfElement: number) {
    if (item.indexOfColor != indexOfElement) {
      item.selectColor = color;
      item.indexOfColor = indexOfElement;
      this.goToImage(item.indexOfColor, item); // get image of selected color
    }
  }
  selectProperty(item: any, indexSelect: number) {
    if (item.indexOfSecondProperty !== indexSelect)
      item.indexOfSecondProperty = indexSelect;
  }
  changeAmount(state: boolean) {
    if (state) {
      this.amount++
    } else {
      this.amount--
    }
    
    if (this.amount == 1) {
      this.disabled = true;
    } else {
      this.disabled = false;
    }
  }
}
