import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import { TuiRootModule, TuiDialogModule, TuiAlertModule, TUI_SANITIZER } from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ALL_TAIGA_UI_MODULES } from "./taiga modules/all_taiga_modules";
import { ProductsComponent } from './products/products.component';
import { DealsComponent } from './deals/deals.component';
import { HomeComponent } from './home/home.component';
import { GoodsComponent } from './products/goods/goods.component';
import { BottomComponent } from './bottom/bottom.component';
import { SupportComponent } from './support/support.component';
import { VacanciesComponent } from './support/vacancy/vacancies.component';
import { AboutComponent } from './support/about/about.component';
import { ContactUsComponent } from './support/contact-us/contact-us.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { LayoutModule } from '@angular/cdk/layout';
import { ExampleTextComponent } from './example-text/example-text.component';
import { ItemComponent } from './item/item.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckoutComponent } from './shopping-cart/checkout/checkout.component';
import { InformationComponent } from './shopping-cart/checkout/information/information.component';
import { ShippingComponent } from './shopping-cart/checkout/shipping/shipping.component';
import { PaymentComponent } from './shopping-cart/checkout/payment/payment.component';
import { VacancyComponent } from './support/vacancy/vacancy/vacancy.component';
import { NewComponent } from './deals/new/new.component';
import { SaleComponent } from './deals/sale/sale.component';
import { Solutions } from './deals/solutions/solutions.component';
import { CartComponent } from './cart/cart.component';
import { LoginComponent } from './login/login.component';
import { backendProvider } from "./_fakebackend/backend";
import { JwtInterceptor } from "./_fakebackend/jwt.interceptor";
import { ErrorInterceptor } from "./_fakebackend/error.interceptor";
import { ProfileComponent } from './profile/profile.component';
import { PaymentFormComponent } from './profile/payment-form/payment-form.component';
import { ShippingFormComponent } from './profile/shipping-form/shipping-form.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ProductsComponent,
    DealsComponent,
    HomeComponent,
    GoodsComponent,
    BottomComponent,
    SupportComponent,
    VacanciesComponent,
    AboutComponent,
    ContactUsComponent,
    PageNotFoundComponent,
    ExampleTextComponent,
    ItemComponent,
    ShoppingCartComponent,
    CheckoutComponent,
    InformationComponent,
    ShippingComponent,
    PaymentComponent,
    VacancyComponent,
    NewComponent,
    SaleComponent,
    Solutions,
    CartComponent,
    LoginComponent,
    ProfileComponent,
    PaymentFormComponent,
    ShippingFormComponent
    
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    ALL_TAIGA_UI_MODULES,
    LayoutModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [HttpClientModule,
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    backendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
