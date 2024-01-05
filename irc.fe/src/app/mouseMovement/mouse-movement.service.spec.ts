import { TestBed } from '@angular/core/testing';

import { MouseMovementService } from './mouse-movement.service';

describe('MouseMovementService', () => {
  let service: MouseMovementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MouseMovementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
