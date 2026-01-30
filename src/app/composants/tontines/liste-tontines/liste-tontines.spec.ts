import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeTontines } from './liste-tontines';

describe('ListeTontines', () => {
  let component: ListeTontines;
  let fixture: ComponentFixture<ListeTontines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeTontines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeTontines);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
