
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
  scrollActive = false; // true if carousel is active by user
  carouselImages = [{
    imageSrc: 'assets/images/swipe-wrapper/image_3.jpg',
    title: 'Travel Solutions',
    desc: 'Keep your devices connected while you keep on the go. Reliable, effective products are necessities when on the go, and our products are perfect accessories for any excursion.',
    ref: '/'
  },{
    imageSrc: 'assets/images/swipe-wrapper/image_2.jpeg',
    title: 'Home Solutions',
    desc: "Whether it's being productive, watching videos, or looking up cooking recipes, spend more time relaxed at home with our products.",
    ref: '/'
  },{
    imageSrc: 'assets/images/swipe-wrapper/image_1.jpg',
    title: 'Business Solitions',
    desc: 'Our Hubs & Adapters help to maintain productivity, inspire creativity, and encourage collaboration. Get even more done in the office; easier than ever.',
    ref: '/'
  },{
    imageSrc: 'assets/images/swipe-wrapper/image_3.jpg',
    title: 'Travel Solutions',
    desc: 'Keep your devices connected while you keep on the go. Reliable, effective products are necessities when on the go, and our products are perfect accessories for any excursion.',
    ref: '/'
  },{
    imageSrc: 'assets/images/swipe-wrapper/image_2.jpeg',
    title: 'Home Solutions',
    desc: "Whether it's being productive, watching videos, or looking up cooking recipes, spend more time relaxed at home with our products.",
    ref: '/'
  },{
    imageSrc: 'assets/images/swipe-wrapper/image_1.jpg',
    title: 'Business Solitions',
    desc: 'Our Hubs & Adapters help to maintain productivity, inspire creativity, and encourage collaboration. Get even more done in the office; easier than ever.',
    ref: '/'
  },{
    imageSrc: 'assets/images/swipe-wrapper/image_3.jpg',
    title: 'Travel Solutions',
    desc: 'Keep your devices connected while you keep on the go. Reliable, effective products are necessities when on the go, and our products are perfect accessories for any excursion.',
    ref: '/'
  }];
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
  smooth = `transition: all .6s ease-out`;
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
    if (!this.scrollActive) {
    this.smooth = `transition: all .6s ease-out`;
    if (direction == 'left') {
      if (this.indexCurrent < 5) {
        this.indexCurrent++;
        this.background = `item-scroll-${this.indexCurrent}`;
        if (this.indexCurrent >= 5) {
          setTimeout(() => {
            this.indexCurrent = 2;
            this.smooth = `transition: 0s`;
            this.background = `item-scroll-${this.indexCurrent}`;
          }, 600)
        }
      }
    } else {
      if (this.indexCurrent > 1) {
        this.indexCurrent--;
        this.background = `item-scroll-${this.indexCurrent}`;
        if (this.indexCurrent <= 1) {
          setTimeout(() => {
            this.indexCurrent = 4;
            this.smooth = `transition: 0s`;
            this.background = `item-scroll-${this.indexCurrent}`;
          }, 600)
        }
      }
    }
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.autoScroll();
    }, 4500);
    this.scrollActive = true;
    setTimeout(() => {this.scrollActive = false;},600);
    }
    
  }
  autoScroll() {
    this.indexCurrent++;
    this.smooth = `transition: all .6s ease-out`;
    this.background = `item-scroll-${this.indexCurrent}`;
    if (this.indexCurrent === 5)
      setTimeout(() => {
        this.indexCurrent = 2;
        this.smooth = `transition: 0s`
        this.background = `item-scroll-${this.indexCurrent}`;
      }, 600);
  }
}
