import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormulaireUtilisateur } from './formulaire-utilisateur';

describe('FormulaireUtilisateur', () => {
  let component: FormulaireUtilisateur;
  let fixture: ComponentFixture<FormulaireUtilisateur>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormulaireUtilisateur]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormulaireUtilisateur);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
