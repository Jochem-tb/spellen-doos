import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashBoardComponent } from './dashboard.component';

describe('WelcomeComponent', () => {
  let component: DashBoardComponent;
  let fixture: ComponentFixture<DashBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashBoardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
