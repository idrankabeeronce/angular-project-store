import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealsHomeComponent } from './deals-home.component';

describe('DealsHomeComponent', () => {
  let component: DealsHomeComponent;
  let fixture: ComponentFixture<DealsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DealsHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DealsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
