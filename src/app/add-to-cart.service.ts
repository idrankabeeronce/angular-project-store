import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddToCartService {

  private openCart = new BehaviorSubject<boolean>(false);
  private item = new BehaviorSubject<any>({});
  private sizeOfShoppingList = new BehaviorSubject<number>(0);
  private totalPrice = new BehaviorSubject<number>(0);

  private ShoppingList = new BehaviorSubject<any>([]);
  private shippingDetails = new BehaviorSubject<any>({});
  public numberOfOrder!: number;

  private shippingMethod = new BehaviorSubject<any>({});

  public setTotalPrice(value: number) {
    this.totalPrice.next(value)
  }
  public getTotalPrice(): Observable<number> {
    return this.totalPrice.asObservable();
  }
  public setShippingMethod(value: any) {
    this.shippingMethod.next(value)
  }
  public getShippingMethod(): Observable<any> {
    return this.shippingMethod.asObservable();
  }



  public setShippingDetails(value: any) {
    this.shippingDetails.next(value);
  }
  public getShippingDetails(): Observable<any> {
    return this.shippingDetails.asObservable();
  }
  public setSizeOfShoppingList(value: number) {
    this.sizeOfShoppingList.next(value)
  }
  public getSizeOfShoppingList(): Observable<number> {
    return this.sizeOfShoppingList.asObservable();
  }

  public setOpenCart(value: boolean) {
    this.openCart.next(value)
  }

  public getOpenCart(): Observable<boolean> {
    return this.openCart.asObservable();
  }

  public getItem(): Observable<boolean> {
    return this.item.asObservable();
  }

  public setItem(value: any) {
    this.item.next(value)
  }

  public setShoppingList(value: any) {
    this.ShoppingList.next(value);
  }
  public getShoppingList(): Observable<any> {
    return this.ShoppingList.asObservable();
  }

  public wipeList() {
    this.ShoppingList = new BehaviorSubject<any>([]);
    this.sizeOfShoppingList.next(0)
    this.shippingMethod.next({})
    this.totalPrice.next(0)

  }
  constructor(private http: HttpClient) { }

  // get ip adress
  getIPAddress() {
    let ipAdress: any;
    this.http.get("http://api.ipify.org/?format=json").subscribe((res: any) => {
      ipAdress = res.ip;
    });
    return ipAdress
  }
}
