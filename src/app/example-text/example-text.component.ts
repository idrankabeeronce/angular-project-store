
import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import data from 'src/assets/content/texts/example.json';

@Component({
  selector: 'app-example-text',
  templateUrl: './example-text.component.html',
  styleUrls: ['./example-text.component.css']
})
export class ExampleTextComponent implements OnInit {
  goodQueary: any; // path of route with chapter
  title!: string;
  activeData: any; // data (title and text) of displayed page
  noContent = false; // if true - shows a title and text of chapter / if false - emit error
  pattern = '';

  constructor(private router: Router, private Route: ActivatedRoute, public cdr: ChangeDetectorRef) {

    //update content on route ends if it's 'pages/' path
    router.events.subscribe(res => {
      if (res instanceof NavigationEnd) {
        if (router.url.match('pages/')) {

          this.getContent();
        }
      }
    })
  }
  ngOnInit(): void {
  }

  getPatter() {
    let pattern: string = '';
    // mask of valid route path
    let patternMatch = [
      'payment',
      'terms-of-use',
      'student-offer',
      'shipping',
      'returns',
      'privacy-policy',
      'our-branches',
      'dropshipping-program',
    ];
    let masterPattern = new RegExp(patternMatch.join('|'));
    if (masterPattern.test(String(this.Route.snapshot.paramMap.get('id')))) {
      pattern = 'example';
    }
    return pattern
  }
  getContent() {
    // define title of route page
    this.pattern = this.getPatter();
    this.goodQueary = this.Route.snapshot.paramMap.get('id');
    this.title = String(this.goodQueary).toUpperCase();
    this.title = this.title.replaceAll('-', ' ');
    // get text by defined title
    for (let item of data) {
      if (item.name == this.pattern)
        this.activeData = item.data;
      else
        this.noContent = true;
    }
  }
}
