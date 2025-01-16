import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BingoTutorialComponent } from './bingoTutorial.component';

describe('BingoTutorialComponent', () => {
  let component: BingoTutorialComponent;
  let fixture: ComponentFixture<BingoTutorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BingoTutorialComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BingoTutorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
