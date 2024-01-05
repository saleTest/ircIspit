import { TestBed } from '@angular/core/testing';

import { RasaServiceService } from './rasa-service.service';

describe('RasaServiceService', () => {
  let service: RasaServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RasaServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
