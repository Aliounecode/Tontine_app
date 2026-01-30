import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsTontine } from './details-tontine';

describe('DetailsTontine', () => {
  let component: DetailsTontine;
  let fixture: ComponentFixture<DetailsTontine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsTontine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsTontine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
