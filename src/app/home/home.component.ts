
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { TuiSwipe } from '@taiga-ui/cdk';
import data from "src/assets/content/products/products.json";
import { AddToCartService } from '../add-to-cart.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  @ViewChild('carousel') carousel!: NgbCarousel;

  scrollActive = false; // true if carousel is active by user
  benefits = [{
    label: "Neo-discount",
    icon: 'assets/images/benefits/benefit-icon_1.png',
    desc: 'Save Money with Discounts on Neo Products',
    ref: '/pages/discount'
  }, {
    label: "Something Program",
    icon: 'assets/images/benefits/benefit-icon_2.png',
    desc: 'Get 15% Commission with the something Program',
    ref: '/pages/something'
  }, {
    label: "Dropshipping",
    icon: 'assets/images/benefits/benefit-icon_3.png',
    desc: 'For large purchases of over 10 items, please contact us for a quote',
    ref: '/pages/dropshipping-program'
  }, {
    label: "Something & Something",
    icon: 'assets/images/benefits/benefit-icon_4.webp',
    desc: 'Earn Something, Get Something w/ Savings',
    ref: '/pages/something'
  }];
  carouselHeader = [{
    imageSrc: 'assets/images/swipe-wrapper/carousel-image_1.jpg',
    title: 'Aesthetic Products For You',
    ref: '/products'
  }, {
    imageSrc: 'assets/images/swipe-wrapper/carousel-image_2.jpg',
    title: 'Join Our Team',
    ref: '/support/vacancies'
  }, {
    imageSrc: 'assets/images/swipe-wrapper/carousel-image_3.jpg',
    title: 'Random Article Of Privacy',
    ref: '/pages/privacy-policy'
  }]
  carouselImages = [{
    imageSrc: 'assets/images/swipe-wrapper/image_3.jpg',
    title: 'Travel Solutions',
    desc: 'Keep your devices connected while you keep on the go. Reliable, effective products are necessities when on the go, and our products are perfect accessories for any excursion.',
    ref: '/deals/solutions'
  }, {
    imageSrc: 'assets/images/swipe-wrapper/image_2.jpeg',
    title: 'Home Solutions',
    desc: "Whether it's being productive, watching videos, or looking up cooking recipes, spend more time relaxed at home with our products.",
    ref: '/deals/solutions'
  }, {
    imageSrc: 'assets/images/swipe-wrapper/image_1.jpg',
    title: 'Business Solitions',
    desc: 'Our Hubs & Adapters help to maintain productivity, inspire creativity, and encourage collaboration. Get even more done in the office; easier than ever.',
    ref: '/deals/solutions'
  }, {
    imageSrc: 'assets/images/swipe-wrapper/image_3.jpg',
    title: 'Travel Solutions',
    desc: 'Keep your devices connected while you keep on the go. Reliable, effective products are necessities when on the go, and our products are perfect accessories for any excursion.',
    ref: '/deals/solutions'
  }, {
    imageSrc: 'assets/images/swipe-wrapper/image_2.jpeg',
    title: 'Home Solutions',
    desc: "Whether it's being productive, watching videos, or looking up cooking recipes, spend more time relaxed at home with our products.",
    ref: '/deals/solutions'
  }, {
    imageSrc: 'assets/images/swipe-wrapper/image_1.jpg',
    title: 'Business Solitions',
    desc: 'Our Hubs & Adapters help to maintain productivity, inspire creativity, and encourage collaboration. Get even more done in the office; easier than ever.',
    ref: '/deals/solutions'
  }, {
    imageSrc: 'assets/images/swipe-wrapper/image_3.jpg',
    title: 'Travel Solutions',
    desc: 'Keep your devices connected while you keep on the go. Reliable, effective products are necessities when on the go, and our products are perfect accessories for any excursion.',
    ref: '/deals/solutions'
  }];
  styleOfCards = [
    {
      style: 'background-image:linear-gradient( rgba(0,0,0,.5), rgba(0,0,0,.5)), url("assets/images/support/building.jpg")',
      title: 'Something',
      desc: 'Description of something',
      ref: '/'
    },
    {
      style: 'background-image:linear-gradient( rgba(0,0,0,.5), rgba(0,0,0,.5)), url("assets/images/support/contact-us.jpg")',
      title: 'Something',
      desc: 'Description of something',
      ref: '/'
    },
    {
      style: 'background-image:linear-gradient( rgba(0,0,0,.5), rgba(0,0,0,.5)), url("assets/images/support/global-network.jpg")',
      title: 'Something',
      desc: 'Description of something',
      ref: '/'
    }];
  content: any = []
  bestSellers: any = [];
  listOfNewItems: any = [];
  indexCurrent = 2;
  background = `item-scroll-${this.indexCurrent}`;
  smooth = `transition: all .6s ease-out`;
  intervalId: any;

  constructor(private addToCardService: AddToCartService) {

  }

  ngOnInit(): void {
    this.intervalId = setInterval(() => {
      this.autoScroll();
    }, 6500)
    this.getData();

  }
  ngAfterViewInit() {
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(navigator.userAgent))
      this.carousel.showNavigationArrows = false;
  }
  posIni: any;
  // swipe carousel on mobile
  move(pos: number) {
    const offset = this.posIni - pos;
    this.carousel.pause();
    if (offset < -100) this.carousel.prev()

    if (offset > 100) this.carousel.next();
    this.carousel.cycle();
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
      if (value.tag.includes('new')) {//value.tag === "new") {

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
            date: value.date
          })
          index++
        }
      }
    }

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
      setTimeout(() => { this.scrollActive = false; }, 600);
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
