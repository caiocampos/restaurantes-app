import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DynaviewComponent } from './dynaview.component';

describe('DynaviewComponent', () => {
  let component: DynaviewComponent;
  let fixture: ComponentFixture<DynaviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DynaviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynaviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
