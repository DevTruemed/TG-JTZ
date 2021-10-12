import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ProveedorModel } from 'src/app/core/models/catalogos.models';
import { ProveedoresService } from 'src/app/core/services/proveedores.service';
import { SidebarComponent } from 'src/app/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {

  //@ts-ignore
  @ViewChild('sideBar', { static: false }) sideBar: SidebarComponent;

  proveedores: ProveedorModel[];

  height: number = screen.height - 165;

  constructor(private proveedoresService: ProveedoresService,
    private router: Router) {

    this.proveedores = [];

  }

  ngOnInit(): void {

    this.proveedoresService.getProveedores().subscribe(proveedores => this.proveedores = proveedores);

  }

  public add(): void{
    this.router.navigate(['/catalogs','suppliers','form']);
  }

  public desactive(index: number): void{
    this.proveedoresService.desactiveProveedor(this.proveedores[index].id).subscribe(() => this.proveedores.splice(index,1));
  }

  public openSideBar(): void {
    this.sideBar.isOpen = true;
  }

}
