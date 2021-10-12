import { ClienteModel, EstatusModel } from "./catalogos.models";
import { ProductoModel } from "./catalogos.models";

export class VentaModel{

    id: number;

    importe: number;

    vendedor: string;

    fecha: Date | null;

    fechaCreacion: Date;

    estatus: EstatusModel;

    cliente: ClienteModel;

    observaciones: ObservacionModel[];

    folioCotizacion: number | null;

    folioFactura: number | null;
    
    montoAbonos: number | null;

    productos: ProductoVentaModel[];

    constructor(){

        this.id = 0;

        this.importe = 0;

        this.vendedor = '';

        this.fecha = null;
        
        this.fechaCreacion = new Date();

        this.folioCotizacion = null;

        this.montoAbonos = null;

        this.folioFactura = null;

        this.estatus = new EstatusModel();

        this.cliente = new ClienteModel();

        this.observaciones = [];

        this.productos = [];
    }

}

export class ObservacionModel{

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

export class ProductoVentaModel{

    costo: number;

    cantidad: number;

    producto: ProductoModel;

    constructor(){

        this.costo = 0;

        this.cantidad = 0;

        this.producto = new ProductoModel();
        
    }

}