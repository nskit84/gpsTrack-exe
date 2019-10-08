import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendsPage } from './attends.page';

describe('AttendsPage', () => {
  let component: AttendsPage;
  let fixture: ComponentFixture<AttendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
