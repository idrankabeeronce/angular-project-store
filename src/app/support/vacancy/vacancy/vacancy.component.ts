import { Component, OnInit,Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jobs from 'src/assets/content/jobs/jobs.json';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';

@Component({
  selector: 'app-vacancy',
  templateUrl: './vacancy.component.html',
  styleUrls: ['./vacancy.component.css']
})
export class VacancyComponent implements OnInit {
  vacancyName: string = '';
  field: string = '';
  respDesc = [];
  desc = [];
  content = false;
  contentObj: any;
  url = 'https://youtu.be/dQw4w9WgXcQ';
  similarAr: any = [];
  facebookSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>`;
  twitterSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>`;
  linkedinSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z"/></svg>`;

  constructor(private router: Router, private actRoute: ActivatedRoute,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService) {
    
   }

  getTitle() {
    this.similarAr = [];
    this.contentObj = {};
    this.field = this.actRoute.snapshot.url[0].path;
    this.vacancyName = this.actRoute.snapshot.url[1].path;
    for (let job of jobs) {
      if (job.path == `${this.field}/${this.vacancyName}/`) {
        this.contentObj = job 
        this.respDesc = this.contentObj.responsibilities.description.split("\n");
        this.desc = this.contentObj.description.split("\n");
        this.content = true;
      } else {
      if (job.field == this.field) {
        this.similarAr.push({field: `${String(job.field.split("", 1)).toUpperCase()}${job.field.slice(1)}`, title: job.name}) 
      }
    }
    }
  }

  navigateVacancy(vacancy: any) {
    let title = vacancy.title.toLowerCase();
    title = title.replaceAll(' ', '-');
    let field = vacancy.field.toLowerCase();
    field = field.replaceAll(' ', '-');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`/support/vacancies/${field}/${title}`]))
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }
  ngOnInit(): void {
    this.getTitle();
  }
  applyJob() {
    this.alert
        .open(`This functionality is not done yet`, { status: TuiNotification.Warning, })
        .subscribe();
  }
}
