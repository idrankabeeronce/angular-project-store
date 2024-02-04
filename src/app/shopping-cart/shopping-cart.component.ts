import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AddToCartService } from '../add-to-cart.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  @Output() newItemEvent = new EventEmitter<any>();

  shoppingList: any = 
  !this.authenticationService.isAuth() 
    && localStorage.getItem('basket_items') 
    && Array.isArray(JSON.parse(localStorage.getItem('basket_items') || '{}'))
      ? JSON.parse(localStorage.getItem('basket_items') || '[]') 
      : [];
  total: number = 0; // sum price of shopping list 
  sub_1!: Subscription;
  sub_2!: Subscription;
  sub_3!: Subscription;
  isInit = false;
  open = false; // if true - display shopping cart / else - hide it

  constructor(private addToCartService: AddToCartService, private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.getSubtotal();
    // getting shopped item
    this.sub_1 = this.addToCartService.getItem().subscribe((value: any) => {

      let keys: any = [];
      let values: any = [];
      let found = false;

      // define if similar properties
      if (Object.keys(value).length > 0) {
        this.isInit = true;
        let index = 0;
        for (let item of this.shoppingList) {

          if (item.name == value.name) {
            if (item.properties == value.properties) {
              found = true;
              break;
            }
          }
          index++;
        }
        // if it's unique 
        if (!found) {
          this.shoppingList.push(value);
          if (this.shoppingList.length) {
            if (this.addToCartService.numberOfOrder)
              this.shoppingList.id = this.addToCartService.numberOfOrder.toString();
            else if (this.shoppingList.id == undefined)
              this.shoppingList.id = (Math.round(Math.random() * (9999 - 1000) + 1000));
              
          }
          // define properties
          let Obj = Object.entries(value);
          Obj.forEach(([key, value]: any) => {
            if (key == 'properties') {
              Object.entries(value).forEach(([key, value]: any) => {
                keys.push(key);                
                if (typeof value === 'string')
                  values.push(value.charAt(0).toUpperCase() + value.slice(1));
                else
                  values.push(value)
              })
            }
          })
          // set displayed parts of properties of added item 
          this.shoppingList[this.shoppingList.length - 1].suffixOfProperty = [];
          this.shoppingList[this.shoppingList.length - 1].keysOfProperty = keys;
          this.shoppingList[this.shoppingList.length - 1].valuesOfProperty = values;
          for (let key of keys) {
            switch (key) {
              case 'length':
                this.shoppingList[this.shoppingList.length - 1].suffixOfProperty.push('m');
                break;
              case 'amperage':
                this.shoppingList[this.shoppingList.length - 1].suffixOfProperty.push('A');
                break;
              case 'watt':
                this.shoppingList[this.shoppingList.length - 1].suffixOfProperty.push('W');
                break;
              default:
                this.shoppingList[this.shoppingList.length - 1].suffixOfProperty.push('');
                break;
            }
          }

          // set the amount of unique items of shopping list
          this.addToCartService.setSizeOfShoppingList(this.shoppingList.length)

        }
        // increase amount
        else {
          this.shoppingList[index].amount++
        }
        this.getSubtotal();
      }
    })

    // open or close shopping cart by getting value that depends on events from another components
    this.sub_2 = this.addToCartService.getOpenCart().subscribe(value => {
      if (value)
        this.open = true;
      else
        this.open = false;

    })
    this.sub_3 = this.addToCartService.getSizeOfShoppingList().subscribe(value => {

      if (value == 0 && this.isInit) {
        this.shoppingList = [];
        this.isInit = false;
      }
    })
  }

  ngOnDestroy(): void {
    this.sub_1.unsubscribe();
    this.sub_2.unsubscribe();
  }
  destroyOnWrapper(e:any) {    
    if(e.target.classList.contains('block-wrapper'))
      this.destroy() 
  }
  // setting value to false that causes close event
  destroy() {
    this.addToCartService.setOpenCart(false)
  }

  // change amount of selected item from list and count price sum
  changeAmount(index: number, bool: boolean) {
    if (bool) {
      this.shoppingList[index].amount++;
    }
    else {
      this.shoppingList[index].amount--;
    }
    
    let tmpArray:Array<any> = localStorage.getItem('basket_items') 
      && Array.isArray(JSON.parse(localStorage.getItem('basket_items') || '{}'))
        ? JSON.parse(localStorage.getItem('basket_items') || '[]') 
        : [];
    let tmpKey = null;
    tmpArray.find((el, key) => {
      if (el.ref === this.shoppingList[index].ref) {
        el.amount += bool? 1 : -1;
        if (el.amount <= 0) {
          tmpKey = key;
        }
      }
    });
    if (tmpKey !== null) tmpArray.splice(tmpKey, 1);
    if (!tmpArray.length) localStorage.removeItem('basket_id');
    localStorage.setItem('basket_items', JSON.stringify(tmpArray));

    if (this.shoppingList[index].amount == 0) {
      this.shoppingList.splice(index, 1);
      if (this.shoppingList.length == 0) {
        this.isInit = false;
      }
      this.addToCartService.setSizeOfShoppingList(this.shoppingList.length);
    }
    this.getSubtotal();
  }

  // remove selected item from list
  deleteItem(index: number) {
    let tmpArray:Array<any> = localStorage.getItem('basket_items') 
      && Array.isArray(JSON.parse(localStorage.getItem('basket_items') || '{}'))
        ? JSON.parse(localStorage.getItem('basket_items') || '[]') 
        : [];
    let tmpKey = null;
    tmpArray.find((el, key) => {
      if (el.ref === this.shoppingList[index].ref) {
        tmpKey = key;
      }
    });
    if (tmpKey !== null) tmpArray.splice(tmpKey, 1);
    if (!tmpArray.length) localStorage.removeItem('basket_id');
    localStorage.setItem('basket_items', JSON.stringify(tmpArray));


    this.shoppingList.splice(index, 1);
    if (this.shoppingList.length == 0) {
      this.isInit = false;
    }
    this.addToCartService.setSizeOfShoppingList(this.shoppingList.length)
    this.getSubtotal();
  }

  getRound(price: number, amount: number) {
    return Math.round(price * amount * 100) / 100
  }

  // count price sum
  getSubtotal() {
    this.total = 0;
    for (let item of this.shoppingList) {
      this.total += item.actualPrice * item.amount;
    }
    this.total = Math.round(this.total * 100) / 100;
  }

  //
  goToCheckout() {
    this.destroy();
    this.addToCartService.setShoppingList(this.shoppingList);
    if (!this.addToCartService.numberOfOrder) this.addToCartService.numberOfOrder = this.shoppingList.id;
    localStorage.setItem('basket_id', this.addToCartService.numberOfOrder.toString());
    this.router.navigate([this.addToCartService.numberOfOrder.toString(), 'checkout']);
  }

  //
  goToCart() {
    this.destroy();
    this.addToCartService.setShoppingList(this.shoppingList);
    if (!this.addToCartService.numberOfOrder) this.addToCartService.numberOfOrder = this.shoppingList.id;
    localStorage.setItem('basket_id', this.addToCartService.numberOfOrder.toString());
    this.router.navigate(['/cart'])
  }

  // close by clicking 'go shopping' button
  goShopping() {
    this.destroy();
  }
}
