import { ChangeDetectorRef, Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { tuiIsString } from '@taiga-ui/cdk';
import { Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AddToCartService } from '../add-to-cart.service';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less', './header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  sub_1!: Subscription;
  

  public isVisible: boolean = true;
  item: any;
  blockLayot_menu = 'visibility: hidden; opacity: 0;';
  menuStyle = 'transform: translate(-100%)';
  shoppingList: any = [];
  total!: number;
  destroyed = new Subject<void>();
  showContainer = false; // true - show compact view / false - show general view
  public sizeOfShoppingList = 0;
  constructor(private addToCartService: AddToCartService, private authenticationService: AuthenticationService,
    public cdr: ChangeDetectorRef, private router: Router, public breakpointObserver: BreakpointObserver) {
  }
  open = false;

  ngOnInit(): void {
    // get amount of shopping items
    this.sub = this.addToCartService.getSizeOfShoppingList().subscribe(value => {
      if (this.sizeOfShoppingList != value) {
        this.sizeOfShoppingList = value;

      }
    })
    this.sub_1 = this.authenticationService.isLoginSubject.subscribe(value => {
      this.logged = value;
    })
    // change view of header by changed resolution 
    this.breakpointObserver
      .observe(['(max-width: 700px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.showContainer = true; // compact view
        } else {
          this.showContainer = false; // general view
        }
        this.cdr.detectChanges();
      });
  }
  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.sub_1) {
      this.sub_1.unsubscribe();
    }
  }
  // svg of profile 
  profile_svg = `<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm8.127 19.41c-.282-.401-.772-.654-1.624-.85-3.848-.906-4.097-1.501-4.352-2.059-.259-.565-.19-1.23.205-1.977 1.726-3.257 2.09-6.024 1.027-7.79-.674-1.119-1.875-1.734-3.383-1.734-1.521 0-2.732.626-3.409 1.763-1.066 1.789-.693 4.544 1.049 7.757.402.742.476 1.406.22 1.974-.265.586-.611 1.19-4.365 2.066-.852.196-1.342.449-1.623.848 2.012 2.207 4.91 3.592 8.128 3.592s6.115-1.385 8.127-3.59zm.65-.782c1.395-1.844 2.223-4.14 2.223-6.628 0-6.071-4.929-11-11-11s-11 4.929-11 11c0 2.487.827 4.783 2.222 6.626.409-.452 1.049-.81 2.049-1.041 2.025-.462 3.376-.836 3.678-1.502.122-.272.061-.628-.188-1.087-1.917-3.535-2.282-6.641-1.03-8.745.853-1.431 2.408-2.251 4.269-2.251 1.845 0 3.391.808 4.24 2.218 1.251 2.079.896 5.195-1 8.774-.245.463-.304.821-.179 1.094.305.668 1.644 1.038 3.667 1.499 1 .23 1.64.59 2.049 1.043z"/></svg>`
  
  getProfile() {
    this.authenticationService.setProfileOpen(true);
  }
  indexOfShoppingItems = 0; // amount of shopping items


  logged = false;
  
  // svg of shopping cart
  shopping_cart_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="translate(24 0) scale(-1 1)"><path d="M24 3l-.743 2h-1.929l-3.474 12h-13.239l-4.615-11h16.812l-.564 2h-13.24l2.937 7h10.428l3.432-12h4.195zm-15.5 15c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.9-7-1.9 7c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z"/></g></svg>`;
  
  
  // navigation 
  readonly ProductsCheck = { name: 'Products', sub: [`Charges`, `Cabels`, `Power Banks`, `Earphones`] };
  readonly Products = { name: 'Products', sub: [{ name: `Charges`, content: [`Common`, `Wireless`, `Fast-Charging`] }, { name: `Cabels`, content: [`USB-C`, `Lightning`, `Thunderbolt`, `Audio`] }, `Power Banks`, `Earphones`] };
  readonly Deals = { name: 'Deals', sub: [`Solutions`, `Sale`, `New`] };
  readonly Support = { name: 'Support', sub: [`Contact Us`, `Vacancies`, `About`] };

  readonly tabs: any = [
    this.Products,
    this.Deals,
    this.Support,
    'default',
  ];

  // define active navigation (nav) element that should be highlighted 
  activeElement = String(this.tabs[3]);
  get activeItemIndex(): any {
    if (this.ProductsCheck.sub.includes(this.activeElement) || this.activeElement == 'Products') {
      return this.tabs.indexOf(this.Products);
    }
    else if (this.Deals.sub.includes(this.activeElement) || this.activeElement == 'Deals') {
      return this.tabs.indexOf(this.Deals);
    }
    else if (this.Support.sub.includes(this.activeElement) || this.activeElement == 'Support') {
      return this.tabs.indexOf(this.Support);
    } else if (this.activeElement == 'default') {
      return this.tabs.indexOf('default');
    }
  }

  // navigate by chapter and child if it's not a dropdown element or it's part of compact menu 
  onClick(activeElement: string, d: string): void {
    this.activeElement = activeElement;
    activeElement = activeElement.replace(' ', '-');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`/${d.toLowerCase()}/${activeElement.toLowerCase()}`]));
    this.open = false;
    this.closeMenu();
  }
  onClickTab(host: any, activeElement: string, d: string): void {
    this.activeElement = activeElement;
    activeElement = activeElement.replace(' ', '-');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`/${d.toLowerCase()}/${activeElement.toLowerCase()}`]));
    this.open = false;

    // close hovered dropdown
    host.hover$.hideDelay = 200;
    host.hover$.toggle$.next(false);

    this.closeMenu();
  }
  // navigate with queary param
  onClickSubTab(host: any, sub: string, activeElement: string, d: string) {
    this.activeElement = activeElement;
    activeElement = activeElement.replace(' ', '-');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`/${d.toLowerCase()}/${activeElement.toLowerCase()}`], { queryParams: { type: sub.toLocaleLowerCase() } }));
    this.open = false;

    // close hovered dropdown
    host.hover$.hideDelay = 200;
    host.hover$.toggle$.next(false);

    this.closeMenu();
  }

  // navigate with queary param if it's not a dropdown element or it's part of compact menu
  onClickSub(sub: string, activeElement: string, d: string) {
    this.activeElement = activeElement;
    activeElement = activeElement.replace(' ', '-');
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate([`/${d.toLowerCase()}/${activeElement.toLowerCase()}`], { queryParams: { type: sub.toLocaleLowerCase() } }));
    this.closeMenu();
  }


  // reset marked element
  resetActiveItemIndex() {
    this.activeElement = String(this.tabs[3]);
  }
  // if navigate item is not an array (have no child)
  isString(tab: unknown): tab is string {
    return tuiIsString(tab);
  }

  // open shopping cart list
  getShoppingCart() {
    this.addToCartService.setOpenCart(true);
  }

  // open compact view menu
  getMenu() {
    this.blockLayot_menu = 'visibility: visible; opacity: 1;';
    this.menuStyle = 'transform: translate(0)';
  }
  // close
  closeMenu() {
    this.blockLayot_menu = 'visibility: hidden; opacity: 0;';
    this.menuStyle = 'transform: translate(-100%)';

  }

  // if compact view active : expand nav area / display children routes | or close it
  getContent(button: any, element: any, bool: boolean) {
    let buttonIcon = ''
    if (bool)
      buttonIcon = 'tuiIconPlus';
    else
      buttonIcon = 'tuiIconPlusLarge';
    if (button.icon == buttonIcon) {
      if (bool) {
        button.icon = 'tuiIconMinus';
        element.style = 'visibility: inherit; height: auto;';
      }
      else {
        button.icon = 'tuiIconMinusLarge';
        element.style = 'visibility: visible; height: auto;';
      }
      button.elementRef.nativeElement.style = 'transform: rotate(180deg)';

    } else {
      button.elementRef.nativeElement.style = 'transform: rotate(0)';
      element.style = '';
      button.icon = buttonIcon;

    }
  }
  goLogIn() {
    let currentURL: string = this.router.url;
    this.router.navigate(['/login'], { queryParams: { returnURL: currentURL } })
  }
  
}
