import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
import { RpsComponent } from './rps.component';

describe('RpsComponent', () => {
  let component: RpsComponent;
  let fixture: ComponentFixture<RpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RpsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
