export class PropiedadModel {

    id: number;

    terreno: number;

    terrenoConstruido: number;

    descripcion: string;

    estacionamientos: number;

    banos: number;

    recamaras: number;

    noPisos: number;

    piso: number;

    numeroExterior: string;

    numeroInterior: string;

    direccion: string;

    estado: string;

    renta: number;

    venta: number;

    cortarDetalle: boolean = true;

    habitaciones: number;

    cp: string;

    pais: string;

    tipo: TipoModel;

    estatus: EstatusModel;

    imagenes: ImagenModel[];

    productos: ProductoModel[];

    aseguradora: AseguradoraModel;

    impuestos: PropiedadImpuestoModel[];

    documentacion: DocumentoModel[];

    constructor() {

        this.id = 0;

        this.terreno = 0;

        this.terrenoConstruido = 0;

        this.descripcion = '';

        this.estacionamientos = 0;

        this.banos = 0;

        this.recamaras = 0;

        this.noPisos = 0;

        this.piso = 0;

        this.numeroExterior = '';

        this.numeroInterior = '';

        this.direccion = '';

        this.estado = '';

        this.cp = '';

        this.pais = '';

        this.tipo = new TipoModel();

        this.estatus = new EstatusModel();

        this.imagenes = [];

        this.productos = [];

        this.renta = 0;

        this.venta = 0;

        this.habitaciones = 0;

        this.aseguradora = new AseguradoraModel();

        this.impuestos = [];

        this.documentacion = [];

    }

}

export class ProductoModel {

    id: number;

    producto: string;

    descripcion: string;

    precio: number;

    existencia: number | null;

    estatus: EstatusModel;

    cuenta: CuentaContableModel;

    propiedad: PropiedadModel;

    constructor() {

        this.id = 0;

        this.producto = '';

        this.descripcion = '';

        this.precio = 0;

        this.existencia = null;

        this.estatus = new EstatusModel();

        this.cuenta = new CuentaContableModel();

        this.propiedad = new PropiedadModel();
    }


}

export class ImagenModel {

    id: number;

    ruta: string;

    tipo: string;

    constructor() {

        this.id = 0;

        this.tipo = '';

        this.ruta = '';

    }

}

export class CuentaContableModel {

    id: number;

    cuenta: string;

    codigo: number;

    ingreso: boolean;

    padre: CuentaContableModel | null = null;

    constructor() {

        this.id = 0;

        this.cuenta = '';

        this.codigo = 0;

        this.ingreso = true;

    }

}

export class ClienteModel {

    id: number;

    cliente: string;

    telefono: string;

    correo: string;

    contacto: string;

    direccion: string;

    saldo: number;

    documentacion: DocumentoModel[];

    constructor() {

        this.id = 0;

        this.cliente = '';

        this.telefono = '';

        this.correo = '';

        this.contacto = '';

        this.direccion = '';

        this.saldo = 0;

        this.documentacion = [];

    }

}

export class BancoModel {

    id: number;

    banco: string;

    cuenta: number;

    saldo: number;

    constructor() {

        this.id = 0;

        this.banco = '';

        this.cuenta = 0;

        this.saldo = 0;

    }

}

export class TipoModel {

    id: number;

    tipo: string;

    constructor() {

        this.id = 0;

        this.tipo = '';

    }

}

export class EstatusModel {

    id: number;

    estatus: string;

    constructor() {

        this.id = 0;

        this.estatus = '';

    }

}

export class ProveedorModel {

    id: number;

    proveedor: string;

    telefono: string;

    correo: string;

    contacto: string;

    direccion: string;

    pais: string;

    rfc: string;

    cuentasContables: CuentaContableModel[];

    productos: ProveedorProductoModel[];

    tiposPago: {
        informacion: string,
        tipo: TipoModel
    }[] = [];

    constructor() {

        this.id = 0;

        this.proveedor = '';

        this.telefono = '';

        this.correo = '';

        this.contacto = '';

        this.pais = '';

        this.rfc = '';

        this.direccion = '';

        this.cuentasContables = [];

        this.productos = [];

    }

}

export class ProveedorProductoModel {

    producto: ProductoModel;

    precio: number;

    constructor() {

        this.producto = new ProductoModel();

        this.precio = 0;

    }

}

export class AseguradoraModel {

    id: number;

    nombre: string;

    paginaWeb: string;

    nombreContacto: string;

    correoContacto: string;

    telefonoContacto: string;

    constructor() {

        this.id = 0;

        this.nombre = '';

        this.paginaWeb = '';

        this.nombreContacto = '';

        this.correoContacto = '';

        this.telefonoContacto = '';

    }

}

export class PropiedadImpuestoModel {

    id: number;

    propiedad: PropiedadModel;

    monto: number;

    fechaImpuesto: string;

    fechaRegistro: string;

    constructor() {
        this.id = 0;

        this.propiedad = new PropiedadModel();

        this.monto = 0;

        this.fechaImpuesto = '';

        this.fechaRegistro = '';
    }

}

export class TipoDocumentoModel {

    id: number;

    nombre: string;

    descripcion: string;

    constructor() {

        this.id = 0;

        this.nombre = '';

        this.descripcion = '';
    }
}

export class DocumentoModel {

    id: number;

    tipo: TipoDocumentoModel;

    modelo: string;

    ruta: string;

    nombre: string;

    extension: string;

    fechaCreacion: string;

    constructor() {
        this.id = 0;

        this.tipo = new TipoDocumentoModel();

        this.modelo = '';

        this.ruta = '';

        this.nombre = '';

        this.extension = '';

        this.fechaCreacion = '';
    }
}