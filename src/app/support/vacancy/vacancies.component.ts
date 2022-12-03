import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit {
  parent = true;
  vacancies: any = [{title: "Senior sales manager", field: "Sales"}, {title: "Senior DevOps Engineer", field: "Development"}, {title: "Senior Front End", field: "IT"}, {title: "Tax Accountant", field: "Finance"}, {title: "Business Manager", field: "Marketing"}, {title: "Data Analytics Manager", field: "Other"}, {title: "Network Engineer", field: "IT"}, {title: "Territory Manager", field: "Sales"}];
  constructor(private router: Router, private Route: ActivatedRoute) { 
    if (this.Route.children.length == 0) {
        this.parent = true
      } else {
        this.parent = false; // go to child
      }
  }
  ngOnInit(): void {
  }
  navigateVacancy(vacancy:any) {
    let title = vacancy.title.toLowerCase();
    title = title.replaceAll(' ', '-');
    let field = vacancy.field.toLowerCase();
    field = field.replaceAll(' ', '-');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`/support/vacancies/${field}/${title}`]))
  }

}
