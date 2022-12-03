import { NgModule } from '@angular/core';
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
    path: 'deals', title: 'NEO Deals', component: DealsComponent,
    children: [
      { path: 'seasonal-deals', title: 'SEASONAL DEALS - NEO', component: GoodsComponent },
      { path: 'sale', title: 'SALE - NEO', component: GoodsComponent },
      { path: 'new', title: 'NEW - NEO', component: GoodsComponent }
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
