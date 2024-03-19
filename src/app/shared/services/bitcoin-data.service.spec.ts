import { TestBed } from '@angular/core/testing';

import { BitcoinDataService } from './bitcoin-data.service';

describe('BitcoinDataService', () => {
  let service: BitcoinDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BitcoinDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
