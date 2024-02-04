import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddToCartService } from 'src/app/add-to-cart.service';
import {Subscription} from 'rxjs'
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-shipping',
  templateUrl: './shipping.component.html',
  styleUrls: ['./shipping.component.css']
})
export class ShippingComponent implements OnInit, OnDestroy {
  

  sub!: Subscription;
  sub_2!: Subscription;
  id:string = '';
  contact:string ='';
  shipTo:string ='';
  total = 0;
  selectedShippingId = 0;
  shippingMethod: any = [{id: 0, name: 'Standart international', price: 0, deliveryTime: '6 to 12 business days'},{id: 1, name: 'Business international', price: 20, deliveryTime: '2 to 6 business days'}]
  constructor(private router: Router, private Route: ActivatedRoute, private addToCartService: AddToCartService) { }

  radioForm = new FormGroup({
    radioValue: new FormControl(this.selectedShippingId),
  });

  ngOnInit(): void {
    this.id = String(this.addToCartService.numberOfOrder);
    this.sub = this.addToCartService.getShippingDetails().subscribe((value) => {
      if (!value.contacts) this.router.navigate(['/' + this.id + '/checkout']);
      this.contact = String(`${value.contacts?.email} ${value.contacts?.phone}`);
      this.shipTo = String(`${value.adress} ${value.postcode}`)
    })
    this.sub_2 = this.addToCartService.getTotalPrice().subscribe((value) => {
      this.total = value;
    })
    this.addToCartService.getShippingMethod().subscribe((value) => {      
      this.selectedShippingId = value.id ?? 0
    })
    this.radioForm.setValue({radioValue: this.selectedShippingId})
    this.changeMethod(Object.values(this.shippingMethod).find((r:any) => r.id === this.selectedShippingId));
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub_2.unsubscribe();
  }
  changeMethod(method: any) {    
    this.addToCartService.setShippingMethod({id: method.id, name: method.name, price: method.price, deliveryTime: method.deliveryTime })
    let newTotal = Math.round((this.total + method.price) * 100) / 100;
    this.sub_2.unsubscribe();
    this.addToCartService.setTotalPrice(newTotal);
  }
  goToPayment() {
    this.router.navigate([`/${this.id}/checkout/payment`])
  }
}
