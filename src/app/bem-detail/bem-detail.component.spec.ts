import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BemDetailComponent } from './bem-detail.component';

describe('BemDetailComponent', () => {
  let component: BemDetailComponent;
  let fixture: ComponentFixture<BemDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BemDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
