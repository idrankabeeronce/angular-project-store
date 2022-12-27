import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddToCartService } from '../add-to-cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  sub_1!: Subscription;
  shoppingList: any = [];
  subtotal: number = 0;
  constructor(private addToCartService: AddToCartService, private router: Router) { }

  ngOnInit(): void {
    this.sub_1 = this.addToCartService.getShoppingList().subscribe((value: any) => {

      this.shoppingList = value ;
    })
    this.shoppingList.id = this.addToCartService.numberOfOrder;
    this.getSubtotal();
  }
  ngOnDestroy():void {
    this.sub_1.unsubscribe();
  }
  upperCase(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1)
  }
  changeAmount(i: number, bool: boolean) {
    if (bool)
      this.shoppingList[i].amount++
    else
      this.shoppingList[i].amount--
    if (this.shoppingList[i].amount == 0) {
      this.shoppingList.splice(i, 1);
      this.addToCartService.setSizeOfShoppingList(this.shoppingList.length);
    }
    this.getTotal(i);
  }
  getTotal(i: number) {
    this.shoppingList[i].total = this.shoppingList[i].amount * this.shoppingList[i].actualPrice;
    this.getSubtotal();
  }
  getRound(value: number) {
    return Math.round(value * 100) / 100
  }
  goShopping() {
    this.router.navigate(['/products']);
  }
  goToCheckout() {
    this.addToCartService.numberOfOrder = this.shoppingList.id;
    this.router.navigate([this.shoppingList.id, 'checkout']);
  }
  getSubtotal() {
    this.subtotal = 0;
    for (let item of this.shoppingList) {
      this.subtotal = this.subtotal + (item.amount * item.actualPrice)
    }
  }
}
