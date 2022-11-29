import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AddToCartService } from 'src/app/add-to-cart.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  shoppingList:any = [];
  sub!: Subscription;
  subPrice!: Subscription;

  shipping!: number;
  subTotal = 0;
  subTotalDiscount = 0;
  total = 0;
  codeField = new FormControl('');
  disabled = true;
  codeValid = false;
  try = false;
  codeDiscount = 0;
  constructor(private addToCartService:AddToCartService, private router: Router,private route: ActivatedRoute) { 
    
    router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        if (router.url.match('/checkout')) {
          if (router.url.match('/shipping')) {
            this.navigations[2].class = '';
            this.onClickChangeFocus('Shipping');
          }
          if (router.url.match('/payment')) {
            this.navigations[3].class = '';
            this.onClickChangeFocus('Payment');
          }
        }
      }
    })
    
  }
  navigations = [{caption: 'Cart', routerLink: `/${this.route.snapshot.paramMap.get('id')}/checkout`, class: ''},{caption: 'Information', class: 'focused', routerLink: `/${this.route.snapshot.paramMap.get('id')}/checkout`},{caption: 'Shipping', class: 'disabled', routerLink: `/${this.route.snapshot.paramMap.get('id')}/checkout/shipping`},{caption: 'Payment', class: 'disabled', routerLink: `/${this.route.snapshot.paramMap.get('id')}/checkout/payment`}]
  
  ngOnInit(): void {
    this.sub = this.addToCartService.getShoppingList().subscribe((value) => {
      this.shoppingList = value;
      this.getSubTotal();
    })
    this.subPrice = this.addToCartService.getShippingMethod().subscribe((value) => {
      this.shipping = value.price;
      this.getSubTotal();
    })
  }
  ngOnDestroy(): void {
    
  }
  //
  onClickChangeFocus(caption:string) {
    for (let nav of this.navigations) {
      if (nav.caption == caption) {
        nav.class = 'focused'
      } else {
        if (nav.class != 'disabled') 
          nav.class = '';
      }
    }
  }

  // get sum of shopping list
  getSubTotal() {
    this.subTotal = 0;
    for (let item of this.shoppingList) {
      this.subTotal = this.subTotal + item.actualPrice * item.amount;
    }
    this.subTotal = Math.round(this.subTotal * 100) / 100;
    this.getTotal();
  }

  //  get sum of shopping list with discount
  getSubTotalDiscount() {
    this.subTotalDiscount = Math.round((this.subTotal - this.subTotal * this.codeDiscount / 100) * 100) / 100;
    this.getTotal();
  }

  // get total sum of shopping items, shipping and discount
  getTotal() {
    let shippingPrice = 0;
    if (this.shipping != null) 
      shippingPrice = this.shipping

    if (this.codeDiscount == 0)
      this.total = this.subTotal + shippingPrice 
    else 
      this.total = this.subTotalDiscount + shippingPrice

    this.total = Math.round(this.total * 100) / 100;
    this.addToCartService.setTotalPrice(this.total);
  }
  // change button displaying
  changeInput() {
    if (this.codeField.value != ''){
      this.disabled = false;
    }
    else 
      this.disabled = true;
  }

  // apply discount code 
  applyDiscount() {
    let sList:any = [];
    this.try = true;
    if (this.codeField.value == "READY") {
      this.codeValid = true;
      this.codeField.disable();
      this.codeDiscount = 20;
      this.addToCartService.getShoppingList().subscribe((value) => {
        sList = value;
      })
      sList.discount = 20;
      this.addToCartService.setShoppingList(sList)
      this.getSubTotalDiscount();
    } else {
      this.codeValid = false;
    }
  }

}
