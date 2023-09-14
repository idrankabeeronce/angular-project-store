import { Component, OnInit, Output, Input, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tuiCardNumberValidator } from '@taiga-ui/addon-commerce';
import { tuiCardExpireValidator } from '@taiga-ui/addon-commerce';

@Component({
  selector: 'app-payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.css']
})
export class PaymentFormComponent implements OnInit, OnDestroy {

  @Input() currentUser: any;
  @Output() changeDataEvent = new EventEmitter<any>();

  dialogFormGroup!: FormGroup;
  paymentInformation: any = {};
  valid = true;

  constructor() { }

  ngOnInit(): void {
    this.paymentInformation = this.currentUser !== undefined ? this.currentUser.paymentInformation : {};
    let firstName: string = this.currentUser !== undefined ? this.currentUser.firstName : '';
    let lastName: string = this.currentUser !== undefined ? this.currentUser.lastName : '';

    this.dialogFormGroup = new FormGroup({
      card: new FormControl(this.paymentInformation.card !== undefined ? this.paymentInformation.card : null, [Validators.required, Validators.minLength(16)]),
      //expire: new FormControl(this.paymentInformation.expire !== undefined ? this.paymentInformation.expire : null, [Validators.required, Validators.minLength(5)]),
      expire: new FormControl(this.paymentInformation.expire !== undefined ? this.paymentInformation.expire : null, [Validators.required, Validators.minLength(5)]),
      cvc: new FormControl(this.paymentInformation.cvc !== undefined ? this.paymentInformation.cvc : null, [Validators.required, Validators.minLength(3)]),
      firstName: new FormControl(firstName, [Validators.required, Validators.minLength(1)]),
      lastName: new FormControl(lastName, [Validators.required, Validators.minLength(1)]),
    },[Validators.required, tuiCardExpireValidator]);
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    console.log('payment form destroyed');
  }
  submitChanges(paymentSystem:any) {
    
    if (this.dialogFormGroup.valid) {
      this.valid = true;
      
      this.paymentInformation.card = this.dialogFormGroup.value.card;
      this.paymentInformation.expire = this.dialogFormGroup.value.expire;
      this.paymentInformation.cvc = this.dialogFormGroup.value.cvc;
      let data: any = this.paymentInformation;
      data.close = true;
      data.method = 'payment';
      data.paymentSystem = paymentSystem;
      
      
      this.changeDataEvent.emit(data);
    } else {      
      document.querySelector('#error')?.classList.remove('error-field-shake');
      setTimeout(() => {
        document.querySelector('#error')?.classList.add('error-field-shake');
      },100)
      this.dialogFormGroup.markAllAsTouched();
      this.valid = false;
    }
  }
  close() {
    let data: any = {};
    data.close = true;
    data.method = 'close';    
    this.changeDataEvent.emit(data);
  }
}
