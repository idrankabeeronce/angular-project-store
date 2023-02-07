import { KeyValuePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  styleOfCards = [
    {
      style: 'background-image:linear-gradient( rgba(0,0,0,.5), rgba(0,0,0,.5)), url("assets/images/support/building.jpg")',
      title: 'Something Good',
      desc: 'Description of something good',
      ref: '/'
    },
    {
      style: 'background-image:linear-gradient( rgba(0,0,0,.5), rgba(0,0,0,.5)), url("assets/images/support/contact-us.jpg")',
      title: 'Something Bad',
      desc: 'Description of something bad',
      ref: '/'
    },
    {
      style: 'background-image:linear-gradient( rgba(0,0,0,.5), rgba(0,0,0,.5)), url("assets/images/support/global-network.jpg")',
      title: 'Something else',
      desc: 'Description of something else',
      ref: '/'
    }];
  content: any = []
  bestSellers: any = [];
  listOfNewItems: any = [];
  indexCurrent = 2;
  background = `item-scroll-${this.indexCurrent}`;
  smooth = `transition: all 1.5s ease-out`;
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
    this.listOfNewItems = [];
    for (let group of data) {
      for (let typeGroup of group.goods) {
        for (let item of typeGroup.items) {
          this.content.push({
            name: item.name,
            imageSrc: item.imageSrc,
            price: Math.round((item.price - (item.price * item.discount / 100)) * 100) / 100,
            prop: item.properties,
            rating: item.rating,
            date: item.dateOfRelease,
            tag: item.tag,
            ref: item.ref,
            desc: item.description
          })
        }
      }
    }
    this.content.sort((a: any, b: any) => (a.rating < b.rating ? 1 : -1));
    let index = 0;
    for (let value of this.content) {
      if (index === 10)
        break
      this.bestSellers.push({
        name: value.name,
        imageSrc: value.imageSrc,
        price: value.price,
        rating: value.rating,
        tag: value.tag,
        ref: value.ref
      })
      index++
    }
    this.content.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
    index = 0;
    for (let value of this.content) {
      if (value.tag === "new") {
        
        var i = this.listOfNewItems.findIndex((e: any) => e.ref === value.ref);
        // exclude similar. if -1, then continue
        if (i === -1) {
          if (index === 3)
            break
          this.listOfNewItems.push({
            name: value.name,
            imageSrc: value.imageSrc,
            price: value.price,
            rating: value.rating,
            tag: value.tag,
            prop: value.prop,
            ref: value.ref,
            date: value.date,
            desc: value.desc
          })
          index++
        }
      }
    }

  }
  upperCaseFirstCh(string: any) {
    return string.charAt(0).toLocaleUpperCase() + string.slice(1);  
  }
  onSwipe(swipe: TuiSwipe): void {
    this.scrollItem(swipe.direction);

  }
  scrollItem(direction: string) {

    this.smooth = `transition: all 1s ease-out`;
    if (direction == 'left') {
      if (this.indexCurrent < 6) {
        this.indexCurrent++;
        this.background = `item-scroll-${this.indexCurrent}`;
        if (this.indexCurrent >= 6) {
          setTimeout(() => {
            this.indexCurrent = 2;
            this.smooth = `transition: 0s`;
            this.background = `item-scroll-${this.indexCurrent}`;
          }, 1000)
        }
      }
    } else {
      if (this.indexCurrent > 1) {
        this.indexCurrent--;
        this.background = `item-scroll-${this.indexCurrent}`;
        if (this.indexCurrent <= 1) {
          setTimeout(() => {
            this.indexCurrent = 5;
            this.smooth = `transition: 0s`;
            this.background = `item-scroll-${this.indexCurrent}`;
          }, 1000)
        }
      }
    }
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.autoScroll();
    }, 6500)

  }
  autoScroll() {
    this.indexCurrent++;
    this.smooth = `transition: all 1s ease-out`;
    this.background = `item-scroll-${this.indexCurrent}`;
    if (this.indexCurrent === 6)
      setTimeout(() => {
        this.indexCurrent = 2;
        this.smooth = `transition: 0s`
        this.background = `item-scroll-${this.indexCurrent}`;
      }, 1000);
  }
}
