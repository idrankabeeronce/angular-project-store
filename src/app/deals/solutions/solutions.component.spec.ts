import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Solutions } from './solutions.component';

describe('SeasonalDealsComponent', () => {
  let component: Solutions;
  let fixture: ComponentFixture<Solutions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Solutions ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Solutions);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
