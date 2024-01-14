import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { AppModule } from '../../app.module';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-update-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    AppModule,
    MaterialModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MaterialModule,

    // FormsModule,
  ],

  providers: [],
  templateUrl: './update-order-dialog.component.html',
  styleUrl: './update-order-dialog.component.css',
})
export class UpdateOrderDialogComponent implements OnInit {
  protected form!: FormGroup;
  protected description!: string;
  private id: any;
  protected address: any;
  protected phone!: number;
  protected name!: string;
  // protected quantity!: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialogRef: MatDialogRef<UpdateOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.id = data.id;
    this.description = data.title;
    // console.log(this.data);
  }

  ngOnInit() {
    // this.form.addControl('name', this.fb.control(this.name));
    // this.form.addControl('address', this.fb.control(this.address));
    // this.form.addControl('phone', this.fb.control(this.phone));

    this.form = this.fb.group({
      name: ['', Validators.required],
      address: ['', Validators.required],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9]{9,13}$/)],
      ],
      items: this.fb.array([]),
    });

    if (this.data && this.data.items) {
      const itemsArray = this.form.get('items') as FormArray;

      this.data.items.forEach((item: any) => {
        itemsArray.push(this.createItemFormGroup(item));
      });
    }

    // vrednosti ako postoje
    if (this.data) {
      this.form.patchValue({
        name: this.data.name || '',
        address: this.data.address || '',
        phone: this.data.phone || '',
      });
    }
  }

  getItemsControls(): AbstractControl[] {
    return (this.form.get('items') as FormArray)?.controls || [];
  }

  createItemFormGroup(item: any): FormGroup {
    // console.log(item.product.name);
    return this.fb.group({
      quantity: [
        item.quantity || '',
        [Validators.required, Validators.pattern(/^[1-9]\d*$/)],
      ],
      nameProduct: [item.product.name || '', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  updateOrder(): void {
    const token = localStorage.getItem('token');

    if (!token) {
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // const updatedData = {
    //   name: this.form.value.name,
    //   address: this.form.value.address,
    //   phone: this.form.value.phone,
    // };

    let updatedData: any;
    let confirmation;

    if (this.data.status != 'u toku') {
      confirmation = window.confirm('Do you want to reactivate the order?');
    }

    if (confirmation) {
      // console.log(this.data.status);
      updatedData = {
        ...this.form.value,
        items: this.form.value.items.map((item: any, index: number) => ({
          ...item,
          product: this.data.items[index].product,
        })),
        status: (this.data.status = 'u toku'),
      };
      // console.log('Status porudžbine je ažuriran');
    } else {
      // console.log('Nije promenjen status porudžbine');
      updatedData = {
        ...this.form.value,
        items: this.form.value.items.map((item: any, index: number) => ({
          ...item,
          product: this.data.items[index].product,
        })),
      };
    }
    console.log(updatedData);
    this.http
      .patch(
        `http://localhost:3000/api/updateOrderedProduct/${this.id}`,
        updatedData,
        { headers }
      )
      .subscribe(
        (response) => {
          console.log('Order updated successfully!', response);
          // Zatvorite dijalog nakon uspješnog ažuriranja
          this.dialogRef.close(true);
        },
        (error) => {
          console.error('Error updating order:', error);
          // Ovdje možete obraditi grešku, prikazati poruku korisniku, itd.
        }
      );
  }
}
