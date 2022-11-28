import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-bottom',
  templateUrl: './bottom.component.html',
  styleUrls: ['./bottom.component.css']
})
export class BottomComponent implements OnInit {

  // navigation list
  iconString = 'tuiIconPlusLarge';
  readonly About = [{ name: 'About NEO', link: '/support/about' }, { name: 'Contact Us', link: '/support/contact-us' }, { name: 'Terms of Use', link: '/pages/terms-of-use' }, { name: 'Privacy Policy', link: '/pages/privacy-policy' }];
  readonly ForClients = [{ name: 'Student Discount', link: '/pages/student-offer' }, { name: 'Our Branches', link: '/pages/our-branches' }, { name: 'Dropshipping Program', link: '/pages/dropshipping-program' }];
  readonly Service = [{ name: 'Payment', link: '/pages/payment' }, { name: 'Shipping & Delivery', link: '/pages/shipping' }, { name: 'Return & Exchange', link: '/pages/returns' }];

  readonly list: any = [
    this.About,
    this.ForClients,
    this.Service,
  ];

  // form control of input with emain validation 
  emailField = new FormControl('', [Validators.required, Validators.email]);
  changeInput(button: any) {
    if (this.emailField.valid)
      button.disabled = false
    else
      button.disabled = true
  }

  constructor() { }

  // if compact view active : expand nav area / display children routes | or close it
  getContent(button: any, element: any) {
    if (button.icon == 'tuiIconPlusLarge') {
      element.style = 'visibility: visible; height: auto;';
      button.elementRef.nativeElement.style = 'transform: rotate(180deg)';
      button.icon = 'tuiIconMinusLarge';
    } else {
      button.elementRef.nativeElement.style = 'transform: rotate(0)';
      element.style = '';
      button.icon = 'tuiIconPlusLarge';
    }
  }
  
  scrollTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  ngOnInit(): void {
  }
}
