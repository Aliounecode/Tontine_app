import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeMembres } from './liste-membres';

describe('ListeMembres', () => {
  let component: ListeMembres;
  let fixture: ComponentFixture<ListeMembres>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeMembres]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeMembres);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
