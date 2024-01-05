import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AppModule } from '../../app.module';
import { MaterialModule } from '../../material.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-rating-dialog',
  standalone: true,
  imports: [CommonModule, AppModule, MaterialModule, FormsModule],
  templateUrl: './product-rating-dialog.component.html',
  styleUrl: './product-rating-dialog.component.css',
})
export class ProductRatingDialogComponent {
  rating!: number;
  productId!: string[];

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<ProductRatingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.productId = data?.productId;
  }

  setRating(rating: number) {
    this.rating = rating;
  }

  rateProduct() {
    if (this.rating && this.productId.length > 0) {
      const data = { rating: this.rating };
      const separatedIds = this.productId.map((ids) => ids.split(','));

      separatedIds.forEach((id) => {
        this.http
          .post(`http://localhost:3000/api/products/${id}/rate`, data)
          .subscribe(
            (response) => {
              console.log(
                `Ocena za proizvod ${id} je uspešno dodata:`,
                response
              );
              this.dialogRef.close({ success: true });
            },
            (error) => {
              console.error(
                `Greška prilikom dodavanja ocene za proizvod ${id}:`,
                error
              );
              this.dialogRef.close({ success: false });
            }
          );
      });
      // this.http
      //   .put(`http://localhost:3000/products/${this.productId}/rate`, data)
      //   .subscribe(
      //     (response) => {
      //       console.log('Ocena je uspešno dodata:', response);
      //       this.dialogRef.close({ success: true });
      //     },
      //     (error) => {
      //       console.error('Greška prilikom dodavanja ocene:', error);
      //       // Dodajte logiku za prikazivanje poruke o grešci korisniku
      //       this.dialogRef.close({ success: false });
      //     }
      //   );
    }
  }
}
