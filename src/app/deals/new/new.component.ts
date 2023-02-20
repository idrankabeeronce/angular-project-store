import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import newCollections from 'src/assets/content/products/new-collections.json'
interface typeOfCollection {
  label: string,
  description: any,
  dateOfRelease: any,
  imageSrc: string,
  ref: string,
}

@Component({
  selector: 'app-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.css']
})
export class NewComponent implements OnInit {

  collections: typeOfCollection[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.getCollections();
  }
  getCollections() {
    for (let collection of newCollections) {
      this.collections.push(collection);
    }

  }
  routeTo(ref: string) {
    let paths = ref.split('?');
    let param = paths[1].split('=')
    this.router.navigateByUrl('/').then(() => {
      this.router.navigate([paths[0]], { queryParams: { "search": param[1] } });
    })
  }
}
