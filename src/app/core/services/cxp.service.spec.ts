import { TestBed } from '@angular/core/testing';

import { CxpService } from './cxp.service';

describe('CxpService', () => {
  let service: CxpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CxpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
