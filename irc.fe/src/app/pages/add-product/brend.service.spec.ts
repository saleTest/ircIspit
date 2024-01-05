import { TestBed } from '@angular/core/testing';

import { BrendService } from './brend.service';

describe('BrendService', () => {
  let service: BrendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BrendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
