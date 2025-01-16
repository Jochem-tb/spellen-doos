import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame } from '@spellen-doos/shared/api';
import { DashBoardService } from './dashboard.service';

@Component({
  selector: 'lib-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashBoardComponent implements OnInit {
  availableGames: IGame[] = [];

  constructor(private dashBoardService: DashBoardService) {}

  ngOnInit(): void {
    // this.dashBoardService.getGames().subscribe((games) => {
    //   this.availableGames = games;
    // });

    this.dashBoardService.getGamesApi().subscribe((games) => {
      this.availableGames = games;
      console.log('games from api:' + games);
      this.availableGames = games;
    });
  }
}
