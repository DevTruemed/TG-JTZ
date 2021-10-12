import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Input()
  nombreModulo: string = '';

  @Output()
  sideBar: EventEmitter<true> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  openSideBar(): void{
    this.sideBar.emit(true);
  }

}
