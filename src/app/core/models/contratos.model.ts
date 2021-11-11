import { PropiedadModel, ClienteModel, TipoContratoModel, DocumentoModel, BancoModel, ProveedorModel } from './catalogos.models';
import { TicketModel } from './tickets.model';
export class ContratoModel {

    id: number;

    propiedad: PropiedadModel;

    cliente: ClienteModel;

    tipo: TipoContratoModel;

    monto: number;

    diasPago: number;

    fechaInicio: string;

    fechaTermino: string;

    fechaEmision: string;

    documentacion: DocumentoModel[];

    pagos: PagoContratoModel[];

    depositos: PagoContratoModel[];

    tickets: TicketModel[];

    constructor() {

        this.id = 0;

        this.propiedad = new PropiedadModel();

        this.cliente = new ClienteModel();

        this.tipo = new TipoContratoModel();

        this.monto = 0;

        this.diasPago = 0;

        this.fechaInicio = '';

        this.fechaTermino = '';

        this.fechaEmision = '';

        this.documentacion = [];

        this.pagos = [];

        this.depositos = [];

        this.tickets = [];

    }
}

export class PagoContratoModel {

    id: number;

    contrato: ContratoModel;

    proveedor: ProveedorModel;

    banco: BancoModel;

    monto: number;

    concepto: string;

    tipoEntrada: number;

    fechaEmision: string;

    constructor() {

        this.id = 0;

        this.contrato = new ContratoModel();

        this.proveedor = new ProveedorModel();

        this.banco = new BancoModel();

        this.monto = 0;

        this.concepto = '';

        this.tipoEntrada = 1;

        this.fechaEmision = '';

    }
}