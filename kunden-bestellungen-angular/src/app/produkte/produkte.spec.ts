import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Produkte } from './produkte';

describe('Produkte', () => {
  let component: Produkte;
  let fixture: ComponentFixture<Produkte>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Produkte],
    }).compileComponents();

    fixture = TestBed.createComponent(Produkte);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
