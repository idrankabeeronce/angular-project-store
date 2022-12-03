

import { ChangeDetectionStrategy, Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { AddToCartService } from 'src/app/add-to-cart.service';
import data from "src/assets/content/products/products.json"

interface dataInterface {
  name: string,
  index: number

}

@Component({
  selector: 'app-goods',
  templateUrl: './goods.component.html',
  styleUrls: ['./goods.component.css']
})
export class GoodsComponent implements OnInit, OnDestroy {
  goodQueary: any; // route path - group of products if defined
  title!: string; // title of template
  content: any = []; // fetched content (all)
  
  openedOnce = false; // firstly added item to shopping list makes shopping cart pop ups

  displayedContent: any = []; // content that displayed in current frame
  indexOfEnd = 0; // index of last displayed item
  maxLength = 10; // max of displayed content on current frame
  length = 0; // length of pagination
  indexP = 0; // index of current page

  arrayOfNames: any = []; // array to find similar items (with similar name)
  changeView = false; // boolean that change the view true - grid display \ false - tabs display
  typeOfCategory: string = ''; // path of query - type of products
  sortType: string = ''; // path of query - type of sort
  itemFocus = false; // boolean that change the view from list of items to select item
  changedViewByUser = false; // defines if user change the view // used when the resolution changed
  currentSort = "Featured"; // name of current sort type

  // sort parameters 
  sortParams = [{ id: 0, name: `Alphabetically, A-Z`, query: "title-ascending" }, { id: 1, name: `Alphabetically, Z-A`, query: "title-descending" }, { id: 2, name: `Price, low to high`, query: "price-ascending" }, { id: 3, name: `Price, high to low`, query: "price-descending" }, { id: 4, name: `Date, old to new`, query: "created-ascending" }, { id: 5, name: `Date, new to old`, query: "created-descending" }];
  open = false; // boolean that open or close the hosted dropdown

  // svg's of shopping cart | grid view image | tabs view image
  shopping_card_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="translate(24 0) scale(-1 1)"><path d="M24 3l-.743 2h-1.929l-3.474 12h-13.239l-4.615-11h16.812l-.564 2h-13.24l2.937 7h10.428l3.432-12h4.195zm-15.5 15c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.9-7-1.9 7c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z"/></g></svg>`;
  gridSrc = `<svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M15.42,7.221c0-0.951-0.771-1.721-1.721-1.721H6.729c-0.951,0-1.721,0.771-1.721,1.721v6.103   c0,0.951,0.771,1.721,1.721,1.721h6.971c0.951,0,1.721-0.771,1.721-1.721V7.221z" fill="#515151"/><path d="M27.742,7.221c0-0.951-0.77-1.721-1.721-1.721h-6.971c-0.951,0-1.721,0.771-1.721,1.721v6.103   c0,0.951,0.77,1.721,1.721,1.721h6.971c0.951,0,1.721-0.771,1.721-1.721V7.221z" fill="#515151"/><path d="M15.42,18.676c0-0.951-0.771-1.721-1.721-1.721H6.729c-0.951,0-1.721,0.77-1.721,1.721v6.104   c0,0.95,0.771,1.721,1.721,1.721h6.971c0.951,0,1.721-0.771,1.721-1.721V18.676z" fill="#515151"/><path d="M27.742,18.676c0-0.951-0.77-1.721-1.721-1.721h-6.971c-0.951,0-1.721,0.77-1.721,1.721v6.104   c0,0.95,0.77,1.721,1.721,1.721h6.971c0.951,0,1.721-0.771,1.721-1.721V18.676z" fill="#515151"/></g></svg>`;
  tabsSrc = `<svg enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g><path d="M25.695,9.43c0,0.771-0.631,1.401-1.402,1.401H8.875c-0.771,0-1.402-0.63-1.402-1.401V7.152   c0-0.771,0.631-1.402,1.402-1.402h15.418c0.771,0,1.402,0.631,1.402,1.402V9.43z" fill="#515151"/><path d="M25.695,24.848c0,0.771-0.631,1.402-1.402,1.402H8.875c-0.771,0-1.402-0.631-1.402-1.402V22.57   c0-0.771,0.631-1.401,1.402-1.401h15.418c0.771,0,1.402,0.63,1.402,1.401V24.848z" fill="#515151"/><path d="M25.695,17.139c0,0.771-0.631,1.402-1.402,1.402H8.875c-0.771,0-1.402-0.631-1.402-1.402v-2.277   c0-0.771,0.631-1.402,1.402-1.402h15.418c0.771,0,1.402,0.631,1.402,1.402V17.139z" fill="#515151"/></g></svg>`
  svgView = this.gridSrc; // next view image


  constructor(private addToCartService: AddToCartService, private router: Router, 
    private Route: ActivatedRoute, @Inject(TuiAlertService) protected readonly alert: TuiAlertService) {
    // change view when resolution changed
    window.onresize = (event) => {
      if (window.innerWidth < 600) {
        this.changeView = true;
        this.svgView = this.tabsSrc;
      } else {
        if (!this.changedViewByUser) {
          this.changeView = false;
          this.svgView = this.gridSrc;
        }
      }
    }
  }

  ngOnInit(): void {
    // init view changed based on resolution
    if (window.innerWidth < 600) {
      this.changeView = true;
      this.svgView = this.tabsSrc;
    }
    // get title of page by route params
    this.getTitle();
  }
  ngOnDestroy(): void {
  }

  // switch between image by selected color
  goToImage(index: number, item: any) {
    if (index > item.imageSrc.length - 1)
      item.indexOfImage = 0;
    else if (index < 0)
      item.indexOfImage = item.imageSrc.length - 1
    else
      item.indexOfImage = index;

  }

  // switch between pages
  clickOnPagination(index: number) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    this.goToPage(index);
  }
  goToPage(index: number): void {
    this.indexP = index;
    this.indexOfEnd = index * this.maxLength;

    this.getDisplayedContent(); // displaying items from indexP to indexP+maxLength
  }

  // change max length of displaying items with 
  changeMaxLength() {
    this.length = Math.ceil(this.content.length / this.maxLength);
    if (this.length == 1 && this.indexP != 0)
      this.goToPage(0);
    else { }
    this.goToPage(this.indexP);
  }

  // change view by user
  changeDisplay() {
    if (this.changeView)
      this.svgView = this.gridSrc;
    else
      this.svgView = this.tabsSrc;
    this.changeView = !this.changeView;
    this.changedViewByUser = !this.changedViewByUser;
  }

  // open or close hosted dropdown button
  onClick(): void {
    this.open = !this.open;
  }

  // sort items by selected type of sort
  clickOnSort(query: string, name: string) {
    let queryParam = {}
    if (this.typeOfCategory != 'null')
      queryParam = { type: this.typeOfCategory, sort: query }
    else
      queryParam = { sort: query }

    let path = '';
    this.getSort(query);
    this.currentSort = name;
    if (this.goodQueary == 'products') // if group of products non-selected
      path = this.goodQueary
    else
      path = `${this.Route.parent?.routeConfig?.path}/${this.Route.routeConfig?.path}`; // 
    this.router.navigate([path], { queryParams: queryParam });

  }
  getSort(query: string) {
    let arrayQuery = query.split('-');
    // sorting the whole content, even not displayed
    switch (arrayQuery[0]) {
      case 'title':
        if (arrayQuery[1] == 'ascending')
          this.content.sort((a: any, b: any) => (a.name < b.name ? -1 : 1));
        else
          this.content.sort((a: any, b: any) => (a.name < b.name ? 1 : -1));
        break;
      case 'price':
        if (arrayQuery[1] == 'ascending')
          this.content.sort((a: any, b: any) => (a.minActualPrice < b.minActualPrice ? -1 : 1));
        else
          this.content.sort((a: any, b: any) => (a.minActualPrice < b.minActualPrice ? 1 : -1));
        break;
      case 'created':
        if (arrayQuery[1] == 'ascending')
          this.content.sort((a: any, b: any) => (new Date(a.dateOfRelease).getTime() - new Date(b.dateOfRelease).getTime()));
        else
          this.content.sort((a: any, b: any) => (new Date(b.dateOfRelease).getTime() - new Date(a.dateOfRelease).getTime()));
        break;

    }
    this.goToPage(this.indexP);
    this.open = false;
  }
  changeSortName(sortType: string) {
    let arrayQuery = sortType.split('-');
    switch (arrayQuery[0]) {
      case 'title':
        if (arrayQuery[1] == 'ascending')
          return this.sortParams[0].name;
        else
          return this.sortParams[1].name;
      case 'price':
        if (arrayQuery[1] == 'ascending')
          return this.sortParams[2].name;
        else
          return this.sortParams[3].name;
      case 'created':
        if (arrayQuery[1] == 'ascending')
          return this.sortParams[4].name;
        else
          return this.sortParams[5].name;
      default:
        return 'Featured';
    }
  }
  getTitle() {
    this.goodQueary = this.Route.routeConfig?.path; // define the group of products
    this.title = String(this.goodQueary).toUpperCase();
    this.title = this.title.replaceAll('-', ' ');
    
    // define the type of group
    this.typeOfCategory = String(this.Route.snapshot.queryParamMap.get('type')).toLocaleLowerCase();
    
    this.sortType = String(this.Route.snapshot.queryParamMap.get('sort')).toLocaleLowerCase();
    this.getData(); // get content

    //sort content, if sort of type defined by qeary
    if (this.sortType != 'null') {
      this.currentSort = this.changeSortName(this.sortType);
      this.getSort(this.sortType)
    } else {
      this.getSort('created-descending');
    }
    if (this.typeOfCategory != 'null') 
      this.title = `${String(this.Route.snapshot.queryParamMap.get('type')?.toLocaleUpperCase())} ${this.title}`;

  }
  getData() {
    let index = 0; // index of item of content
    let indexOfArray = 0; // index of array with unique names of items
    let check = false; // check if new item have name that already on the list of unique 

    // check if group type defined and it's not match to current iteration // false - content++ // else - skip
    let checkMark = false;

    this.content = []; // array of whole content
    for (let group of data) {
      if (group.category == this.goodQueary || this.goodQueary == 'products') {
        for (let typeGroup of group.goods) {

          /////////////////////////////////////
          // false - content++ // else - skip//
          /////////////////////////////////////

          if (this.typeOfCategory != 'null') {
            if (this.typeOfCategory != typeGroup.type) {
              checkMark = true;
            } else {
              checkMark = false;
            }
          }
          if (!checkMark) {
            for (let item of typeGroup.items) {

              for (let part of this.arrayOfNames) {
                if (part.includes(item.name)) {
                  // define similar name item
                  check = true;
                  indexOfArray = part[1];
                  break;
                } else {
                  check = false;
                }
              }
              // content ++
              if (!check) {
                this.arrayOfNames.push([item.name, index]); // define new unique item name

                // define item of content 
                this.content.push({ name: '', price: 0, discount: 0, description: '', imageSrc: '', });
                this.content[index].name = item.name;
                this.content[index].price = [item.price];
                this.content[index].actualPrice = [Math.round(item.price * (100 - item.discount)) / 100];
                this.content[index].disc = [item.discount]; // array of unque discount (if we will get similar name item)
                this.content[index].prop = [item.properties]; // array of unque properties (if we will get similar name item)
                this.content[index].selectColor = item.properties.color; // selected color that user would like to purchase
                this.content[index].isLength = false; // if length in properties of item


                this.content[index].description = item.description;
                this.content[index].discount = item.discount;
                this.content[index].imageSrc = [item.imageSrc];

                this.content[index].indexOfImage = 0; // index of image that depends on selected color
                this.content[index].indexOfSecondProperty = 0; // index of able property that depends on selected color
                this.content[index].indexOfColor = 0; // index of selected color

                this.content[index].dateOfRelease = item.dateOfRelease;
                this.content[index].minDiscount = item.discount;
                this.content[index].maxDiscount = item.discount;

                // price without discount 
                this.content[index].minPrice = item.price;
                this.content[index].maxPrice = item.price;

                let properties: any = [];
                let indexOfProperty = 0;

                // define the properties by keys and values
                let obj = Object.entries(item.properties);
                obj.forEach(([key, value]) => {
                  properties[indexOfProperty] = { [key]: [value] };
                  if (key == 'length')
                    // define the length property
                    this.content[index].isLength = true;
                  indexOfProperty++
                });

                // add to item properties
                this.content[index].properties = [];
                this.content[index].properties = properties;

                // price with discount
                this.content[index].minActualPrice = Math.round(item.price * (100 - item.discount)) / 100;
                this.content[index].maxActualPrice = Math.round(item.price * (100 - item.discount)) / 100;

                index++
              } else {
                // if found new item with similar name 
                // push new properties and price

                // default value of indexes
                this.content[indexOfArray].indexOfSecondProperty = 99;
                this.content[indexOfArray].indexOfColor = 99;
                // default value of selected color
                this.content[indexOfArray].selectColor = '';

                this.content[indexOfArray].price.push(item.price);
                this.content[indexOfArray].actualPrice.push(Math.round(item.price * (100 - item.discount)) / 100);
                this.content[indexOfArray].disc.push(item.discount);
                this.content[indexOfArray].prop.push(item.properties);

                // define range of price without discount
                if (this.content[indexOfArray].minPrice > item.price) {
                  this.content[indexOfArray].maxPrice = this.content[indexOfArray].minPrice;
                  this.content[indexOfArray].minPrice = item.price;
                } else {

                  if (this.content[indexOfArray].maxPrice < item.price) {
                    this.content[indexOfArray].maxPrice = item.price;
                  }
                }
                // define range of price with discount
                if (this.content[indexOfArray].minActualPrice > Math.round(item.price * (100 - item.discount)) / 100) {
                  this.content[indexOfArray].maxActualPrice = this.content[indexOfArray].minActualPrice;
                  this.content[indexOfArray].minActualPrice = Math.round(item.price * (100 - item.discount)) / 100;
                } else {

                  if (this.content[indexOfArray].maxActualPrice < Math.round(item.price * (100 - item.discount)) / 100) {
                    this.content[indexOfArray].maxActualPrice = Math.round(item.price * (100 - item.discount)) / 100;
                  }
                }


                // add new unique image
                if (!this.content[indexOfArray].imageSrc.includes(item.imageSrc))
                  this.content[indexOfArray].imageSrc.push(item.imageSrc);

                // define range of discount
                if (this.content[indexOfArray].minDiscount > item.discount) {
                  this.content[indexOfArray].maxDiscount = this.content[indexOfArray].minDiscount;
                  this.content[indexOfArray].minDiscount = item.discount;
                } else {
                  if (this.content[indexOfArray].maxDiscount < item.discount)
                    this.content[indexOfArray].maxDiscount = item.discount;
                }

                // define properties that may participate in options to purchase and change cost
                for (let prop of this.content[indexOfArray].properties) {
                  let key = Object.keys(prop);

                  switch (key[0]) {
                    case 'color':
                      let objC = Object.entries(item.properties);
                      objC.find(([key, value]) => {

                        if (key == 'color') {
                          if (!prop.color.includes(value))
                            prop.color.push(value);
                          return
                        }
                        return
                      });




                      break;
                    case 'length':
                      let objL = Object.entries(item.properties);
                      objL.find(([key, value]) => {

                        if (key == 'length') {
                          if (!prop.length.includes(value))
                            prop.length.push(value);
                          prop.length.sort((a: number, b: number) => (a < b ? -1 : 1));

                          return
                        }
                        return
                      });
                      break;
                    case 'amperage':
                      let objA = Object.entries(item.properties)
                      objA.find(([key, value]) => {

                        if (key == 'amperage') {
                          if (!prop.amperage.includes(value))
                            prop.amperage.push(value);
                          return
                        }
                        return
                      });
                      break;
                    case 'watt':
                      let objW = Object.entries(item.properties)
                      objW.find(([key, value]) => {

                        if (key == 'watt') {
                          if (!prop.watt.includes(value))
                            prop.watt.push(value);
                          return
                        }
                        return
                      });
                      break;
                    default:
                      break;
                  }
                }

              }
            }
          }
        }
        // define the length of pagination that depends on amount of content
        this.length = Math.ceil(this.content.length / this.maxLength);
        this.getDisplayedContent();
      }
    }
  }
  // define displayed items
  getDisplayedContent() {
    this.displayedContent = [];
    for (let [index, item] of this.content.entries()) {
      if (index >= this.indexOfEnd) {
        if (index == this.maxLength + this.indexOfEnd) {
          this.indexOfEnd = index;
          break;
        }
        this.displayedContent.push(item);
      }
    }
  }
  // define selected color of item and mark it
  selectColorProperty(color: string, item: any, indexOfElement: number) {
    if (item.indexOfColor != indexOfElement) {
      item.selectColor = color;
      item.indexOfColor = indexOfElement;
      item.indexOfSecondProperty = 99;
      this.goToImage(item.indexOfColor, item); // get image of selected color
    } else {
      // reset 
      item.indexOfColor = 99;
      item.indexOfSecondProperty = 99;
      item.selectColor = '';
    }
  }
  // mark selected property if defined
  selectProperty(item: any, indexSelect: number) {
    if (item.indexOfSecondProperty == indexSelect)
      item.indexOfSecondProperty = 99;
    else
      item.indexOfSecondProperty = indexSelect;
  }
  // add item to shopping cart
  addToCart(item: any) {
    // if second property defined and selected or ( there's no length property and color property selected )  
    if (item.indexOfSecondProperty != 99 || !item.isLength && item.indexOfColor != 99) {

      let itemToSet: any;
      let properties: any;

      if (!item.isLength) // define second property select if there's no length property
        item.indexOfSecondProperty = item.indexOfColor;

      // get properties of selected item
      let objA = Object.entries(item.prop)
      objA.forEach(([key, value]: any) => {
        if (key == item.indexOfSecondProperty)
          properties = value
      });

      let price = 0;
      let actualPrice = 0;

      // get price with and witound discount 
      if (item.isLength) {
        actualPrice = item.actualPrice[item.indexOfSecondProperty];
        price = item.price[item.indexOfSecondProperty];
      } else {
        actualPrice = item.actualPrice[item.indexOfColor];
        price = item.price[item.indexOfColor];
      }

      // define class that we gonna push to service that provides connection with component of shopping list 
      itemToSet = { name: item.name, imageSrc: item.imageSrc[item.indexOfImage], actualPrice: actualPrice, price: price, properties: properties, amount: 1 }

      this.addToCartService.setItem(itemToSet); // push item to shopping list
      
      //this.addToCartService.setOpenCart(true); // open shopping cart component
      
      if (this.openedOnce)
        this.alert
          .open(`Item added to your cart`, { status: TuiNotification.Success, })
          .subscribe();
      else {
        this.addToCartService.setOpenCart(true);
        this.openedOnce = true;
      }
      
      // reset select
      item.indexOfColor = 99;
      item.indexOfSecondProperty = 99;
      item.selectColor = '';
    }
    // else we getting message that we should select required properties
    else {
      this.alert
        .open(`Select all properties to purchase`, { status: TuiNotification.Warning, })
        .subscribe();
    }

  }

}
