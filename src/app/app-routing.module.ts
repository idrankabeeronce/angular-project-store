import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DealsComponent } from './deals/deals.component';
import { ExampleTextComponent } from './example-text/example-text.component';
import { GoodsComponent } from './products/goods/goods.component';
import { HomeComponent } from './home/home.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProductsComponent } from './products/products.component';
import { AboutComponent } from './support/about/about.component';
import { ContactUsComponent } from './support/contact-us/contact-us.component';
import { SupportComponent } from './support/support.component';
import { VacanciesComponent } from './support/vacancy/vacancies.component';
import { CheckoutComponent } from './shopping-cart/checkout/checkout.component';
import { InformationComponent } from './shopping-cart/checkout/information/information.component';
import { ShippingComponent } from './shopping-cart/checkout/shipping/shipping.component';
import { PaymentComponent } from './shopping-cart/checkout/payment/payment.component';
import { VacancyComponent } from './support/vacancy/vacancy/vacancy.component';
import { NewComponent } from './deals/new/new.component';
import { SaleComponent } from './deals/sale/sale.component';
import { SeasonalDealsComponent } from './deals/seasonal-deals/seasonal-deals.component';
import { DealsHomeComponent } from './deals/deals-home/deals-home.component';
import { Title } from '@angular/platform-browser';
import { ItemComponent } from './item/item.component';
import { CartComponent } from './cart/cart.component';
const routes: Routes = [
  { path: '', title: 'NEO Official Store', component: HomeComponent },
  {
    path: 'products', title: 'NEO Products', component: ProductsComponent,
    children: [
      { path: 'charges', title: 'CHARGES - NEO', component: GoodsComponent },
      { path: 'cabels', title: 'CABELS - NEO', component: GoodsComponent },
      { path: 'power-banks', title: 'POWER BANKS - NEO', component: GoodsComponent },
      { path: 'earphones', title: 'EARPHONES - NEO', component: GoodsComponent }
    ]
  },
  {
    path: 'item', 
    children: [
      { path: '**', title: "Title", component: ItemComponent } 
    ]
  },
  {
    path: 'deals', title: 'NEO Deals', component: DealsComponent,
    children: [
      { path: 'seasonal-deals', title: 'SEASONAL DEALS - NEO', component: SeasonalDealsComponent },
      { path: 'sale', title: 'SALE - NEO', component: SaleComponent },
      { path: 'new', title: 'NEW - NEO', component: NewComponent }
    ]
  },
  {
    path: 'support', title: 'NEO Support', component: SupportComponent,
    children: [
      { path: 'contact-us', title: 'CONTACT US - NEO', component: ContactUsComponent },
      { path: 'vacancies', 
      children: [
      { path: '', title: 'VACANCIES - NEO', component: VacanciesComponent},
      { path: '**', title: 'VACANCIES - NEO', component: VacancyComponent}
      ]
      },
      { path: 'about', title: 'ABOUT - NEO', component: AboutComponent }
    ]
  },
  {
    path: ':id/checkout', component: CheckoutComponent,
    children: [
      { path: '', title: 'Information Checkout', component: InformationComponent},
      { path: 'shipping', title: 'Shipping Checkout', component: ShippingComponent},
      { path: 'payment', title: 'Paymant Checkout', component: PaymentComponent}
    ]  
  },
  {
    path: 'cart', component: CartComponent
  },
  {
    path: 'pages/:id',
    children: [
      { path: '**', component: ExampleTextComponent}
    ]
  },
  { path: '**', component: PageNotFoundComponent },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
