import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ExampleTextComponent } from './example-text.component';

describe('ExampleTextComponent', () => {
  let component: ExampleTextComponent;
  let fixture: ComponentFixture<ExampleTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ ExampleTextComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
