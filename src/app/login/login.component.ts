import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../authentication.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  readonly testForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  error = '';

  loading = false;
  submitted = false;
  public previousUrl: string | null = '';

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService) {
  }

  ngOnInit(): void {
    this.previousUrl = this.activatedRoute.snapshot.queryParamMap.get('returnURL');
  }
  get f() { return this.testForm.controls; }

  submit() {
    this.submitted = true;

    if (this.testForm.invalid) {
      this.testForm.markAllAsTouched();
      return;
    }

    this.loading = true;


    this.authenticationService.login(this.f.username.value as string, this.f.password.value as string)
      .pipe(first())
      .subscribe({
        next: data => {
          this.router.navigate([this.previousUrl]);
        }
        ,
        error: error => {
          this.error = error;
          this.loading = false;
        }
      });

  }
}
