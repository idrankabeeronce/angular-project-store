import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
  goodQueary: any;
  title :string;
  text: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida porttitor sapien sed pellentesque. Cras non turpis nec dui venenatis pellentesque quis in neque. Vivamus suscipit sed nisi ac placerat. Nulla vestibulum metus mi, ac efficitur urna cursus id. Phasellus malesuada at nulla non feugiat. Nulla aliquet magna non eleifend volutpat. Ut dapibus justo eget velit aliquet, id rhoncus elit dignissim. Quisque quis ullamcorper dui, tempus accumsan nisi. Aenean venenatis ultrices augue vitae venenatis. Quisque dictum lectus eu lorem molestie, ut sodales dui tincidunt. Vestibulum sodales metus lectus, non sodales diam facilisis a. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam dui erat, consequat nec leo vitae, accumsan lobortis enim. Fusce urna lacus, maximus at consectetur ac, luctus id orci. Aenean viverra purus ac porta ullamcorper. Ut ac erat et leo maximus dictum. \n Suspendisse pretium neque a urna maximus aliquam. Proin pharetra metus ac arcu hendrerit, eget fringilla justo tristique. Nullam vulputate ultrices leo sed blandit. Aenean porta malesuada laoreet. Nulla id maximus mi. Nulla sit amet ornare quam, sit amet elementum nulla. Praesent in vestibulum augue, in consectetur erat. Integer at mi luctus, pellentesque elit mattis, malesuada velit. Mauris quis aliquam magna, eget tristique tellus. Aenean a eros leo. Sed egestas efficitur purus non molestie. Donec imperdiet libero vitae vulputate tristique. \n Ut egestas velit quis lacinia auctor. Praesent id erat semper, lobortis lorem et, sollicitudin augue. Suspendisse sit amet ultrices neque, quis ornare massa. Phasellus nec ligula a lacus egestas facilisis. Donec faucibus mi vitae massa tempus, vitae rutrum enim sodales. Donec sit amet neque ante. Donec porta leo nulla, sed consequat felis auctor nec. Aenean ut urna in nulla vulputate varius. Aliquam a placerat orci, porta tristique purus. Vestibulum volutpat consectetur vulputate.`
  textExample_1:any = [{title: "About Us", text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam gravida porttitor sapien sed pellentesque. Cras non turpis nec dui venenatis pellentesque quis in neque. Vivamus suscipit sed nisi ac placerat. Nulla vestibulum metus mi, ac efficitur urna cursus id. Phasellus malesuada at nulla non feugiat. Nulla aliquet magna non eleifend volutpat. Ut dapibus justo eget velit aliquet, id rhoncus elit dignissim. Quisque quis ullamcorper dui, tempus accumsan nisi. Aenean venenatis ultrices augue vitae venenatis. Quisque dictum lectus eu lorem molestie, ut sodales dui tincidunt."},{title: "What we do", text: "Suspendisse pretium neque a urna maximus aliquam. Proin pharetra metus ac arcu hendrerit, eget fringilla justo tristique. Nullam vulputate ultrices leo sed blandit. Aenean porta malesuada laoreet. Nulla id maximus mi. Nulla sit amet ornare quam, sit amet elementum nulla. Praesent in vestibulum augue, in consectetur erat. Integer at mi luctus, pellentesque elit mattis, malesuada velit. Mauris quis aliquam magna, eget tristique tellus. Aenean a eros leo. Sed egestas efficitur purus non molestie. Donec imperdiet libero vitae vulputate tristique."},{title: "Goals", text: "Ut egestas velit quis lacinia auctor. Praesent id erat semper, lobortis lorem et, sollicitudin augue. Suspendisse sit amet ultrices neque, quis ornare massa. Phasellus nec ligula a lacus egestas facilisis. Donec faucibus mi vitae massa tempus, vitae rutrum enim sodales. Donec sit amet neque ante. Donec porta leo nulla, sed consequat felis auctor nec. Aenean ut urna in nulla vulputate varius. Aliquam a placerat orci, porta tristique purus. Vestibulum volutpat consectetur vulputate."}];
  textExample_2:any = [];
  imageSrc_1 = 'assets/images/support/building.jpg';
  imageSrc_2 = 'assets/images/support/global-network.jpg'
  constructor(private router: Router, private Route: ActivatedRoute) { 
    this.goodQueary = Route.routeConfig?.path;
    this.title = String(this.goodQueary).toUpperCase();
    this.title = this.title.replaceAll('-', ' ');
  }
  ngOnInit(): void {
    this.textExample_2 = this.text.split("\n");
  }

}
