import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.scss'],
})
export class BandeauComponent implements OnInit {
  @Input() player: any;
  @Input() tuileActive: any;
  constructor() {}

  ngOnInit(): void {}
}
