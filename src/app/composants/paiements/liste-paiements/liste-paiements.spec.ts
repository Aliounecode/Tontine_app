import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListePaiements } from './liste-paiements';

describe('ListePaiements', () => {
  let component: ListePaiements;
  let fixture: ComponentFixture<ListePaiements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListePaiements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListePaiements);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
