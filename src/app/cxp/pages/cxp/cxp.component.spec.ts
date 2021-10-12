import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CxpComponent } from './cxp.component';

describe('CxpComponent', () => {
  let component: CxpComponent;
  let fixture: ComponentFixture<CxpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CxpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CxpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
