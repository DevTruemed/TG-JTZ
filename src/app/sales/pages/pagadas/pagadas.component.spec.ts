import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagadasComponent } from './pagadas.component';

describe('PagadasComponent', () => {
  let component: PagadasComponent;
  let fixture: ComponentFixture<PagadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PagadasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
