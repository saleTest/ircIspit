import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MouseSimulationComponent } from './mouse-simulation.component';

describe('MouseSimulationComponent', () => {
  let component: MouseSimulationComponent;
  let fixture: ComponentFixture<MouseSimulationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MouseSimulationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MouseSimulationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
