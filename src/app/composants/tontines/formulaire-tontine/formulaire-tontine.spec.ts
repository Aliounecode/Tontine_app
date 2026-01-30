import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireTontine } from './formulaire-tontine';

describe('FormulaireTontine', () => {
  let component: FormulaireTontine;
  let fixture: ComponentFixture<FormulaireTontine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireTontine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireTontine);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
