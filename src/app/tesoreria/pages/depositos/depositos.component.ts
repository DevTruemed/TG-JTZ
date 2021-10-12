import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { BancoModel, ClienteModel } from 'src/app/core/models/catalogos.models';
import { VentaModel } from 'src/app/core/models/ventas.model';
import { BancosService } from 'src/app/core/services/bancos.service';
import { ClientesService } from 'src/app/core/services/clientes.service';
import { VentasService } from 'src/app/core/services/ventas.service';

@Component({
  selector: 'app-depositos',
  templateUrl: './depositos.component.html',
  styleUrls: ['./depositos.component.css']
})
export class DepositosComponent implements OnInit {

  formulario!: FormGroup;

  selectBank: BancoModel = new BancoModel();

  cliente: ClienteModel = new ClienteModel();

  facturas: VentaModel[] = [];

  bancos: BancoModel[] = [];

  clientes: ClienteModel[] = [];

  abonosRealizados: any[] = [];

  abonosCancelados: any[] = [];

  estatus: string = 'Creating...'

  height: number = screen.height - 165;

  width: number = screen.width;

  update: boolean = false;

  constructor(private bancosService: BancosService,
    private clientesService: ClientesService,
    private ventasService: VentasService,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router) {

      this.inicializarFormulario();

      if (this.activeRoute.snapshot.params.id)
        this.update = true;

  }

  ngOnInit(): void {

    if ( this.update )
      this.bancosService.getDeposito(this.activeRoute.snapshot.params.id).subscribe(res => {console.log(res);
      
        this.estatus = res.status;

        this.clientes.push( res.cliente );
        this.selectCliente(0);

        let banco = new BancoModel();
        banco.banco = res.banco;
        this.bancos.push(banco);
        this.selectBanco(0);

        this.formulario.get('id')?.setValue(res.id);
        this.formulario.get('monto')?.setValue(res.monto);
        this.formulario.get('fecha')?.setValue(res.fecha);

        //@ts-ignore
        res.abonos.forEach(abono => {
          if ( abono.estatus === 'CANCELED' )
            this.abonosCancelados.push(abono);
          else if (abono.venta.importe === abono.venta.montoAbonos)
            this.abonosRealizados.push(abono);
        });
      
      })

    else{
      this.bancosService.getBancos().subscribe(bancos => {
      
        this.bancos = bancos;
        
        if (this.bancos && this.bancos.length > 0)
          this.selectBanco(0)
      
      });

      this.clientesService.getClientes().subscribe(clientes => {
        
        this.clientes = clientes;
        if ( this.clientes && this.clientes.length > 0 )
          this.selectCliente(0);

      })
    }
  }

  get ventasForm(): FormArray{
    return this.formulario.get('ventas') as FormArray;
  }

  public selectCliente(index: number): void{
    this.cliente = this.clientes[index]
    this.formulario.get('cliente')?.setValue(this.cliente.id);
    this.ventasService.getVentas('INVOICED', this.cliente.id).subscribe(ventas => this.facturas = ventas.content);
    this.ventasForm.controls.forEach(() => this.ventasForm.removeAt(0));
  }

  public selectBanco(index: number): void{
    this.selectBank = this.bancos[index]
    this.formulario.get('banco')?.setValue(this.selectBank.id);
  }

  public getImporte(): number{

    let importe = 0;
    this.ventasForm.controls.forEach(control => {
      importe += control.get('monto')?.value;
    });
    
    this.formulario.get('monto')?.setValue(importe);

    return importe;
  }

  public addInvoice(index: number): void{

    let factura: VentaModel = this.facturas[index];

    this.ventasForm.push(this.fb.group({
      id: [factura.id],
      folioFactura: [factura.folioFactura],
      fecha: [factura.fecha],
      importe: [factura.importe],
      montoAbonos: [factura.montoAbonos],
      monto: [0]
    }))

    this.facturas.splice(index,1);

  }

  public removeInvoice(index: number): void{
    this.facturas.push(this.ventasForm.at(index).value);
    this.ventasForm.removeAt(index);
  }

  public depositar(): void{
    console.log(this.ventasForm.value)

    if (!this.update)
      this.ventasService.depositar(this.formulario.value).subscribe(() => this.router.navigate(['/sales','invoices']));
    else
      this.bancosService.addAbonos(this.ventasForm.value, this.formulario.get('id')?.value).subscribe(() => this.router.navigate(['/catalogs','banks']));

  }

  private inicializarFormulario(): void {

    this.formulario = this.fb.group({
      id: [],
      monto: [0],
      banco: [],
      cliente: [],
      fecha: [new Date()],
      ventas: this.fb.array([])
    });

  }

}
