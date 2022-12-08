import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeasonalDealsComponent } from './seasonal-deals.component';

describe('SeasonalDealsComponent', () => {
  let component: SeasonalDealsComponent;
  let fixture: ComponentFixture<SeasonalDealsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeasonalDealsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeasonalDealsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
