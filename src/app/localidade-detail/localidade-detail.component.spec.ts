import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalidadeDetailComponent } from './localidade-detail.component';

describe('LocalidadeDetailComponent', () => {
  let component: LocalidadeDetailComponent;
  let fixture: ComponentFixture<LocalidadeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalidadeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalidadeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
