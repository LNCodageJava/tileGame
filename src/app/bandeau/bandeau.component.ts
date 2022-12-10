import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bandeau',
  templateUrl: './bandeau.component.html',
  styleUrls: ['./bandeau.component.scss'],
})
export class BandeauComponent implements OnInit {
  @Input() adjCounter: number = 0;
  @Input() points: number = 0;
  @Input() total: number = 0;
  constructor() {}

  ngOnInit(): void {}
}
