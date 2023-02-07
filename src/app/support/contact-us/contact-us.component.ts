import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'; 
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {
  phone_1 = "+12345678901";
  phone_2 = "+12345678902";
  Emails = [
    {name: "Official store", mail: "main@neo.com"}, 
    {name: "Support", mail: "support@neo.com"}, 
    {name: "Something", mail:"something@neo.com"}
  ];
  emailField = new FormControl('', [Validators.required, Validators.email]);
  textOfQuestion = new FormControl('');
  imageSrc = 'assets/images/support/contact-us.jpg'
  constructor(@Inject(TuiAlertService) protected readonly alert: TuiAlertService) { 
  }
  ngOnInit(): void {
  }
  sendMsg() {
    if (this.emailField.value != '' && this.textOfQuestion.value != '' && this.emailField.valid) {
      this.emailField.setValue('');
      this.textOfQuestion.setValue('');
      this.alert
            .open(`Your question accepted for processing`, { status: TuiNotification.Success, })
            .subscribe();
    } else {
      
    this.alert
      .open(`Fill in all fields`, { status: TuiNotification.Warning, })
      .subscribe();
    }
  }
}
