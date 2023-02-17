import { Component, OnInit } from '@angular/core';
import data from 'src/assets/content/products/products.json'
interface typeOfItem {
  name: string;
  imageSrc: string;
  ref: string;
  data: string;
  tag: string[];
}

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class Solutions implements OnInit {
  itemsOfTravelSolution: typeOfItem[] = [];
  itemsOfHomeSolution: typeOfItem[] = [];
  itemsOfBusinessSolution: typeOfItem[] = [];

  indexOfHome = 0;
  indexOfTravel = 0;
  indexOfBusiness = 0;

  styleScroll = 'transform: translateX(0)';

  constructor() { }

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    this.itemsOfBusinessSolution = [];
    this.itemsOfHomeSolution = [];
    this.itemsOfTravelSolution = [];
    let content: typeOfItem[] = [];
    for (let group of data) {
      for (let typeGroup of group.goods) {
        for (let item of typeGroup.items) {
          //switch (item.tag) {
          this.contentPush(content, item);

          /*
            this.contentPush(this.itemsOfHomeSolution, item);
            break;
          case ('travel'):
            this.contentPush(this.itemsOfTravelSolution, item);
            break;
          case ('business'):
            this.contentPush(this.itemsOfBusinessSolution, item);
            break;
          default: break;
        }
        */

        }
      }
    }
    content.sort((a: any, b: any) => (a.date < b.date ? 1 : -1));
    for (let value of content) {
      
      if (value.tag.includes('home') && this.itemsOfHomeSolution.length < 5)
        this.contentPush(this.itemsOfHomeSolution, value);
      if (value.tag.includes('travel') && this.itemsOfTravelSolution.length < 5)
        this.contentPush(this.itemsOfTravelSolution, value);
      if (value.tag.includes('business') && this.itemsOfBusinessSolution.length < 5)
        this.contentPush(this.itemsOfBusinessSolution, value);
    }
    
  }

  contentPush(content: typeOfItem[], item: any) {
    content.push({
      name: item.name,
      imageSrc: item.imageSrc,
      ref: item.ref,
      data: item.data,
      tag: item.tag
    })
  }
  scroll(event:any, id: number) {
    document.querySelectorAll('.header-link').forEach((element) => {
      element.classList.remove('active');
      
    })
    this.styleScroll = `transform: translateX(calc(-${id}00% - ${id}rem))`;
    event.target.classList.add('active');
  }
}