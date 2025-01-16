import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameTutorialComponent } from './gameTutorial.component';

describe('GameTutorialComponent', () => {
  let component: GameTutorialComponent;
  let fixture: ComponentFixture<GameTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameTutorialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GameTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
