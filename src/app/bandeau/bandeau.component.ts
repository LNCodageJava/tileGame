import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.scss'],
})
export class BandeauComponent implements OnInit {
  @Input() player1: any;
  @Input() player2: any;
  @Input() tuileActive: any;
  constructor() {}

  ngOnInit(): void {}
}
