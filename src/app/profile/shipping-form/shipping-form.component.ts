import { Component, OnInit, Output, Input, EventEmitter, OnDestroy, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TuiCountryIsoCode } from '@taiga-ui/i18n';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit, OnDestroy {




  @Input() currentUser: any;
  @Output() changeDataEvent = new EventEmitter<any>();

  shippingInformation: any = {};
  dialogFormGroup!: FormGroup;
  countryCode = TuiCountryIsoCode.US;
  
  readonly countriesI: readonly TuiCountryIsoCode[] = [
    TuiCountryIsoCode.US,
    TuiCountryIsoCode.CA,
    TuiCountryIsoCode.AM
  ];
  countries = [{ name: 'United States', phoneCode: TuiCountryIsoCode.US }, { name: 'Canada', phoneCode: TuiCountryIsoCode.CA }, { name: 'Armenia', phoneCode: TuiCountryIsoCode.AM }];
  allowedCountries: any = [];
  valid = true;

  constructor() { }

  ngOnInit(): void {
    this.shippingInformation = this.currentUser !== undefined ? this.currentUser.shippingInformation : {};

    let firstName: string = this.currentUser !== undefined ? this.currentUser.firstName : '';
    let lastName: string = this.currentUser !== undefined ? this.currentUser.lastName : '';


    for (let country of this.countries) {
      this.allowedCountries.push(country.name);
    }
    this.dialogFormGroup = new FormGroup({
      countryValue: new FormControl(this.shippingInformation.country !== undefined ? this.shippingInformation.country : null),
      firstName: new FormControl(firstName, [Validators.required, Validators.minLength(1)]),
      lastName: new FormControl(lastName, [Validators.required, Validators.minLength(1)]),
      adress: new FormControl(this.shippingInformation.adress !== undefined ? this.shippingInformation.adress : null, [Validators.required, Validators.minLength(1)]),
      subAdress: new FormControl(this.shippingInformation.subAdress !== undefined ? this.shippingInformation.subAdress : null),
      phone: new FormControl({ value: this.shippingInformation.phone !== undefined ? this.shippingInformation.phone : null, disabled: this.shippingInformation.phone !== undefined ? false : true }, [Validators.required, Validators.minLength(12)]),
      postcode: new FormControl(this.shippingInformation.postcode !== undefined ? this.shippingInformation.postcode : null, [Validators.required, Validators.minLength(1)])
    });
  }

  @HostListener('unloaded')
  ngOnDestroy(): void {
    console.log('shipping form destroyed')
  }
  submitChanges() {
    if (this.dialogFormGroup.valid) {
      this.valid = true;
      this.shippingInformation.country = this.dialogFormGroup.value.countryValue;
      this.shippingInformation.adress = this.dialogFormGroup.value.adress;
      this.shippingInformation.subAdress = this.dialogFormGroup.value.subAdress;
      this.shippingInformation.phone = this.dialogFormGroup.value.phone;
      this.shippingInformation.postcode = this.dialogFormGroup.value.postcode;
      let data: any = this.shippingInformation;

      data.close = true;
      data.method = 'shipping';
      this.changeDataEvent.emit(data);

    } else {
      document.querySelector('#error')?.classList.remove('error-field-shake');
      setTimeout(() => {
        document.querySelector('#error')?.classList.add('error-field-shake');
      }, 100)
      this.dialogFormGroup.markAllAsTouched();
      this.valid = false;
    }

  }
  changedCountry(countryValue: any, phone: any) {
    for (let country of this.countries) {
      if (countryValue.value == country.name) {
        phone.control.enable();
        this.countryCode = country.phoneCode;
      }
    }
  }
  close() {
    let data: any = {};
    data.close = true;
    data.method = 'close';
    this.changeDataEvent.emit(data);
  }
}
