import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoleComponent } from './sole.component';

describe('SoleComponent', () => {
  let component: SoleComponent;
  let fixture: ComponentFixture<SoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
