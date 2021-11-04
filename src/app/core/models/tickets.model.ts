import { ContratoModel } from './contratos.model';
export class TicketModel {

    id: number;

    contrato: ContratoModel;

    descripcion: string;

    estatus: string;

    estado: number;

    monto: number;

    observacion: string;

    fechaSolicitud: string;

    idPropiedad: number;

    constructor() {

        this.id = 0;

        this.contrato = new ContratoModel();

        this.descripcion = '';

        this.estatus = '';

        this.estado = 0;

        this.monto = 0;

        this.observacion = '';

        this.fechaSolicitud = '';

        this.idPropiedad = 0;

    }

}