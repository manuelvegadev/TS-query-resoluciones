(() => {
    
    const copy = (element) => {
        element.select();
        document.execCommand('copy');
    }

    const form = document.forms['pdf-form'];
    
    const outputFACELElement = document.querySelector('#outputInsertFACEL');
    outputFACELElement.parentElement.querySelector('button')
        .addEventListener('click', () => copy(outputFACELElement));
    
    const columns = [
        {name: 'id',                 manual: false, defaultValue: 'null',       label: null},
        {name: 'codigo_estacion',    manual: true,  defaultValue: null,         label: null},
        {name: 'type_document_id',   manual: false, defaultValue: '2',          label: null},
        {name: 'prefix',             manual: true,  defaultValue: null,         label: null},
        {name: 'resolution',         manual: true,  defaultValue: null,         label: null},
        {name: 'type_resolution',    manual: false, defaultValue: '(generado)', label: null},
        {name: 'type_dispenser',     manual: true,  defaultValue: '0',          label: null},
        {name: 'resolution_date',    manual: true,  defaultValue: null,         label: null},
        {name: 'vigencia',           manual: true,  defaultValue: null,         label: null},
        {name: 'technical_key',      manual: false, defaultValue: 'null',       label: null},
        {name: 'from',               manual: true,  defaultValue: null,         label: null},
        {name: 'to',                 manual: true,  defaultValue: null,         label: null},
        {name: 'cons_actual',        manual: false, defaultValue: '(generado)', label: null},
        {name: 'date_from',          manual: false, defaultValue: '(generado)', label: null},
        {name: 'date_to',            manual: false, defaultValue: '(generado)', label: null},
        {name: 'state',              manual: false, defaultValue: 'null',       label: null},
        {name: 'codigo_comprobante', manual: false, defaultValue: 'null',       label: null},
        {name: 'created_at',         manual: false, defaultValue: '(generado)', label: null},
        {name: 'updated_at',         manual: false, defaultValue: '(generado)', label: null},
        {name: 'visible',            manual: false, defaultValue: '1',          label: null},
        {name: 'last_id_bandas',     manual: true,  defaultValue: null,         label: 'El último "cod_banda" de la tabla "resoluciones_documentos_bandas"'},
        {name: 'nota_credito',       manual: true,  defaultValue: '0',          label: 'Número Nota Crédito (cod_documento)'}
    ];
    
    
    const formID = form.id
    
    // Insert inputs
    columns.forEach(column => {
        
        const id = `${formID}_${column.name}`;
        
        form.lastElementChild.insertAdjacentHTML('beforebegin', `
            <div class="col s12 sm6">
                <label for="${id}">${column.label || column.name}</label>
                <input 
                    type="text" 
                    name="${column.name}" 
                    id="${id}" 
                    required 
                    ${column.manual ? '' : 'readonly'}
                    value="${column.defaultValue || ''}"
                >
            </div>
        `)
        
    });
    
    
    
    
    

    form.addEventListener('submit', event => {

        event.preventDefault();
        
        const
            
            inputValue = name => form.elements[name].value.trim(),
            currentDate = new Date(),
            
            codigo_estacion     = inputValue('codigo_estacion'),
            type_document_id    = inputValue('type_document_id'),
            prefix              = inputValue('prefix'),
            resolution          = inputValue('resolution'),
            resolution_date     = new Date(inputValue('resolution_date')),
            type_resolution     = `RESOLUCION FACEL ${resolution_date.getFullYear()}-A`,
            type_dispenser      = inputValue('type_dispenser'),
            resolution_dateText = resolution_date.toISOString().split('T')[0],
            from                = inputValue('from'),
            to                  = inputValue('to'),
            cons_actual         = from,
            date_fromText       = resolution_dateText,
            vigencia            = Number(inputValue('vigencia')),
            date_to             = new Date(resolution_date.setMonth(resolution_date.getMonth() + vigencia)),
            date_toText         = date_to.toISOString().split('T')[0],
            created_atText      = currentDate.toISOString()
                .replace('T', ' ')
                .replace('Z', '')
                .split('.')[0],
            updated_atText      = created_atText,
            visible             = '1'

        ;

        const db = `ticketsoft_${codigo_estacion}`;
        
        const queryFACEL = `
            INSERT INTO ${db}.resoluciones (
    id, 
    codigo_estacion,
    type_document_id,
    prefix,
    resolution,
    type_resolution,
    type_dispenser,
    resolution_date,
    \`from\`,
    \`to\`,
    cons_actual,
    date_from,
    date_to,
    created_at,
    updated_at,
    visible)
VALUES (
    null,
    '${codigo_estacion}',
    '${type_document_id}',
    '${prefix}',
    '${resolution}',
    '${type_resolution}',
    '${type_dispenser}',
    '${resolution_dateText}',
    '${from}',
    '${to}',
    '${cons_actual}',
    '${date_fromText}',
    '${date_toText}',
    '${created_atText}',
    '${updated_atText}',
    '${visible}'
);
`.trim();

        
        
        
        
        
        // Queries resoluciones_documentos_bandas
        
        const  tipoElementos = {
            1: [
                {tipo: 'TEXTO', contenido: '<p><span style="font-size: 8pt;">Regimen Comun</span></p>', posicion: '{"top":141,"left":227}', resize: 'SI', size: '{"width":385,"height":48}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><span style="font-size: 8pt;">No somos grandes contribuyentes ni autorretenedores</span></p>', posicion: '{"top":81,"left":226}', resize: 'SI', size: '{"width":385,"height":48}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><span style="font-size: 8pt;">Actividad Economica 4731 - 4732</span></p>', posicion: '{"top":22,"left":227}', resize: 'SI', size: '{"width":345,"height":31}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: left;"><strong>Factura Electronica de Venta No:</strong></p>', posicion: '{"top":-127,"left":226}', resize: 'SI', size: '{"width":285,"height":46}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: right;">#cabecera-num_documento#</p>', posicion: '{"top":-173,"left":255}', resize: 'SI', size: '{"width":285,"height":48}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: left;"><strong>Fecha Documento:</strong></p>', posicion: '{"top":-202,"left":226}', resize: 'SI', size: '{"width":245,"height":3}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: right;">#cabecera-fecha_documento#</p>', posicion: '{"top":-205,"left":257}', resize: 'SI', size: '{"width":285,"height":48}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: left;"><strong>Estado Documento:</strong></p>', posicion: '{"top":-237,"left":226}', resize: 'SI', size: '{"width":285,"height":48}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: right;">#cabecera-estado_documento#</p>', posicion: '{"top":-285,"left":257}', resize: 'SI', size: '{"width":285,"height":48}', visible: '1'},
                {tipo: 'CODQR', contenido: '#codigo_qr#', posicion: '{"top":-360,"left":540}', resize: 'NO', size: '{"width":250,"height":250}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Num. Resolucion:</strong> #resolucion-num_resolucion#&nbsp;<strong>Prefijo:</strong> #resolucion-prefijo#&nbsp;<strong>Cons:</strong>&nbsp;Del #resolucion-cons_inicial# hasta&nbsp;#resolucion-cons_final# <strong>Fecha:</strong> Desde #resolucion-fecha_inicio# hasta&nbsp;#resolucion-fecha_fin#</p>', posicion: '{"top":-464,"left":226}', resize: 'SI', size: '{"width":305,"height":31}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Codigo Cufe:</strong> #cabecera-codigo_cufe#</p>', posicion: '{"top":-381,"left":0}', resize: 'SI', size: '{"width":705,"height":23}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Fecha y Hora de Reporte DIAN:</strong> #cabecera-fecha_hora_reporte#</p>', posicion: '{"top":-365,"left":0}', resize: 'SI', size: '{"width":610,"height":26}', visible: '1'},
                {tipo: 'IMAGEN', contenido: 'https://facturacion.ticketsoftcolombia.com/assets/images/facturacion/logotipos/LOGO_9010.jpg', posicion: '{"top":-579,"left":0}', resize: 'SI', size: '{"width":250,"height":250}', visible: '1'},
            ],
            2: [
                {tipo: 'TEXTO', contenido: '<p style="text-align: center;"><span style="font-size: 14pt;"><strong><span style="font-family: arial, helvetica, sans-serif;">DATOS DEL EMISOR</span></strong></span></p>', posicion: '{"top":18,"left":0}', resize: 'SI', size: '{"width":375,"height":25}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: center;"><strong><span style="font-family: arial, helvetica, sans-serif; font-size: 14pt;">DATOS DEL ADQUIRIENTE</span></strong></p>', posicion: '{"top":-8,"left":387}', resize: 'SI', size: '{"width":360,"height":25}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Razon Social / Nombre:</strong> #cliente-nombre#</p>', posicion: '{"top":-5,"left":372}', resize: 'SI', size: '{"width":375,"height":28}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Num. Documento:</strong> #cliente-num_documento# -&nbsp;#cliente-tipo_documento#</p>', posicion: '{"top":7,"left":372}', resize: 'SI', size: '{"width":375,"height":25}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Direccion:</strong> #cliente-direccion#</p>', posicion: '{"top":58,"left":373}', resize: 'SI', size: '{"width":375,"height":30}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Telefono:</strong> #cliente-telefono#</p>', posicion: '{"top":58,"left":373}', resize: 'SI', size: '{"width":375,"height":29}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Email:</strong>&nbsp;#cliente-email#</p>', posicion: '{"top":-28,"left":372}', resize: 'SI', size: '{"width":375,"height":29}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Razon Social / Nombre:</strong>&nbsp;#emisor-nombre#</p>', posicion: '{"top":-147,"left":0}', resize: 'SI', size: '{"width":340,"height":32}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Direccion:</strong>&nbsp;#emisor-direccion#</p>', posicion: '{"top":-71,"left":0}', resize: 'SI', size: '{"width":335,"height":32}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Email:</strong>&nbsp;#emisor-email#</p>', posicion: '{"top":-139,"left":0}', resize: 'SI', size: '{"width":375,"height":46}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Num. Documento:</strong>&nbsp;#emisor-num_documento# -&nbsp;#emisor-tipo_documento#</p>', posicion: '{"top":-221,"left":0}', resize: 'SI', size: '{"width":375,"height":47}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Telefono:</strong>&nbsp;#emisor-telefono#</p>', posicion: '{"top":-168,"left":0}', resize: 'SI', size: '{"width":335,"height":27}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: center;"><strong><span style="font-family: arial, helvetica, sans-serif;">DETALLE DEL DOCUMENTO</span></strong></p>', posicion: '{"top":-163,"left":51}', resize: 'SI', size: '{"width":665,"height":31}', visible: '1'},
            ],
            3: [
                {tipo: 'TABLA', contenido: '#servicio-cantidad-vlr_unitario-vlr_descuento-porc_iva-vlr_total#', posicion: '{"top":0,"left":0}', resize: 'NO', size: '{"width":1198,"height":50}', visible: '1'}
            ],
            4: [
                {tipo: 'TEXTO', contenido: '<p style="text-align: left;"><strong>Vlr. Bruto:</strong>&nbsp;</p>', posicion: '{"top":0,"left":367}', resize: 'SI', size: '{"width":190,"height":34}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: right;">#detalle-vlr_bruto# $</p>', posicion: '{"top":-36,"left":557}', resize: 'SI', size: '{"width":190,"height":35}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Vlr. Iva:</strong>&nbsp;</p>', posicion: '{"top":-48,"left":367}', resize: 'SI', size: '{"width":190,"height":34}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: right;">#detalle-vlr_iva# $</p>', posicion: '{"top":-85,"left":557}', resize: 'SI', size: '{"width":190,"height":35}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Vlr. Rte. Fte:&nbsp;</strong></p>', posicion: '{"top":-98,"left":367}', resize: 'SI', size: '{"width":190,"height":36}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: right;">#detalle-vlr_rte_fte# $</p>', posicion: '{"top":-137,"left":557}', resize: 'SI', size: '{"width":190,"height":32}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p><strong>Vlr. Total:</strong>&nbsp;</p>', posicion: '{"top":-143,"left":367}', resize: 'SI', size: '{"width":190,"height":34}', visible: '1'},
                {tipo: 'TEXTO', contenido: '<p style="text-align: right;">#detalle-vlr_total# $</p>', posicion: '{"top":-181,"left":557}', resize: 'SI', size: '{"width":190,"height":39}', visible: '1'},
            ],
            5: [
                {tipo: 'TEXTO', contenido: '<p style="text-align: center;"><span style="color: #333399;"><span style="font-size: 8pt;">ESTABLECIMIENTO&nbsp;EL PORTAL DE MONTERREY S.A.S. -&nbsp;</span><span style="font-size: 8pt;">EDS EDS TIJUANA - Calle 4 no. 2-104 - Caguan</span><span style="font-size: 8pt;">&nbsp;- Neiva,&nbsp;</span><span style="font-size: 8pt;">Palermo, Huila, Colombia. El emisor de esta factura es responsable por la totalidad de los datos contenidos en ella.</span></span></p>', posicion: '{"top":0,"left":18}', resize: 'SI', size: '{"width":705,"height":48}', visible: '1'}
            ]
        }

        const subquery = `(SELECT id FROM ${db}.resoluciones WHERE resolution = '${resolution}')`;
        const notaCredito = inputValue('nota_credito');
        
        const resoluciones_bandas = [
            {tipo: 'FIJA',     cod_documento: subquery,    size: '{"width":738,"height":247}', visible: '1', isNotaCredito: false, elementos: tipoElementos[1]},
            {tipo: 'FIJA',     cod_documento: subquery,    size: '{"width":745,"height":240}', visible: '1', isNotaCredito: false, elementos: tipoElementos[2]},
            {tipo: 'DINAMICA', cod_documento: subquery,    size: '{"width":745,"height":13}',  visible: '1', isNotaCredito: false, elementos: tipoElementos[3]},
            {tipo: 'FIJA',     cod_documento: subquery,    size: '{"width":745,"height":103}', visible: '1', isNotaCredito: false, elementos: tipoElementos[4]},
            {tipo: 'FIJA',     cod_documento: subquery,    size: '{"width":747,"height":61}',  visible: '1', isNotaCredito: false, elementos: tipoElementos[5]},
            
            {tipo: 'FIJA',     cod_documento: notaCredito, size: '{"width":738,"height":247}', visible: '1', isNotaCredito: true,  elementos: tipoElementos[1]},
            {tipo: 'FIJA',     cod_documento: notaCredito, size: '{"width":745,"height":240}', visible: '1', isNotaCredito: true,  elementos: tipoElementos[2]},
            {tipo: 'DINAMICA', cod_documento: notaCredito, size: '{"width":745,"height":13}',  visible: '1', isNotaCredito: true,  elementos: tipoElementos[3]},
            {tipo: 'FIJA',     cod_documento: notaCredito, size: '{"width":745,"height":103}', visible: '1', isNotaCredito: true,  elementos: tipoElementos[4]},
            {tipo: 'FIJA',     cod_documento: notaCredito, size: '{"width":747,"height":61}',  visible: '1', isNotaCredito: true,  elementos: tipoElementos[5]},
        ];
        
        
        
        

        let queryBandas = `INSERT INTO ${db}.resoluciones_documentos_bandas (
    cod_banda,
    cod_documento,
    tipo,
    size,
    posicion,
    visible
) VALUES `;

        let queryElementos = `INSERT INTO ${db}.resoluciones_documentos_elementos (
    cod_elemento,
    cod_banda,
    tipo,
    contenido,
    posicion,
    resize,
    size,
    visible
) VALUES `;
        
        let lastNotNotaCredito = 0

        resoluciones_bandas.forEach((banda, indexBanda) => {

            if (!banda.isNotaCredito) lastNotNotaCredito = indexBanda;
            const codigoBanda = Number(inputValue('last_id_bandas')) + indexBanda + 1;
            // resoluciones_bandas[indexBanda] = codigoBanda;
            
            queryBandas += ` (
    ${codigoBanda},
    ${banda.cod_documento},
    '${banda.tipo}',
    '${banda.size}',
    ${banda.isNotaCredito ? (indexBanda + 1 - (lastNotNotaCredito + 1)) : (indexBanda + 1)},
    ${banda.visible}
)${(indexBanda + 1) === resoluciones_bandas.length ? ';' : ', '}

`.trim() + ' \n' + ((indexBanda + 1) === resoluciones_bandas.length ? '\n' : '');
            
            
            banda.elementos.forEach(elemento => {
                
                return queryElementos += ` (
    null,
    ${codigoBanda},
    '${elemento.tipo}',
    '${elemento.contenido}',
    '${elemento.posicion}',
    '${elemento.resize}',
    '${elemento.size}',
    ${elemento.visible}
),
    
`.trim() + '\n';
                
            });
            
            
        });

        outputFACELElement.value = queryFACEL + '\n' + queryBandas + '\n' + queryElementos.slice(0, -2) + ';';

        
        if (form.elements['copyAfterGenerate'].checked) {

            const temporalInput = document.createElement('textarea');
            temporalInput.id = 'temporalInput';
            temporalInput.value = outputFACELElement.value;
            document.body.appendChild(temporalInput);
            const temporalInputDOM = document.querySelector('#' + temporalInput.id);
            copy(temporalInputDOM);
            document.body.removeChild(temporalInputDOM);

        }
        

    });
    
    
    
    
    
    
    

})();