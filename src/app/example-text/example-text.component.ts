
import { Component, ChangeDetectorRef, OnInit, Inject} from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
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
  discountTemplate = false;
  discountCards = [{
    value: 5,
    unit: '%',
    code: 'READY',
    desc: ['5% for all orders', 'Unlimited usage time', 'Applies to all products']
  },{
    value: '20',
    unit: '$',
    code: 'STEADY',
    desc: ['$20 of for order over $150', 'Unlimited usage time', 'Applies to all products']
  },{
    value: '39',
    unit: '$',
    code: 'GOADY',
    desc: ['$39 of for orderover $200', 'Unlimited usage time', 'Applies to all products']
  }];
  constructor(private router: Router, private Route: ActivatedRoute, public cdr: ChangeDetectorRef,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService) {

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
  copyCode(code: string) {
    navigator.clipboard.writeText(code);
    this.alert
          .open(`Copied the code: ${code}`)
          .subscribe();
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
      'something'
    ];
    let masterPattern = new RegExp(patternMatch.join('|'));
    if (masterPattern.test(String(this.Route.snapshot.paramMap.get('id')))) {
      pattern = 'example';
    }
    return pattern
  }
  getContent() {
    if (this.Route.snapshot.paramMap.get('id') === 'discount') {
      this.discountTemplate = true;
      this.title = 'Discount';
    }
    else {
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
}
