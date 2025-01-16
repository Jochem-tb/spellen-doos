import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RpsTutorialComponent } from './rpsTutorial.component';

describe('RpsTutorialComponent', () => {
  let component: RpsTutorialComponent;
  let fixture: ComponentFixture<RpsTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpsTutorialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RpsTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
