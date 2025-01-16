import { ComponentFixture, TestBed } from '@angular/core/testing';
<<<<<<<< HEAD:libs/frontend/features/src/lib/auth/login/login.component.spec.ts
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
========
import { RpsComponent } from './rps.component';

describe('RpsComponent', () => {
  let component: RpsComponent;
  let fixture: ComponentFixture<RpsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RpsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RpsComponent);
>>>>>>>> development:libs/frontend/games/src/lib/rps/rps.component.spec.ts
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
