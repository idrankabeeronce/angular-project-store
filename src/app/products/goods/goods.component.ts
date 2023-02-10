

import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { AddToCartService } from 'src/app/add-to-cart.service';
import * as data from "src/assets/content/products/products.json"

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
  dataOfItems: any;
  openedOnce = false; // firstly added item to shopping list makes shopping cart pop ups

  displayedContent: any = []; // content that displayed in current frame
  indexOfEnd = 0; // index of last displayed item
  maxLength = 10; // max of displayed content on current frame
  length = 0; // length of pagination
  indexP = 0; // index of current page
  searchValue = ''; // search parameter
  searchValueLabel = '';

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
    window.onresize = () => {
      if (window.innerWidth < 800) {
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
    this.dataOfItems = [];
    this.searchValueLabel = String(this.Route.snapshot.queryParamMap.get("search")?.toLocaleLowerCase());
    // init view changed based on resolution
    if (window.innerWidth < 800) {
      this.changeView = true;
      this.svgView = this.tabsSrc;
    }
    // get title of page by route params
    this.getTitle();
  }

  ngOnDestroy(): void {
    this.dataOfItems = (data as any).default;
    
  }
  // switch between image by selected color
  goToImage(index: number, itemT: any) {
    if (index > itemT.imageSrc.length - 1)
      itemT.indexOfImage = 0;
    else if (index < 0)
      itemT.indexOfImage = itemT.imageSrc.length - 1
    else
      itemT.indexOfImage = index;

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

  searchProduct() {
    let queryParam: any = {};
    let sortParam = this.Route.snapshot.queryParamMap.get("sort")?.toLocaleLowerCase();

    if (this.typeOfCategory != 'null' && this.typeOfCategory != undefined)
      queryParam.type = this.typeOfCategory;
    if (sortParam != 'null' && sortParam != undefined)
      queryParam.sort = sortParam
    if (this.searchValue != '')
      queryParam.search = this.searchValue;

    let path = '';
    if (this.goodQueary == 'products') // if group of products non-selected
      path = this.goodQueary
    else
      path = `${this.Route.parent?.routeConfig?.path}/${this.Route.routeConfig?.path}`;
    this.router.navigateByUrl('/').then(() => {
      this.router.navigate([path], { queryParams: queryParam });
    })
  }
  resetSearch() {
    this.searchValue = '';
    this.searchProduct();
  }
  // sort items by selected type of sort
  clickOnSort(query: string, name: string) {
    let queryParam: any = {}
    let searchParam = this.Route.snapshot.queryParamMap.get("search")?.toLocaleLowerCase();


    if (this.typeOfCategory != 'null' && this.typeOfCategory != undefined)
      queryParam.type = this.typeOfCategory;
    if (query != 'null' && query != undefined)
      queryParam.sort = query
    if (searchParam != 'null' && searchParam != undefined)
      queryParam.search = searchParam;


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
    let searchParam = this.Route.snapshot.queryParamMap.get("search")?.toLocaleLowerCase(); // search param if defined
    // check if group type defined and it's not match to current iteration // false - content++ // else - skip
    let checkMark = false;
    let searchValid = true;
    
    this.dataOfItems = (data as any).default;
    this.content = []; // array of whole content
    for (let group of this.dataOfItems) {
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
            for (var itemC of typeGroup.items) {
              if (searchParam != 'null' && searchParam != undefined) {
                if (!itemC.name.toLocaleLowerCase().includes(searchParam.toLocaleLowerCase()))  // if name of product contains search param
                // if (!arrayOfSearch.some(v => {itemC.name.toLocaleLowerCase().indexOf(v)}))  // - if name of product contains any of word of search param if arraOfSearch = [searchParam.split(" ")]
                {
                  searchValid = false;
                } else {
                  searchValid = true;
                }
              }
              if (searchValid == true) {
                for (let part of this.arrayOfNames) {
                  if (part.includes(itemC.name)) {
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
                  this.arrayOfNames.push([itemC.name, index]); // define new unique item name

                  // define item of content 
                  this.content.push({ name: '', price: 0, discount: 0, description: '', imageSrc: '', ref: itemC.ref });
                  this.content[index].name = itemC.name;
                  this.content[index].price = [itemC.price];
                  this.content[index].actualPrice = [Math.round(itemC.price * (100 - itemC.discount)) / 100];
                  this.content[index].disc = [itemC.discount]; // array of unque discount (if we will get similar name item)
                  this.content[index].prop = [itemC.properties]; // array of unque properties (if we will get similar name item)
                  this.content[index].selectColor = itemC.properties.color; // selected color that user would like to purchase
                  this.content[index].isLength = false; // if length in properties of item


                  this.content[index].description = itemC.description;
                  this.content[index].discount = itemC.discount;
                  this.content[index].imageSrc = [itemC.imageSrc];

                  this.content[index].indexOfImage = 0; // index of image that depends on selected color
                  this.content[index].indexOfSecondProperty = 0; // index of able property that depends on selected color
                  this.content[index].indexOfColor = 0; // index of selected color

                  this.content[index].dateOfRelease = itemC.dateOfRelease;
                  this.content[index].minDiscount = itemC.discount;
                  this.content[index].maxDiscount = itemC.discount;

                  // price without discount 
                  this.content[index].minPrice = itemC.price;
                  this.content[index].maxPrice = itemC.price;

                  let properties: any = [];
                  let indexOfProperty = 0;

                  // define the properties by keys and values
                  let obj = Object.entries(itemC.properties);
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
                  this.content[index].minActualPrice = Math.round(itemC.price * (100 - itemC.discount)) / 100;
                  this.content[index].maxActualPrice = Math.round(itemC.price * (100 - itemC.discount)) / 100;

                  index++
                } else {
                  // if found new item with similar name 
                  // push new properties and price

                  // default value of indexes
                  this.content[indexOfArray].indexOfSecondProperty = 99;
                  this.content[indexOfArray].indexOfColor = 99;
                  // default value of selected color
                  this.content[indexOfArray].selectColor = '';

                  this.content[indexOfArray].price.push(itemC.price);
                  this.content[indexOfArray].actualPrice.push(Math.round(itemC.price * (100 - itemC.discount)) / 100);
                  this.content[indexOfArray].disc.push(itemC.discount);
                  this.content[indexOfArray].prop.push(itemC.properties);

                  // define range of price without discount
                  if (this.content[indexOfArray].minPrice > itemC.price) {
                    this.content[indexOfArray].maxPrice = this.content[indexOfArray].minPrice;
                    this.content[indexOfArray].minPrice = itemC.price;
                  } else {

                    if (this.content[indexOfArray].maxPrice < itemC.price) {
                      this.content[indexOfArray].maxPrice = itemC.price;
                    }
                  }
                  // define range of price with discount
                  if (this.content[indexOfArray].minActualPrice > Math.round(itemC.price * (100 - itemC.discount)) / 100) {
                    this.content[indexOfArray].maxActualPrice = this.content[indexOfArray].minActualPrice;
                    this.content[indexOfArray].minActualPrice = Math.round(itemC.price * (100 - itemC.discount)) / 100;
                  } else {

                    if (this.content[indexOfArray].maxActualPrice < Math.round(itemC.price * (100 - itemC.discount)) / 100) {
                      this.content[indexOfArray].maxActualPrice = Math.round(itemC.price * (100 - itemC.discount)) / 100;
                    }
                  }


                  // add new unique image
                  if (!this.content[indexOfArray].imageSrc.includes(itemC.imageSrc))
                    this.content[indexOfArray].imageSrc.push(itemC.imageSrc);

                  // define range of discount
                  if (this.content[indexOfArray].minDiscount > itemC.discount) {
                    this.content[indexOfArray].maxDiscount = this.content[indexOfArray].minDiscount;
                    this.content[indexOfArray].minDiscount = itemC.discount;
                  } else {
                    if (this.content[indexOfArray].maxDiscount < itemC.discount)
                      this.content[indexOfArray].maxDiscount = itemC.discount;
                  }

                  // define properties that may participate in options to purchase and change cost
                  for (let prop of this.content[indexOfArray].properties) {
                    let key = Object.keys(prop);

                    switch (key[0]) {
                      case 'color':
                        let objC = Object.entries(itemC.properties);
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
                        let objL = Object.entries(itemC.properties);
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
                        let objA = Object.entries(itemC.properties)
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
                        let objW = Object.entries(itemC.properties)
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
  selectColorProperty(color: string, itemS: any, indexOfElement: number) {
    if (itemS.indexOfColor != indexOfElement) {
      itemS.selectColor = color;
      itemS.indexOfColor = indexOfElement;
      itemS.indexOfSecondProperty = 99;
      this.goToImage(itemS.indexOfColor, itemS); // get image of selected color
    } else {
      // reset 
      itemS.indexOfColor = 99;
      itemS.indexOfSecondProperty = 99;
      itemS.selectColor = '';
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
  addToCart(itemS: any) {
    // if second property defined and selected or ( there's no length property and color property selected )  
    if (itemS.indexOfSecondProperty != 99 || !itemS.isLength && itemS.indexOfColor != 99) {

      let itemToSet: any;
      let properties: any;

      if (!itemS.isLength) // define second property select if there's no length property
        itemS.indexOfSecondProperty = itemS.indexOfColor;

      // get properties of selected item
      let objA = Object.entries(itemS.prop)
      objA.forEach(([key, value]: any) => {
        if (key == itemS.indexOfSecondProperty)
          properties = value
      });
      let price = 0;
      let actualPrice = 0;

      // get price with and witound discount 
      if (itemS.isLength) {
        actualPrice = itemS.actualPrice[itemS.indexOfSecondProperty];
        price = itemS.price[itemS.indexOfSecondProperty];
      } else {
        actualPrice = itemS.actualPrice[itemS.indexOfColor];
        price = itemS.price[itemS.indexOfColor];
      }

      // define class that we gonna push to service that provides connection with component of shopping list 
      itemToSet = { name: itemS.name, imageSrc: itemS.imageSrc[itemS.indexOfImage], actualPrice: actualPrice, price: price, properties: properties, amount: 1 }

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
      itemS.indexOfColor = 99;
      itemS.indexOfSecondProperty = 99;
      itemS.selectColor = '';
    }
    // else we getting message that we should select required properties
    else {
      this.alert
        .open(`Select all properties to purchase`, { status: TuiNotification.Warning, })
        .subscribe();
    }

  }

}
