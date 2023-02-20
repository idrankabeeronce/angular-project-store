import { Component, OnInit } from '@angular/core';
import { AddToCartService } from 'src/app/add-to-cart.service';
import data from 'src/assets/content/products/products.json';

interface typeOfItem {
  name: string;
  imageSrc: string;
  properties: any;
  ref: string;
  data: string;
  price: number;
  discount: number;
  actualPrice?: number;
  tag: string[];
}

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})
export class SaleComponent implements OnInit {

  itemsList: typeOfItem[] = [];
  constructor(private addToCartService: AddToCartService) { }

  ngOnInit(): void {
    this.getData()
  }
  getData() {
    this.itemsList = [];
    let content: typeOfItem[] = [];
    for (let group of data) {
      for (let typeGroup of group.goods) {
        for (let item of typeGroup.items) {
          this.contentPush(content, item);
        }
      }
    }
    content.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
    for (let value of content) {
      if (value.tag.includes('sale')) {
        this.contentPush(this.itemsList, value)
      }

    }
  }
  contentPush(content: typeOfItem[], item: any) {
    content.push({
      name: item.name,
      imageSrc: item.imageSrc,
      properties: item.properties,
      ref: item.ref,
      data: item.data,
      price: item.price,
      discount: item.discount,
      actualPrice: Math.round((item.price - (item.price * item.discount / 100)) * 100) / 100,
      tag: item.tag
    })
  }
  addToCart(item: typeOfItem) {
    let itemToSet = { name: item.name, imageSrc: item.imageSrc, actualPrice: item.actualPrice, price: item.price, properties: item.properties, amount: 1 }

    this.addToCartService.setItem(itemToSet);

    this.addToCartService.setOpenCart(true);

  }
  changeViewOfList() {
    document.querySelector('.sale-wrapper')?.classList.add('no-after', 'expanded');
    document.querySelector('.expand-button-wrapper')?.classList.add('disabled');
  }
}
