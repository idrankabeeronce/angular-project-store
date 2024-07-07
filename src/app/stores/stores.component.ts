import { Component, OnInit } from '@angular/core';
import { StoresService } from '../services/stores.service';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';
import { FormControl } from '@angular/forms';
import { ServicesStores, StoreObj, CityObj } from '../interfaces/StoreInterfaces';

type MarkersObject<TValue> = { [key: string]: TValue }

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.css']
})
export class StoresComponent implements OnInit {
  arStoreObj: Array<StoreObj> = [];
  mapBox: mapboxgl.Map | null = null;
  mapBoxMarkers: MarkersObject<mapboxgl.Marker> = {};
  style = 'mapbox://styles/mapbox/streets-v11';
  allowedCities: Array<CityObj> = [];
  cityFormControl = new FormControl();
  stList: Array<StoreObj> = [];
  mapSkeletonVisible: boolean = true;
  setCustomImageMarker: boolean = true;
  activeStore: StoreObj | undefined = undefined;
  defaultMarkerImage: string = 'assets/images/stores/store.jpg';
  sekeltonClassName = 'tui-skeleton';

  constructor(private storeService: StoresService) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }

  ngOnInit(): void {
    let servicesStores: ServicesStores = this.storeService.init();
    this.arStoreObj = servicesStores.arStoreObj;
    this.allowedCities = servicesStores.allowedCities;
    this.cityFormControl.valueChanges.subscribe(data => {  
      this.updateStList(data.value);
      this.addMarkers();
    });
    this.buildMap();
    if (this.allowedCities.length)
      this.cityFormControl.setValue(this.allowedCities[0]);
  }

  removeSkeleton(HTMLElement: HTMLElement) {
    HTMLElement.classList.remove(this.sekeltonClassName);
  }

  buildMap() {
    const navControl = new mapboxgl.NavigationControl({
      visualizePitch: true
    });
    this.mapBox = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: 2,
      center: [50, 50],
      attributionControl: false,
      pitchWithRotate: false,
      dragRotate: false,
      doubleClickZoom: false,
      touchPitch: false,
      cooperativeGestures: window.innerWidth <= 768 ? true : false
    });
    this.mapBox.dragRotate.disable();
    this.mapBox.touchZoomRotate.disableRotation();
    this.mapBox.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true,
      showUserHeading: true,
      showUserLocation: true
    }));
    this.mapBox.on('load', () => {
      this.mapSkeletonVisible = !this.mapSkeletonVisible;
    });
  }

  addMarkers() {
    for (let id of Object.keys(this.mapBoxMarkers)) {
      this.mapBoxMarkers[id].remove();
    }
    this.mapBoxMarkers = {};
    if (!this.mapBox) return;
    let avLng = 0, avLat = 0, count = 0;
    for (let store of this.stList) {
      let el = undefined;
      let image = store.image.src || this.defaultMarkerImage;
      if (this.setCustomImageMarker) {
        el = document.createElement('c-marker');
        el.className = 'c-marker';
        el.style.backgroundImage = `url(${image})`;
        el.style.width = `44px`;
        el.style.height = `44px`;
        el.style.border = `2px solid #fff`;
        el.style.backgroundSize = '100%';
      }
      this.mapBoxMarkers[store.id] = new mapboxgl.Marker(el)
        .setLngLat([store.coords.lng, store.coords.lat])
        .setPopup(new mapboxgl.Popup().setHTML(this.mapPopupTemplate(store)))
        .addTo(this.mapBox);
      this.mapBoxMarkers[store.id].getPopup().on('open', () => {
        this.selectStoreMarker(store.id);
      });
      this.mapBoxMarkers[store.id].getPopup().on('close', () => {
        if (this.activeStore !== undefined && this.activeStore.id === store.id) {
          this.resetActiveStore();
        }
      });
      avLng += store.coords.lng;
      avLat += store.coords.lat;
      count++;
    }
    if (count) {
      avLng = avLng / count;
      avLat = avLat / count;
      this.mapBox.flyTo({zoom: 10, center: [avLng, avLat], speed: 2});
    }
  }

  mapPopupTemplate(store: StoreObj) {
    let result = `<div class="mapbox-store-detail">`;
    if (store.address)
      result += `
        <div class="mapbox-store-detail__address">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 3c2.131 0 4 1.73 4 3.702 0 2.05-1.714 4.941-4 8.561-2.286-3.62-4-6.511-4-8.561 0-1.972 1.869-3.702 4-3.702zm0-2c-3.148 0-6 2.553-6 5.702 0 3.148 2.602 6.907 6 12.298 3.398-5.391 6-9.15 6-12.298 0-3.149-2.851-5.702-6-5.702zm0 8c-1.105 0-2-.895-2-2s.895-2 2-2 2 .895 2 2-.895 2-2 2zm8 6h-3.135c-.385.641-.798 1.309-1.232 2h3.131l.5 1h-4.264l-.344.544-.289.456h.558l.858 2h-7.488l.858-2h.479l-.289-.456-.343-.544h-2.042l-1.011-1h2.42c-.435-.691-.848-1.359-1.232-2h-3.135l-4 8h24l-4-8zm-12.794 6h-3.97l1.764-3.528 1.516 1.528h1.549l-.859 2zm8.808-2h3.75l1 2h-3.892l-.858-2z"/></svg>
          <span class="tui-text_body-s">${store.address}</span>
        </div>
      `;
    if (store.working_hours)
      result += `
        <div class="mapbox-store-detail__working-hourds">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.848 12.459c.202.038.202.333.001.372-1.907.361-6.045 1.111-6.547 1.111-.719 0-1.301-.582-1.301-1.301 0-.512.77-5.447 1.125-7.445.034-.192.312-.181.343.014l.985 6.238 5.394 1.011z"/></svg>
          <span class="tui-text_body-s">${store.working_hours}</span>
        </div>
      `;
    if (store.phone)
      result += `
        <div class="mapbox-store-detail__phone">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M6.176 1.322l2.844-1.322 4.041 7.89-2.724 1.341c-.538 1.259 2.159 6.289 3.297 6.372.09-.058 2.671-1.328 2.671-1.328l4.11 7.932s-2.764 1.354-2.854 1.396c-7.862 3.591-19.103-18.258-11.385-22.281zm1.929 1.274l-1.023.504c-5.294 2.762 4.177 21.185 9.648 18.686l.971-.474-2.271-4.383-1.026.5c-3.163 1.547-8.262-8.219-5.055-9.938l1.007-.497-2.251-4.398z"/></svg>
          <span class="tui-text_body-s">${store.phone}</span>
        </div>
      `;
    if (store.description)
      result += `
        <div class="mapbox-store-detail__description">
          <span class="tui-text_body-xs">${store.description}</span>
        </div>
      `;
    else
      result += `<br>`;
    result += `</div>`;
    return result;
  }

  selectStore(selectedStoreId: number, mapHTMLElement: HTMLElement) {
    if (window.innerWidth > 768)
      this.scrollToMap(mapHTMLElement);
    this.selectStoreOnMap(selectedStoreId);
  }

  resetActiveStore() {
    if (this.mapBox) {
      this.mapBox.flyTo({zoom: 10, speed: 2});
      if (this.mapBoxMarkers[(this.activeStore as StoreObj).id].getPopup().isOpen())
        this.mapBoxMarkers[(this.activeStore as StoreObj).id].getPopup().remove();
    }
    this.activeStore = undefined;
  }

  selectStoreOnMap(selectedStoreId: number) {   
    if (!this.mapBox || !selectedStoreId) return;
    
    for (let id of Object.keys(this.mapBoxMarkers)) {
      if (parseInt(id) == selectedStoreId) {
        if (!this.mapBoxMarkers[selectedStoreId].getPopup().isOpen()) {
          let lngLat = this.mapBoxMarkers[selectedStoreId].getLngLat();
          this.mapBox.flyTo({zoom: 16, center: [lngLat.lng, lngLat.lat], speed: 2});
          this.mapBoxMarkers[selectedStoreId].togglePopup();          
          this.activeStore = this.arStoreObj.find(obj => obj.id === selectedStoreId) || undefined;
        }
      } else {
        if (this.mapBoxMarkers[id].getPopup().isOpen())
          this.mapBoxMarkers[id].getPopup().remove();
      }
    }   
  }

  selectStoreMarker(selectedStoreId: number) {   
    if (!this.mapBox || !selectedStoreId) return;
    
    for (let id of Object.keys(this.mapBoxMarkers)) {
      if (parseInt(id) == selectedStoreId) {
        let lngLat = this.mapBoxMarkers[selectedStoreId].getLngLat();
        this.mapBox.flyTo({zoom: 16, center: [lngLat.lng, lngLat.lat], speed: 2});        
        this.activeStore = this.arStoreObj.find(obj => obj.id === selectedStoreId) || undefined;
      }
    }   
  }

  scrollToMap(mapHTMLElement: HTMLElement) {
    window.scrollTo({
      top: mapHTMLElement.getBoundingClientRect().top + window.scrollY - (window.innerWidth > 768 ? 88 : 56), 
      behavior: 'smooth' 
    });
  }

  updateStList(value: string) {
    this.stList = [];
    this.activeStore = undefined;
    if (!this.arStoreObj.length) return;
    for ( let store of this.arStoreObj) {
      if (store.city === value)
        this.stList.push(store);
    }    
  }
}
