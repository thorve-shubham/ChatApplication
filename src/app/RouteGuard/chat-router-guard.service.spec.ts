import { TestBed } from '@angular/core/testing';

import { ChatRouterGuardService } from './chat-router-guard.service';

describe('ChatRouterGuardService', () => {
  let service: ChatRouterGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatRouterGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
