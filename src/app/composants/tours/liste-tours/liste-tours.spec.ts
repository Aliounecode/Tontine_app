import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTours } from './liste-tours';

describe('ListeTours', () => {
  let component: ListeTours;
  let fixture: ComponentFixture<ListeTours>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeTours]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeTours);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
