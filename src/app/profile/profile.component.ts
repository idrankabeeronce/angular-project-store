import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../_models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  constructor(private authenticationService: AuthenticationService) {
  }
  open: boolean = false;
  openShipping: boolean = false;
  openPayment: boolean = false;
  currentUser!: User;
  sub!: Subscription;


  ngOnInit(): void {
    this.authenticationService.currentUser.subscribe(
      {
        next: (x => { this.currentUser = x; }),
        error: (err => {
          console.log(err);
        })
      })
    this.sub = this.authenticationService.getProfileOpen().subscribe(x => {
      this.open = x;
    })
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    console.log('profile destroyed')
  }

  changeProfile(data: string) {
    this.showDialog(data === 'shipping' ? true : false)
  }
  showDialog(shipping: boolean): void {
    if (shipping)
      this.openShipping = true;
    else
      this.openPayment = true;
  }

  notEmpty(object: any) {
    if (object && Object.keys(object).length > 0)
      return true;
    else
      return false;
  }
  logOut() {
    this.authenticationService.logout();
    this.hideProfile();
  }
  hideProfile() {
    this.authenticationService.setProfileOpen(false);
  }
  changeItem(data: any) {
    if (data.method === 'shipping') {
      this.openShipping = false;
      this.currentUser.shippingInformation.country = data.country;
      this.currentUser.shippingInformation.adress = data.adress;
      this.currentUser.shippingInformation.subAdress = data.subAdress;
      this.currentUser.shippingInformation.phone = data.phone;
      this.currentUser.shippingInformation.postcode = data.postcode;
    }
    else if (data.method === 'payment') {
      this.openPayment = false;
      this.currentUser.paymentInformation.card = data.card;
      this.currentUser.paymentInformation.paymentSystem = data.paymentSystem;
      this.currentUser.paymentInformation.cvc = data.cvc;
      this.currentUser.paymentInformation.expire = data.expire;
    } else {
      this.openPayment = false;
      this.openShipping = false;
    }
  }
}