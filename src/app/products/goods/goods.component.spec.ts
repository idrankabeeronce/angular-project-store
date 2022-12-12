import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GoodsComponent } from './goods.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('GoodsComponent', () => {
  let component: GoodsComponent;
  let fixture: ComponentFixture<GoodsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ GoodsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoodsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
