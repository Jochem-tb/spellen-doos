import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IGame } from '@spellen-doos/shared/api';

@Component({
  selector: 'lib-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashBoardComponent {
  availableGames: IGame[] = [
    {
      name: 'Game 1',
      shortDescription: 'This is game1',
      cardImage:
        'https://media.discordapp.net/attachments/1318178971803717632/1318912803112747048/zdenek-machacek-l1vfj2y13tk-unsplash_1.jpg?ex=6764b584&is=67636404&hm=affdf4e2aab4bd6db3f8e6455e5fbf30d418282583481607c4eafaaff2571dfa&=&format=webp&width=771&height=671',
    },
    {
      name: 'Game 2',
      shortDescription: 'This is game2',
      cardImage:
        'https://media.discordapp.net/attachments/1318178971803717632/1318912803112747048/zdenek-machacek-l1vfj2y13tk-unsplash_1.jpg?ex=6764b584&is=67636404&hm=affdf4e2aab4bd6db3f8e6455e5fbf30d418282583481607c4eafaaff2571dfa&=&format=webp&width=771&height=671',
    },
    {
      name: 'Game 3',
      shortDescription: 'This is game3',
      cardImage:
        'https://media.discordapp.net/attachments/1318178971803717632/1318912803112747048/zdenek-machacek-l1vfj2y13tk-unsplash_1.jpg?ex=6764b584&is=67636404&hm=affdf4e2aab4bd6db3f8e6455e5fbf30d418282583481607c4eafaaff2571dfa&=&format=webp&width=771&height=671',
    },
  ];
}
