import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOrdenCompraComponent } from './form-orden-compra.component';

describe('FormOrdenCompraComponent', () => {
  let component: FormOrdenCompraComponent;
  let fixture: ComponentFixture<FormOrdenCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormOrdenCompraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOrdenCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
