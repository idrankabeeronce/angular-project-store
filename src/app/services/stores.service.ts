import { Injectable } from '@angular/core';
import { ServicesStores, StoreObj, CityObj } from '../interfaces/StoreInterfaces';
import * as storesJson from "src/assets/content/stores/stores.json"

@Injectable({
  providedIn: 'root'
})
export class StoresService {
  private servicesStores : ServicesStores = {
    arStoreObj: [],
    allowedCities: []
  };

  constructor() { }

  public init() {
    this.servicesStores.arStoreObj = this.getStores();
    this.servicesStores.allowedCities = this.getAllowedCities();
    return this.servicesStores;
  }

  public getStores() {
    let arStoreObj: Array<StoreObj> = (storesJson as any).default;
    return arStoreObj;
  }

  public getAllowedCities() {
    let allowedCities: Array<CityObj> = [];
    if (this.servicesStores.arStoreObj.length) {
      for(let store of this.servicesStores.arStoreObj) {
        if (store)
          allowedCities.push({
            value: store.city,
            label: store.city + '(' + store.country + ')'
          });
      }
    }
    return [...new Map(allowedCities.map(city => [city['value'], city])).values()];
  }
}
