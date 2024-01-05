import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Order } from './order.model';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppModule } from '../../app.module';
import { CartService } from '../cart/cart.service';
import { OrderCheckoutService } from './order-checkout.service';
import { Product } from '../products-component/product.interface';
import { CartComponent } from '../cart/cart.component';

@Component({
  selector: 'app-order-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AppModule, RouterModule],
  providers: [
    AppModule,
    ToastrService,
    CartService,
    OrderCheckoutService,
    CartComponent,
    // FormGroup,
    // FormControl,
    ReactiveFormsModule,
  ],
  templateUrl: './order-checkout.component.html',
  styleUrl: './order-checkout.component.css',
})
export class OrderCheckoutComponent implements OnInit {
  private decodedToken: any;
  protected checkoutForm!: FormGroup;
  protected order: Order = new Order();
  private userId!: string;
  protected items: Product[] = [];
  // protected shippingFees!: any[];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private toastrService: ToastrService,
    private cartService: CartService,
    private orderCheckoutService: OrderCheckoutService,
    private cartComponent: CartComponent
  ) {
    const storedItems = localStorage.getItem('cartItems');
    if (storedItems) {
      this.items = JSON.parse(storedItems);
    }
    // this.getShippingFees();
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = token.split('.')[1];
      const decodedPayload = tokenPayload ? atob(tokenPayload) : null;

      this.decodedToken = decodedPayload ? JSON.parse(decodedPayload) : null;
      console.log(this.decodedToken);

      if (this.decodedToken) {
        this.userId = this.decodedToken.id;

        this.fetchUserData().subscribe((userData) => {
          // console.log('User ID:', this.userId);
          const { username, address, phone, postalCodeAndCity, email } =
            userData.user;

          this.checkoutForm = this.formBuilder.group({
            name: [username, Validators.required],
            address: [address, Validators.required],
            postalCodeAndCity: [
              postalCodeAndCity,
              [Validators.required, Validators.pattern('[0-9]*')],
            ],
            phone: [
              phone,
              [Validators.required, Validators.pattern('[0-9+]*')],
            ],
            email: [email, [Validators.required, Validators.email]],
          });

          if (localStorage.getItem('userData')) {
            const userDataLocal = JSON.parse(
              localStorage.getItem('userData') || ''
            );

            if (userDataLocal) {
              this.checkoutForm.patchValue({
                address: userDataLocal.address || address,
                phone: userDataLocal.phone || phone,
                postalCodeAndCity:
                  userDataLocal.postalCodeAndCity || postalCodeAndCity,
              });
            }
          }
        });
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  protected createOrder() {
    if (this.checkoutForm.valid) {
      this.order.name = this.fc['name'].value;

      this.order.address = this.fc['address'].value;
      this.order.phone = this.fc['phone'].value;
      this.order.postalCodeAndCity = this.fc['postalCodeAndCity'].value;

      this.order.email = this.fc['email'].value;
      this.order.status = 'u toku';

      // if (this.items && this.items.length > 0) {
      //   this.items.forEach((product: Product) => {
      //     const orderItem = {
      //       productId: product._id,
      //       quantity: product.quantity,
      //     };

      //     this.order.items.push(orderItem);

      //     console.log('Product ID:', product._id);
      //     console.log('Quantity:', product.quantity); // Pretpostavka da postoji atribut 'quantity' u 'Product' interfejsu
      //     // Ovde možete raditi šta god želite sa podacima proizvoda
      //   });
      // }

      this.items.forEach((product: Product) => {
        this.order.items.push(product);
        console.log(product);
      });

      this.orderCheckoutService.addOrder(this.order).subscribe(
        (response) => {
          console.log('Porudžbina je uspešno dodata:', response);
          this.saveUserData();
          this.cartService.clearCart();
          this.router.navigate(['/']);
          this.toastrService.success(
            'Successfully ordered!',
            'Thanks for ordered!'
          );
          console.log(
            'Podaci su valjani. Slanje podataka...',
            this.checkoutForm.value
          );
        },
        (error) => {
          this.toastrService.error('Please try again.', 'Something wrong!');
          console.error('Greška prilikom dodavanja porudžbine:', error);
        }
      );
    } else {
      if (this.checkoutForm.invalid) {
        this.toastrService.warning('Prealse fill the inputs', 'Invalid Inputs');
        return;
      }
    }
  }

  get fc() {
    return this.checkoutForm.controls;
  }

  private fetchUserData() {
    return this.http.get<any>(`http://localhost:3000/api/user/${this.userId}`);
  }

  protected saveUserData() {
    const userData = {
      address: this.order.address,
      phone: this.order.phone,
      postalCodeAndCity: this.order.postalCodeAndCity,
    };

    localStorage.setItem('userData', JSON.stringify(userData));
  }

  protected calculateTotalCost(): number {
    return this.cartComponent.calculateTotalCost();
  }

  // getShippingFees(): void {
  //   this.orderCheckoutService.getShippingFee().subscribe(
  //     (fees: any[]) => {
  //       this.shippingFees = fees;
  //       // Ovdje možete dalje manipulirati s podacima ili ih prikazati u vašem template-u
  //     },
  //     (error) => {
  //       console.error(error);
  //       // Obrada grešaka ako dođe do problema prilikom dohvaćanja podataka
  //     }
  //   );
  // }
}
