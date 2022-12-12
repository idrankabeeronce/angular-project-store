import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AddToCartService } from './add-to-cart.service';

describe('AddToCartService', () => {
  let service: AddToCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AddToCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
