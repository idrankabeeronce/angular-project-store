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
  shoppingList: any = [];
  sub!: Subscription;
  subPrice!: Subscription;
  shipping!: number;
  subTotal = 0;
  subTotalDiscount = 0;
  total = 0;
  codeField = new FormControl('');
  errorMessage = 'Enter a valid discount code';
  disabled = true;
  codeValid = false;
  try = false;
  codeDiscount = 0;
  constructor(private addToCartService: AddToCartService, private router: Router, private route: ActivatedRoute) {

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
  navigations = [{ caption: 'Cart', routerLink: `/cart`, class: '' }, { caption: 'Information', class: 'focused', routerLink: `/${this.route.snapshot.paramMap.get('id')}/checkout` }, { caption: 'Shipping', class: 'disabled', routerLink: `/${this.route.snapshot.paramMap.get('id')}/checkout/shipping` }, { caption: 'Payment', class: 'disabled', routerLink: `/${this.route.snapshot.paramMap.get('id')}/checkout/payment` }]

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
  onClickChangeFocus(caption: string) {
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
  getRound(value: number) {
    return Math.round(value * 100) / 100;
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
    if (this.codeField.value != '') {
      this.disabled = false;
    }
    else
      this.disabled = true;
  }

  // apply discount code 
  applyDiscount() {
    let sList: any = [];
    this.try = true;
    switch (this.codeField.value) {
      case ('READY'):
        this.codeValid = true;
        this.codeField.disable();
        this.codeDiscount = 5;
        this.addToCartService.getShoppingList().subscribe((value) => {
          sList = value;
        })
        sList.discount = 5;
        this.addToCartService.setShoppingList(sList)
        this.getSubTotalDiscount();
        break;
      case ('STEADY'):
        if (this.subTotal >= 150) {
          this.codeValid = true;
          this.codeField.disable();
          this.codeDiscount = Math.round((20 / this.subTotal) * 100 * 100) / 100;

          console.log(this.codeDiscount)

          this.addToCartService.getShoppingList().subscribe((value) => {
            sList = value;
          })
          sList.discount = this.codeDiscount;
          this.addToCartService.setShoppingList(sList)
          this.getSubTotalDiscount();
        } else {
          console.log(this.errorMessage);          
          this.errorMessage = 'Order must be over $150';
          this.codeValid = false;
        }
        break;
      case ('GOADY'):
        if (this.subTotal >= 200) {
          this.codeValid = true;
          this.codeField.disable();
          this.codeDiscount = Math.round((39 / this.subTotal) * 100 * 100) / 100;

          console.log(this.codeDiscount)

          this.addToCartService.getShoppingList().subscribe((value) => {
            sList = value;
          })
          sList.discount = this.codeDiscount;
          this.addToCartService.setShoppingList(sList)
          this.getSubTotalDiscount();
        } else {
          this.errorMessage = 'Order must be over $200';
          this.codeValid = false;
        }
        break;
      default:

        this.errorMessage = 'Enter a valid discount code';
        this.codeValid = false;
        break;
    }
  }

}
