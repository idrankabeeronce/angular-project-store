import { Component, OnInit} from '@angular/core';
import { TuiSwipe } from '@taiga-ui/cdk';
import data from "src/assets/content/products/products.json";

type itemType = {
  name?: string;
  price?: number;
  rating?: number;
  imageSrc?: string;
  tag?: string;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  
  arrayOfObject: itemType = {};
  
  content: any = []
  bestSellers: any = [];
  indexCurrent = 0;
  background = `image-${this.indexCurrent}`;
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
  intervalId: any;

  constructor() {

  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.autoScroll();
    }, 6500)
    this.getData();

  }

  getData() {
    this.bestSellers = []; // array of whole content
    for (let group of data) {
      for (let typeGroup of group.goods) {
        for (let item of typeGroup.items) {
          this.arrayOfObject = item;
          this.content.push({ name: item.name, imageSrc: item.imageSrc, price: Math.round((item.price - (item.price * item.discount / 100)) * 100) / 100, rating: item.rating, tag: this.arrayOfObject.tag})
        }
      }
    }
    this.content.sort((a: any, b: any) => (a.rating < b.rating ? 1 : -1));
    let index = 0;
    for (let value of this.content) {
      if (index == 10)
        break
      this.bestSellers.push({ name: value.name, imageSrc: value.imageSrc, price: value.price, rating: value.rating, tag: value.tag })
      index++
    }
  }

  onSwipe(swipe: TuiSwipe): void {
    this.scrollItem(swipe.direction);

  }
  scrollItem(direction: string) {
    if (direction == 'left') {
      if (this.indexCurrent < 3) {
        this.indexCurrent++
      }
      else
        this.indexCurrent = 0
    } else {
      if (this.indexCurrent > 0) {
        this.indexCurrent--
      } else
        this.indexCurrent = 3;
    }
    this.background = `item-scroll-${this.indexCurrent}`;
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.autoScroll();
    }, 6500)

  }
  autoScroll() {
    if (this.indexCurrent < 3) {
      this.indexCurrent++;
    }
    else {
      this.indexCurrent = 0;
    }
    this.background = `item-scroll-${this.indexCurrent}`;
  }
}
