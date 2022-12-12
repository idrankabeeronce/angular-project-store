import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { VacanciesComponent } from './vacancies.component';

describe('VacanciesComponent', () => {
  let component: VacanciesComponent;
  let fixture: ComponentFixture<VacanciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ VacanciesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VacanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
