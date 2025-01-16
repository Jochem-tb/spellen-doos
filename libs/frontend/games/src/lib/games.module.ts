import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UiModule } from '@spellen-doos/ui';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WaitScreenComponent } from './waitScreen/waitScreen.component';
import { RpsComponent } from './rps/rps.component';
import { BingoComponent } from './bingo/bingo.component';

@NgModule({
  imports: [CommonModule, RouterModule, HttpClientModule, UiModule],
  declarations: [WaitScreenComponent, RpsComponent, BingoComponent],
  exports: [WaitScreenComponent, RpsComponent, BingoComponent],
})
export class GamesModule {}
