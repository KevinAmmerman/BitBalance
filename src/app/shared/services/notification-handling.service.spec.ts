import { TestBed } from '@angular/core/testing';

import { NotificationHandlingService } from './notification-handling.service';

describe('NotificationHandlingService', () => {
  let service: NotificationHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
