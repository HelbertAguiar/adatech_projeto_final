import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaForm } from './agenda-form';

describe('AgendaForm', () => {
  let component: AgendaForm;
  let fixture: ComponentFixture<AgendaForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendaForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
