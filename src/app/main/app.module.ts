import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { AppService } from './app.service';
import { AppComponent } from './app.component';
import { HomeComponent } from '../view/home/home.component';
import { LoginComponent } from '../view/login/login.component';
import { DynaviewComponent } from '../dynaview/dynaview.component';
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS
} from '@angular/common/http';

import { ModalService, ModalComponent } from '../modal/modal.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class XhrInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const xhr = req.clone({
      headers: req.headers.set('X-Requested-With', 'XMLHttpRequest')
    });
    return next.handle(xhr);
  }
}

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dyna/:nome', component: DynaviewComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    DynaviewComponent,
    ModalComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    NgbModule,
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  entryComponents: [ModalComponent],
  providers: [AppService, ModalService, { provide: HTTP_INTERCEPTORS, useClass: XhrInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
