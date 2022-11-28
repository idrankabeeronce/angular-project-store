import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AddToCartService } from '../add-to-cart.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  @Output() newItemEvent = new EventEmitter<any>();

  shoppingList: any = []; 
  total: number = 0; // sum price of shopping list 
  sub_1!: Subscription; 
  sub_2!: Subscription;
  open = false; // if true - display shopping cart / else - hide it

  constructor(private addToCartService: AddToCartService, private router: Router) { }

  ngOnInit(): void {

    // getting shopped item
    this.sub_1 = this.addToCartService.getItem().subscribe((value: any) => {
      let keys: any = [];
      let values: any = [];
      let found = false;

      // define if similar properties
      if (Object.keys(value).length > 0) {
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
          if (this.shoppingList.length == 1) {
            if (this.shoppingList.id == undefined)
              this.shoppingList.id = (Math.round(Math.random() * (9999-1000) + 1000));
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
  }

  ngOnDestroy(): void {
    this.sub_1.unsubscribe();
    this.sub_2.unsubscribe();
  }

  // setting value to false that causes close event
  destroy() {
    this.addToCartService.setOpenCart(false)
  }

  // change amount of selected item from list and count price sum
  changeAmount(index: number, bool: boolean) {
    if (bool)
      this.shoppingList[index].amount++
    else
      this.shoppingList[index].amount--
    if (this.shoppingList[index].amount == 0) {
      this.shoppingList.splice(index, 1);
      this.addToCartService.setSizeOfShoppingList(this.shoppingList.length);
    }
    this.getSubtotal();
  }

  // remove selected item from list
  deleteItem(index: number) {
    this.shoppingList.splice(index, 1);
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
      this.total = this.total + item.actualPrice * item.amount;
    }
    this.total = Math.round(this.total * 100) / 100;
  }

  //
  goToCheckout() {
    this.destroy();
    this.addToCartService.setShoppingList(this.shoppingList);
    this.addToCartService.numberOfOrder = this.shoppingList.id;
    this.router.navigate([this.shoppingList.id, 'checkout']);
  }

  //
  goToCart() {

  }

  // close by clicking 'go shopping' button
  goShopping() {
    this.destroy();
  }
}
