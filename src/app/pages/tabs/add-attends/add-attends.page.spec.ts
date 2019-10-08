import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAttendsPage } from './add-attends.page';

describe('AddAttendsPage', () => {
  let component: AddAttendsPage;
  let fixture: ComponentFixture<AddAttendsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAttendsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAttendsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
