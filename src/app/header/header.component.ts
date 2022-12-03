import { ChangeDetectorRef, Component, OnDestroy, OnInit, } from '@angular/core';
import { tuiIsString } from '@taiga-ui/cdk';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { AddToCartService } from '../add-to-cart.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less', './header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  sub!: Subscription;

  public isVisible: boolean = true;
  item: any;
  blockLayot_menu = 'visibility: hidden; opacity: 0;';
  menuStyle = 'transform: translate(-100%)';
  shoppingList: any = [];
  total!: number;
  destroyed = new Subject<void>();
  showContainer = false; // true - show compact view / false - show general view
  currentUrl = '';
  public sizeOfShoppingList = 0;
  constructor(private addToCartService: AddToCartService, private changeDetectorRef: ChangeDetectorRef,
    public cdr: ChangeDetectorRef, private router: Router, public breakpointObserver: BreakpointObserver,
    private Route: ActivatedRoute) {

  }
  open = false;

  ngOnInit(): void {
    // get amount of shopping items
    this.sub = this.addToCartService.getSizeOfShoppingList().subscribe(value => {
      if (this.sizeOfShoppingList != value) {
        this.sizeOfShoppingList = value;

      }
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
  }

  // svg of shopping cart
  shopping_cart_svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g transform="translate(24 0) scale(-1 1)"><path d="M24 3l-.743 2h-1.929l-3.474 12h-13.239l-4.615-11h16.812l-.564 2h-13.24l2.937 7h10.428l3.432-12h4.195zm-15.5 15c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm6.9-7-1.9 7c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z"/></g></svg>`;
  indexOfShoppingItems = 0; // amount of shopping items

  // navigation 
  readonly ProductsCheck = {name: 'Products', sub: [`Charges`, `Cabels`, `Power Banks`, `Earphones`]};
  readonly Products = { name: 'Products', sub: [`Charges`, { name: `Cabels`, content: [`USB-C`, `Lightning`] }, `Power Banks`, `Earphones`] };
  readonly Deals = { name: 'Deals', sub: [`Seasonal Deals`, `Sale`, `New`] };
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
}
