export interface StoreObj {
    id: number,
    name: string,
    country: string,
    city: string,
    city_label: string,
    address: string,
    working_hours: string,
    phone: string,
    description: string,
    image: {
        src: string,
        pos: string
    },
    coords: {
        lat: number,
        lng: number
    },
    tags: Array<string>
}
  
export interface CityObj {
    value: string,
    label: string
}

export interface ServicesStores {
    arStoreObj: Array<StoreObj>;
    allowedCities: Array<CityObj>;
}