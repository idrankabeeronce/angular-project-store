import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddToCartService } from 'src/app/add-to-cart.service';
import { TuiDialogService, TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Subscription } from 'rxjs';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgFor, NgForOf } from '@angular/common';
import { AuthenticationService } from 'src/app/authentication.service';
import { User } from 'src/app/_models/user';
import { TelegramService } from 'src/app/telegram.service';
declare const Email: any;


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit, OnDestroy {

  currentUser!: User;
  sub!: Subscription;
  sub_2!: Subscription;
  sub_3!: Subscription;
  sub_4!: Subscription;
  shippingList: any = [];
  contact: any;
  shipTo: any;
  emailString: string = '';
  shippingMethod: any;
  id: any;
  paymentId: number = 0;
  openDialog = false;
  total = 0;
  try = false;
  array = [{ name: "test-1", price: 1 }, { name: "test-2", price: 1 }, { name: "test-3", price: 1 }]
  form = new FormGroup({
    card: new FormControl(``, [Validators.required, Validators.minLength(16)]),
    expire: new FormControl(``, [Validators.required, Validators.minLength(5)]),
    cvc: new FormControl(``, [Validators.required, Validators.minLength(3)]),
    firstName: new FormControl('', [Validators.required, Validators.minLength(1)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(1)]),
  });

  paymentMethod: any = [{ id: 0, name: 'PayPal' }, { id: 1, name: 'Credit/Debit Card Payment' }]
  srcRedirect = 'https://cdn-icons-png.flaticon.com/512/2800/2800043.png';
  JCBsvg = `<?xml version="1.0" encoding="utf-8"?> <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"> <svg version="1.1" id="Layer_1" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="750px" height="471px" viewBox="0 0 750 471" enable-background="new 0 0 750 471" xml:space="preserve"> <title>Slice 1</title> <desc>Created with Sketch.</desc> <g> <path id="path3494" sketch:type="MSShapeGroup" fill="#FFFFFF" d="M617.242,346.766c0,41.615-33.729,75.36-75.357,75.36H132.759 V124.245c0-41.626,33.73-75.371,75.364-75.371h409.12V346.766L617.242,346.766L617.242,346.766z"/> <linearGradient id="path3496_1_" gradientUnits="userSpaceOnUse" x1="824.7424" y1="333.7813" x2="825.7424" y2="333.7813" gradientTransform="matrix(132.8743 0 0 -323.0226 -109129.5313 108054.6016)"> <stop  offset="0" style="stop-color:#007B40"/> <stop  offset="1" style="stop-color:#55B330"/> </linearGradient> <path id="path3496" sketch:type="MSShapeGroup" fill="url(#path3496_1_)" d="M483.86,242.045c11.686,0.254,23.439-0.516,35.078,0.4 c11.787,2.199,14.627,20.043,4.156,25.887c-7.145,3.85-15.633,1.434-23.379,2.113H483.86V242.045L483.86,242.045z M525.694,209.9 c2.596,9.164-6.238,17.392-15.064,16.13h-26.77c0.188-8.642-0.367-18.022,0.273-26.209c10.723,0.302,21.547-0.616,32.209,0.48 C520.922,201.452,524.756,205.218,525.694,209.9L525.694,209.9z M590.119,73.997c0.498,17.501,0.072,35.927,0.215,53.783 c-0.033,72.596,0.07,145.195-0.057,217.789c-0.469,27.207-24.582,50.847-51.6,51.39c-27.045,0.11-54.094,0.017-81.143,0.047 v-109.75c29.471-0.153,58.957,0.308,88.416-0.231c13.666-0.858,28.635-9.875,29.271-24.914 c1.609-15.103-12.631-25.551-26.152-27.201c-5.197-0.135-5.045-1.515,0-2.117c12.895-2.787,23.021-16.133,19.227-29.499 c-3.234-14.058-18.771-19.499-31.695-19.472c-26.352-0.179-52.709-0.025-79.063-0.077c0.17-20.489-0.355-41,0.283-61.474 c2.088-26.716,26.807-48.748,53.447-48.27C537.555,73.998,563.838,73.998,590.119,73.997L590.119,73.997z"/> <linearGradient id="path3498_1_" gradientUnits="userSpaceOnUse" x1="824.7551" y1="333.7822" x2="825.7484" y2="333.7822" gradientTransform="matrix(133.4307 0 0 -323.0203 -109887.6875 108053.8203)"> <stop  offset="0" style="stop-color:#1D2970"/> <stop  offset="1" style="stop-color:#006DBA"/> </linearGradient> <path id="path3498" sketch:type="MSShapeGroup" fill="url(#path3498_1_)" d="M159.742,125.041 c0.673-27.164,24.888-50.611,51.872-51.008c26.945-0.083,53.894-0.012,80.839-0.036c-0.074,90.885,0.146,181.776-0.111,272.657 c-1.038,26.834-24.989,49.834-51.679,50.309c-26.996,0.098-53.995,0.014-80.992,0.041V283.551 c26.223,6.195,53.722,8.832,80.474,4.723c15.991-2.574,33.487-10.426,38.901-27.016c3.984-14.191,1.741-29.126,2.334-43.691 v-33.825h-46.297c-0.208,22.371,0.426,44.781-0.335,67.125c-1.248,13.734-14.849,22.46-27.802,21.994 c-16.064,0.17-47.897-11.641-47.897-11.641C158.969,219.305,159.515,166.814,159.742,125.041L159.742,125.041z"/> <linearGradient id="path3500_1_" gradientUnits="userSpaceOnUse" x1="824.7424" y1="333.7813" x2="825.741" y2="333.7813" gradientTransform="matrix(132.9583 0 0 -323.0276 -109347.9219 108056.2656)"> <stop  offset="0" style="stop-color:#6E2B2F"/> <stop  offset="1" style="stop-color:#E30138"/> </linearGradient> <path id="path3500" sketch:type="MSShapeGroup" fill="url(#path3500_1_)" d="M309.721,197.39 c-2.437,0.517-0.491-8.301-1.114-11.646c0.166-21.15-0.346-42.323,0.284-63.458c2.082-26.829,26.991-48.916,53.738-48.288h78.767 c-0.074,90.885,0.145,181.775-0.111,272.657c-1.039,26.834-24.992,49.833-51.682,50.309c-26.998,0.101-53.998,0.015-80.997,0.042 V272.707c18.44,15.129,43.5,17.484,66.472,17.525c17.318-0.006,34.535-2.676,51.353-6.67V260.79 c-18.953,9.446-41.234,15.446-62.244,10.019c-14.656-3.649-25.294-17.813-25.057-32.937c-1.698-15.729,7.522-32.335,22.979-37.011 c19.192-6.008,40.108-1.413,58.096,6.398c3.855,2.018,7.766,4.521,6.225-1.921v-17.899c-30.086-7.158-62.104-9.792-92.33-2.005 C325.352,187.902,316.828,191.645,309.721,197.39L309.721,197.39z"/> </g> </svg>`;
  AEsvg = `<?xml version="1.0" encoding="iso-8859-1"?> <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 291.764 291.764" style="enable-background:new 0 0 291.764 291.764;" xml:space="preserve"> <g> <path style="fill:#26A6D1;" d="M18.235,41.025h255.294c10.066,0,18.235,8.169,18.235,18.244v173.235 c0,10.066-8.169,18.235-18.235,18.235H18.235C8.16,250.74,0,242.57,0,232.505V59.269C0,49.194,8.169,41.025,18.235,41.025z"/> <path style="fill:#FFFFFF;" d="M47.047,113.966l-28.812,63.76h34.492l4.276-10.166h9.774l4.276,10.166h37.966v-7.759l3.383,7.759 h19.639l3.383-7.923v7.923h78.959l9.601-9.902l8.99,9.902l40.555,0.082l-28.903-31.784l28.903-32.058h-39.926l-9.346,9.719 l-8.707-9.719h-85.897l-7.376,16.457l-7.549-16.457h-34.42v7.495l-3.829-7.495C76.479,113.966,47.047,113.966,47.047,113.966z M53.721,123.02h16.813l19.111,43.236V123.02h18.418l14.761,31l13.604-31h18.326v45.752h-11.151l-0.091-35.851l-16.257,35.851 h-9.975l-16.348-35.851v35.851h-22.94l-4.349-10.257H50.147l-4.34,10.248H33.516C33.516,168.763,53.721,123.02,53.721,123.02z M164.956,123.02h45.342L224.166,138l14.315-14.98h13.868l-21.071,22.995l21.071,22.73h-14.497l-13.868-15.154l-14.388,15.154 h-44.64L164.956,123.02L164.956,123.02z M61.9,130.761l-7.741,18.272h15.473L61.9,130.761z M176.153,132.493v8.352h24.736v9.309 h-24.736v9.118h27.745l12.892-13.43l-12.345-13.357h-28.292L176.153,132.493z"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg>`;
  radioForm = new FormGroup({
    radioValue: new FormControl(0),

  });
  constructor(
    private authenticationService: AuthenticationService,
    private telegramService: TelegramService,
    private router: Router, private Route: ActivatedRoute, private addToCartService: AddToCartService,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService) { }

  ngOnInit(): void {

    this.authenticationService.currentUser.subscribe(
      {
        next: (x => { this.currentUser = x; }),
        error: (err => {
          console.log(err);
        })
      })
    this.setProfileInfo(this.currentUser);
    this.id = String(this.addToCartService.numberOfOrder);
    this.sub = this.addToCartService.getShippingDetails().subscribe((value) => {
      this.contact = String(`${value.contacts.email} ${value.contacts.phone}`);
      this.emailString = String(value.contacts.email)
      this.shipTo = String(`${value.adress} ${value.postcode}`);
      this.form.controls['firstName'].setValue(value.firstName);
      this.form.controls['lastName'].setValue(value.lastName);
    });
    this.sub_2 = this.addToCartService.getShippingMethod().subscribe((value) => {
      this.shippingMethod = { name: value.name, deliveryTime: value.deliveryTime, price: value.price };
    });
    this.sub_3 = this.addToCartService.getTotalPrice().subscribe((value) => {
      this.total = value;
    })
    this.sub_4 = this.addToCartService.getShoppingList().subscribe((value) => {
      this.shippingList = value;
    })


  }
  setProfileInfo(user: User) {
    this.form.controls['firstName'].setValue(user.firstName);
    this.form.controls['lastName'].setValue(user.lastName);
    this.form.controls['card'].setValue(user.paymentInformation.card);
    this.form.controls['cvc'].setValue(user.paymentInformation.cvc);
    this.form.controls['expire'].setValue(user.paymentInformation.expire);
  }
  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub_2.unsubscribe();
    this.sub_3.unsubscribe();
    this.sub_4.unsubscribe();
  }
  changePayment(payment: any) {
    this.paymentId = payment.id;
  }
  completeOrder() {
    if (this.paymentId == 1) {
      this.openDialog = true;
    } else {
      this.alert
        .open(`Sorry, this method is not working yet`, { status: TuiNotification.Error, })
        .subscribe();
    }
  }
  func() {
    let arrayOfString: any = [];
    for (let item of this.shippingList) {

      arrayOfString.push(String(`<br/> Name: ${item.name}, Price: ${item.actualPrice}, USD Amount: ${item.amount}, Total: ${item.actualPrice * item.amount} USD`))
    }
    return arrayOfString
  }
  handleToSendText(shippingList: any, totalPrice: number, shippingMethod: any, buyer?: any) {
    let result: string = '';
    if (shippingList.id) {
      result += `Order ${shippingList.id}\n\n`;

      if (buyer)
        result += `Buyer: ${buyer.name}`;

      result += `Order list:\n`;
      let i = 1;
      for (let item of this.shippingList) {
        result += `${i}. ${item.name} - x${item.amount}\n`;
        i++;
      }

      result += `\nShipping: ${shippingMethod.name} - ${shippingMethod.price > 0 ? shippingMethod.price + ' USD' : 'Free'}\n\n`;
      
      result += `Total: ${totalPrice} USD`;
    }
    return encodeURI(result);
  }
  proceedPayment() {
    this.try = true;
    console.log(this.shippingList, this.total, this.shippingMethod);
    this.telegramService
      .sendMessage(this.handleToSendText(this.shippingList, this.total, this.shippingMethod))
      .then(res => {
        console.log("Success!", res);
      })
      .catch(err => console.log(err));

    if (this.form.valid) {
      this.openDialog = false;
      this.alert
        .open(`Payment processed successfully`, { status: TuiNotification.Success, })
        .subscribe();
      Email.send({
        Host: `smtp.elasticemail.com`,
        Username: `noreplay@neo.com`,
        Password: `21337713D3A89938DC21181A2393F98D42F0`,
        To: `mrhuk06@gmail.com`, //`${this.emailString}`,
        From: `mrhuk06@gmail.com`,
        Subject: `Order #${this.id}`,
        Body: `<html>
            This is an automatically generated email. 
            <br/> Please do not reply to this email address.
            <br/><br/> Order #${this.id} for the amount of ${this.total} USD is accepted.
            <br/><br/> Order information:
            <div>${this.func()}</div>
            + ${this.shippingMethod.price} USD by shipping
            <br/>
            - ${this.shippingList.discount}% by discount
            <br/>
            <br/><br/> Payment information:
            <br/><br/> Total: ${this.total} USD
            <br/> Ship to: ${this.shipTo}
            <br/> Shipping: ${this.shippingMethod.name} / ${this.shippingMethod.deliveryTime}
            <br/><br/> Our contacts:
            <br/> +1 (111) 1111111
            </html>`,
        IsBodyHtml: true
      })

      this.addToCartService.wipeList();
      this.router.navigate(['/products'])
    }
  }
}