import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import * as dataI from "src/assets/content/products/products.json";
import { AddToCartService } from '../add-to-cart.service';

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
export class ItemComponent implements OnInit, OnDestroy {
  found: boolean = false;
  amount: number = 1;
  sub!: Subscription;
  dataOfItems: any;
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
  similarItems: any = [];
  currentItem: any = {};

  category = '';
  type = '';

  constructor(private titleService: Title, private actRoute: ActivatedRoute, private addToCartService: AddToCartService,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService,
    private router: Router) { }


  ngOnDestroy(): void {
    this.dataOfItems = (dataI as any).default;
  }
  ngOnInit(): void {
    this.titleService.setTitle('404 - Not Found');
    this.dataOfItems = [];
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.found = false
    let ref = '';
    this.dataOfItems = (dataI as any).default;
    if (this.actRoute.snapshot.url.length > 0) {
      ref = this.actRoute.snapshot.url[0].path;

      for (let dataAr of this.dataOfItems) {
        for (let goods of dataAr.goods) {
          for (let item of goods.items) {
            if (item.ref == ref) {
              let prop: struct = item.properties;
              this.category = dataAr.category;
              this.type = goods.type;
              if (!this.found) {
                this.found = true;

                this.titleService.setTitle(item.name);

                this.currentItem.name = item.name;
                this.currentItem.ref = item.ref;
                this.currentItem.rating = item.rating;

                this.currentItem.dateOfRelease = item.dateOfRelease;
                this.currentItem.description = item.description;
                this.currentItem.tag = item.tag;
                this.currentItem.listOfBenefits = item.listOfBenefits;
                
                this.currentItem.indexOfImage = 0;

                this.currentItem.price = [item.price];
                this.currentItem.actualPrice = [Math.round((item.price - (item.price * item.discount / 100)) * 100) / 100];
                this.currentItem.discount = [item.discount];

                this.currentItem.indexOfColor = 0;
                this.currentItem.indexOfSecondProperty = 0;

                this.currentItem.imagesSrc = [];
                this.currentItem.imagesSrc.push(item.imageSrc);

                this.currentItem.color = [];
                this.currentItem.color.push(item.properties.color);

                this.currentItem.secondProperty = [];

                if (prop.length !== undefined) {
                  this.currentItem.secondProperty.push(prop.length);
                  this.currentItem.suffixOfSecProp = "m";
                  this.currentItem.labelSecondProperty = "Length";
                }
                else if (prop.watt !== undefined) {
                  this.currentItem.secondProperty.push(prop.watt);
                  this.currentItem.suffixOfSecProp = "w";
                  this.currentItem.labelSecondProperty = "Watt";
                }
              } else {
                if (!this.currentItem.color.includes(prop.color))
                  this.currentItem.color.push(prop.color);

                if (prop.length !== undefined) {
                  if (!this.currentItem.secondProperty.includes(prop.length))
                    this.currentItem.secondProperty.push(prop.length);
                }
                else if (prop.watt !== undefined) {
                  if (!this.currentItem.secondProperty.includes(prop.watt))
                    this.currentItem.secondProperty.push(prop.watt);
                }
                if (!this.currentItem.imagesSrc.includes(item.imageSrc))
                  this.currentItem.imagesSrc.push(item.imageSrc)

                this.currentItem.discount.push(item.discount);
                this.currentItem.price.push(item.price);
                if (item.discount > 0)
                  this.currentItem.actualPrice.push(Math.round((item.price - (item.price * item.discount / 100)) * 100) / 100);
                else
                  this.currentItem.actualPrice.push(item.price);
              }
            }
          }
        }
      }
      this.findSimilar(this.category, this.type, this.currentItem.ref);
    }
    this.dataOfItems = [];
  }
  findSimilar(category: string, type: string, ref: string) {
    for (let dataAr of this.dataOfItems) {
      if (dataAr.category === category) {
        for (let goods of dataAr.goods) {
          if (goods.type === type) {
            for (let item of goods.items) {
              if (item.ref !== ref) {
                if (this.similarItems.filter((e: any) => e.ref === item.ref).length === 0) {
                  this.similarItems.push({
                    name: item.name,
                    imageSrc: item.imageSrc,
                    ref: item.ref
                  })
                }
              }
            }
          }
        }
      }
    }
  }
  routeTo(parentPath: string, childPath: string, typePath?: string) {
    this.router.navigateByUrl('/').then(() => {
      this.router.navigate([`/${parentPath}/${childPath}`], { queryParams: { type: typePath } });
    })
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

  addToCart() {
    let itemS = this.currentItem;
    // if second property defined and selected or ( there's no length property and color property selected )  
    if (itemS.indexOfSecondProperty != 99 || !itemS.isLength && itemS.indexOfColor != 99) {

      let itemToSet: any;
      let stringOfProperty : string = String(`"color": "${itemS.color[itemS.indexOfColor]}"`)
      if (itemS.secondProperty.length > 0) 
        stringOfProperty = stringOfProperty + `,"${itemS.labelSecondProperty.toLocaleLowerCase()}":${itemS.secondProperty[itemS.indexOfSecondProperty]}`;
      let properties: any = JSON.parse('{' + stringOfProperty + '}');
      
      // define class that we gonna push to service that provides connection with component of shopping list 
      itemToSet = {
        name: itemS.name,
        imageSrc: itemS.imagesSrc[itemS.indexOfImage],
        actualPrice: itemS.actualPrice[itemS.indexOfColor],
        price: itemS.price[itemS.indexOfColor],
        properties: properties,
        amount: this.amount,
        ref: itemS.ref
      }

      this.addToCartService.setItem(itemToSet); // push item to shopping list

      this.addToCartService.setOpenCart(true); // open shopping cart component

    }
    // else we getting message that we should select required properties
    else {
      this.alert
        .open(`Select all properties to purchase`, { status: TuiNotification.Warning, })
        .subscribe();
    }
  }
}
