import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { windowTime } from 'rxjs';
import jobs from 'src/assets/content/jobs/jobs.json';

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css']
})
export class VacanciesComponent implements OnInit {
  parent = true;
  vacancies: any = [];
  constructor(private router: Router, private Route: ActivatedRoute) { 
    if (this.Route.children.length == 0) {
        this.parent = true
      } else {
        this.parent = false; // go to child
      }
  }
  ngOnInit(): void {
    this.getVacancies();
  }
  getVacancies() {
    this.vacancies = []
    for (let job of jobs) {
      this.vacancies.push({title: job.name, field: `${String(job.field.split('', 1)).toUpperCase()}${job.field.slice(1)}`});
    }
  }
  navigateVacancy(vacancy:any) {
    let title = vacancy.title.toLowerCase();
    title = title.replaceAll(' ', '-');
    let field = vacancy.field.toLowerCase();
    field = field.replaceAll(' ', '-');
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`/support/vacancies/${field}/${title}`]));
  }

}
