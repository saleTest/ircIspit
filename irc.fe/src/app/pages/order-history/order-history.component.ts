import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { OrderCheckoutService } from '../order-checkout/order-checkout.service';
import { Route, Router, RouterModule, Routes } from '@angular/router';
import { AppModule } from '../../app.module';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UpdateOrderDialogComponent } from '../../dialog/update-order-dialog/update-order-dialog.component';
import { MaterialModule } from '../../material.module';
import { HttpClient } from '@angular/common/http';
import { ProductRatingDialogComponent } from '../../dialog/product-rating-dialog/product-rating-dialog.component';

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [CommonModule, RouterModule, AppModule, MaterialModule],
  providers: [OrderCheckoutService, DatePipe],
  templateUrl: './order-history.component.html',
  styleUrl: './order-history.component.css',
})
export class OrderHistoryComponent {
  orderHistory: any[] = [];
  protected userIsRating = false;

  constructor(
    private orderCheckoutService: OrderCheckoutService,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private http: HttpClient
  ) {}

  formatCreatedAt(createdAt: string | null): string {
    return this.datePipe.transform(createdAt!, 'dd/MM/yyyy HH:mm:ss')!;
  }

  ngOnInit(): void {
    this.orderCheckoutService.getOrdersByCurrentUser().subscribe(
      (orders) => {
        // console.log(orders);
        this.orderHistory = orders;
      },
      (error) => {
        console.error('Error fetching orders:', error);
      }
    );
  }

  deleteProdut(orderId: number) {
    const confirmDelete = window.confirm(
      'Do you want to delete the product from the history?'
    );
    if (confirmDelete) {
      this.http
        .patch(`http://localhost:3000/api/updateActivateProduct/${orderId}`, {
          active: false,
        })
        .subscribe(
          (response) => {
            console.log('Proizvod uspešno deaktiviran!', response);
          },
          (error) => {
            console.log(error.message);
            console.error('Error fetching orders:', error);
          }
        );
    }
  }
  cancelProductStatus(orderId: number) {
    const confirmCancel = window.confirm('Do you want to cancel the product?');
    if (confirmCancel) {
      this.http
        .patch(`http://localhost:3000/api/cancelProductStatus/${orderId}`, {
          status: 'otkazano',
        })
        .subscribe(
          (response) => {
            console.log('Proizvod uspešno otkazan!', response);
          },
          (error) => {
            console.log(error.message);
            console.error('Error fetching orders:', error);
          }
        );
    }
  }

  confirmProductStatus(orderId: number) {
    const confirmProduct = window.confirm('Has the product arrived?');
    if (confirmProduct) {
      this.http
        .patch(`http://localhost:3000/api/confirmProductStatus/${orderId}`, {
          status: 'pristiglo',
        })
        .subscribe(
          (response) => {
            console.log('Proizcod uspesno dostavljen', response);
          },
          (error) => {
            console.error('Error fetching orders:', error.message);
          }
        );
    }
  }

  openUpdateOrderDialog(orderId: number) {
    // console.log(orderId);

    // console.log(this.orderHistory);
    const order = this.orderHistory.find(
      (order) => order.order._id === orderId
    );
    // console.log(order);
    if (order) {
      const items = order.items;
      const status = order.order.status;
      // console.log(status);
      // console.log(item);
      // console.log('Items for order with ID', orderId, ':', items);
      const dialogRef = this.dialog.open(UpdateOrderDialogComponent, {
        width: '400px',
        data: { id: orderId, title: 'Update Ordered', items, status },
      });
    }
  }

  openRatingDialog(orderId: number): void {
    const order = this.orderHistory.find(
      (order) => order.order._id === orderId
    );

    if (order) {
      const productIds = order.items.map(
        (item: { product: { _id: any } }) => item.product._id
      );
      console.log(productIds);

      const dialogRef = this.dialog.open(ProductRatingDialogComponent, {
        width: '350px',
        data: { productId: productIds },
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.success) {
          this.userIsRating = true;
          // console.log(this.userIsRating);
        }
      });
    }
  }
}
