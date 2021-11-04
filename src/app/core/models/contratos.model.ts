import { PropiedadModel, ClienteModel, TipoContratoModel, DocumentoModel } from './catalogos.models';
import { TicketModel } from './tickets.model';
export class ContratoModel {

    id: number;

    propiedad: PropiedadModel;

    cliente: ClienteModel;

    tipo: TipoContratoModel;

    monto: number;

    fechaInicio: string;

    fechaTermino: string;

    fechaEmision: string;

    documentacion: DocumentoModel[];

    pagos: PagoContratoModel[];

    tickets: TicketModel[];

    constructor() {

        this.id = 0;

        this.propiedad = new PropiedadModel();

        this.cliente = new ClienteModel();

        this.tipo = new TipoContratoModel();

        this.monto = 0;

        this.fechaInicio = '';

        this.fechaTermino = '';

        this.fechaEmision = '';

        this.documentacion = [];

        this.pagos = [];

        this.tickets = [];

    }
}

export class PagoContratoModel {

    id: number;

    contrato: ContratoModel;

    monto: number;

    concepto: string;

    fechaEmision: string;

    constructor() {

        this.id = 0;

        this.contrato = new ContratoModel();

        this.monto = 0;

        this.concepto = '';

        this.fechaEmision = '';

    }
}