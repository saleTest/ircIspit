import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatingDialogComponent } from './product-rating-dialog.component';

describe('ProductRatingDialogComponent', () => {
  let component: ProductRatingDialogComponent;
  let fixture: ComponentFixture<ProductRatingDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductRatingDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductRatingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
