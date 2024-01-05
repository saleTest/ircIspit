import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateOrderDialogComponent } from './update-order-dialog.component';

describe('UpdateOrderDialogComponent', () => {
  let component: UpdateOrderDialogComponent;
  let fixture: ComponentFixture<UpdateOrderDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateOrderDialogComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpdateOrderDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
