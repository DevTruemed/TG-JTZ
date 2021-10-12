import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProveedoresComponent } from './form-proveedores.component';

describe('FormProveedoresComponent', () => {
  let component: FormProveedoresComponent;
  let fixture: ComponentFixture<FormProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormProveedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
