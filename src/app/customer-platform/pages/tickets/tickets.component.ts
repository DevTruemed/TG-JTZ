import { Component, OnInit } from '@angular/core';
import { TicketModel } from '../../../core/models/tickets.model';
import { TicketsService } from '../../../core/services/tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  tickets: TicketModel[] = [];

  height: number = screen.height - 165;

  constructor(private ticketsService: TicketsService) { }

  ngOnInit(): void {
    this.ticketsService.getTickets("platform").subscribe(tickets => {
      this.tickets = tickets;
    })
  }

}
