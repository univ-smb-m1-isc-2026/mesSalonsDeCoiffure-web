import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Salons } from './salons';

describe('Salons', () => {
  let component: Salons;
  let fixture: ComponentFixture<Salons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Salons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Salons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
