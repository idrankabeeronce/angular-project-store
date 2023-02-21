import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiCountryIsoCode } from '@taiga-ui/i18n';
import { AddToCartService } from 'src/app/add-to-cart.service';
import { AuthenticationService } from 'src/app/authentication.service';
import { User } from 'src/app/_models/user';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css']
})
export class InformationComponent implements OnInit {

  currentUser!: User;
  emailField = new FormControl('', [Validators.required, Validators.email]);
  countryValue = new FormControl(null);
  firstName = new FormControl('', [Validators.required, Validators.minLength(1)]);
  lastName = new FormControl('', [Validators.required, Validators.minLength(1)]);
  adress = new FormControl('', [Validators.required, Validators.minLength(1)]);
  subAdress = new FormControl('');
  phone = new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(12)]);
  postcode = new FormControl('', [Validators.required, Validators.minLength(1)]);
  countries = [{ name: 'United States', phoneCode: TuiCountryIsoCode.US }, { name: 'Canada', phoneCode: TuiCountryIsoCode.CA }, { name: 'Armenia', phoneCode: TuiCountryIsoCode.AM }];
  allowedCountries: any = [];
  countryCode = TuiCountryIsoCode.US;
  phoneMask = ''
  disabled = true;
  try = false;

  constructor(private authenticationService: AuthenticationService,
    private addToCartService: AddToCartService, private router: Router, private Route: ActivatedRoute) { }
  readonly countriesI: readonly TuiCountryIsoCode[] = [
    TuiCountryIsoCode.US,
    TuiCountryIsoCode.CA,
    TuiCountryIsoCode.AM,
  ];

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(
      {
        next: (x => { this.currentUser = x; }),
        error: (err => {
          console.log(err);
        })
      })
    this.setProfileInfo(this.currentUser);
    for (let country of this.countries) {
      this.allowedCountries.push(country.name);
    }
  }
  setProfileInfo(user: User) {
    if (Object.keys(user.shippingInformation).length !== 0) {
    this.countryValue.setValue(user.shippingInformation.country);
    this.firstName.setValue(user.firstName);
    this.lastName.setValue(user.lastName);
    this.adress.setValue(user.shippingInformation.adress);
    this.subAdress.setValue(user.shippingInformation.subAdress);
    this.phone.setValue(user.shippingInformation.phone);
    this.postcode.setValue(user.shippingInformation.postcode);
    this.phone.enable();
  }
  }
  changedCountry() {
    for (let country of this.countries) {
      if (this.countryValue.value == country.name) {
        this.phone.enable();
        this.countryCode = country.phoneCode;
      }
    }
  }

  allValid() {
    if (this.emailField.value == '' || this.countryValue.value == null || this.firstName.value == ''
      || this.lastName.value == '' || this.adress.value == '' || this.subAdress.value == ''
      || this.postcode.value == '' || !this.postcode.valid || this.phone.value == ''
      || !this.phone.valid || !this.emailField.valid) {
      return false
    }
    else
      return true;
  }
  goToShipping() {
    this.try = true;
    if (this.allValid()) {
      this.addToCartService.setShippingDetails({ firstName: this.firstName.value, lastName: this.lastName.value, adress: `${(this.countryValue.value)}, ${(this.adress.value)} ${(this.subAdress.value)}`, postcode: String(this.postcode.value), contacts: { email: this.emailField.value, phone: this.phone.value } });
      //this.addToCartService.getShippingDetails().subscribe((value:any) => {
      //  console.log(value)
      //})

      this.router.navigate([`${this.Route.snapshot.paramMap.get('id')}/checkout/shipping`])
    }
  }
}
