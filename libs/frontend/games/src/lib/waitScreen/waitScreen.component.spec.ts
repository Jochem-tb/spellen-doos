import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WaitScreenComponent } from './waitScreen.component';

describe('WaitScreenComponent', () => {
  let component: WaitScreenComponent;
  let fixture: ComponentFixture<WaitScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitScreenComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WaitScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
