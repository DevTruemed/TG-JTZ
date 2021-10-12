import { CuentaContableModel, EstatusModel, ProveedorModel } from "./catalogos.models";
import { ProductoModel } from "./catalogos.models";

export class OrdenCompraModel{

    id: number;

    importe: number;

    importeAutorizado: number;

    factura: string;

    observaciones: ObservacionOC[];

    estatus: EstatusModel;

    proveedor: ProveedorModel;

    cuentaContable: CuentaContableModel;

    archivo: any;

    productos: OCProucto[];

    constructor(){
        this.id = 0;

        this.importe = 0;

        this.importeAutorizado = 0;

        this.factura = '';

        this.observaciones = [];

        this.estatus = new EstatusModel();

        this.proveedor = new ProveedorModel();

        this.cuentaContable = new CuentaContableModel();

        this.productos = [];
    }

}

export class OCProucto{

    costo: number;

    cantidad: number;

    cantidadAutorizada: number;

    cantidadRevisada: number;

    revisado: boolean;

    autorizado: boolean;

    producto: ProductoModel;

    constructor(){

        this.costo = 0;

        this.cantidad = 0;

        this.cantidadAutorizada = 0;

        this.cantidadRevisada = 0;

        this.revisado = false;

        this.autorizado = false;

        this.producto = new ProductoModel();

    }

}

export class ObservacionOC{

    id: number;

    observacion: string;

    fecha: Date;

    user: string

    constructor(){
        this.id = 0;
        this.observacion = '';
        this.fecha = new Date();
        this.user = '';
    }

}

export class CxpModel{

    id: number; 

    sugerido: boolean; 

    autorizado: boolean; 

    monto: number;

    fecha: Date;

    status: string;

    factura: string; 

    idOrden: number; 

    proveedor: string ;

    constructor (){

        this.id = 0;

        this.sugerido = false;

        this.autorizado = false;

        this.factura = '';

        this.idOrden = 0;

        this.proveedor = '';

        this.monto = 0;

        this.fecha = new Date();

        this.status = '';

    }

}