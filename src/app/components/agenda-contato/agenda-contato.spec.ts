import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaContato } from './agenda-contato';

describe('AgendaContato', () => {
  let component: AgendaContato;
  let fixture: ComponentFixture<AgendaContato>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AgendaContato]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaContato);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
