import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';
import { HeaderComponent } from './components/header/header.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ProductsComponentComponent } from './pages/products-component/products-component.component';
import { AddProductComponent } from './pages/add-product/add-product.component';

@NgModule({
  declarations: [],
  imports: [
    FormsModule,
    MaterialModule,
    ToastrModule.forRoot({ positionClass: 'toast-bottom-right' }),
    MatSnackBarModule,
    HttpClientModule,
    HeaderComponent,
    WelcomeComponent,
    ProductsComponentComponent,
    AddProductComponent,
    ReactiveFormsModule,
  ],
  providers: [FormControl, ToastrService],
  bootstrap: [],
})
export class AppModule {}
