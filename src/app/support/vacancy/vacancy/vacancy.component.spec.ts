import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VacancyComponent } from './vacancy.component';

describe('VacancyComponent', () => {
  let component: VacancyComponent;
  let fixture: ComponentFixture<VacancyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ VacancyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
