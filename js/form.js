(() => {
    
    const copy = (element) => {
        element.select();
        document.execCommand('copy');
    }

    const form = document.forms['pdf-form'];
    
    const outputFACELElement = document.querySelector('#outputInsertFACEL');
    outputFACELElement.parentElement.querySelector('button')
        .addEventListener('click', () => copy(outputFACELElement));

    const outputNOTACREDITOElement = document.querySelector('#outputInsertNOTACREDITO');
    outputNOTACREDITOElement.parentElement.querySelector('button')
        .addEventListener('click', () => copy(outputNOTACREDITOElement));
    

    form.addEventListener('submit', event => {

        event.preventDefault();

        const

            pdfLines = form.elements['pdf-text'].value.trim().split('\n'),
            pdfLine86 = pdfLines[85].split(' '),
            currentDate = new Date(),
            
            codigo_estacion     = form.elements['codigo-estacion'].value.trim(),
            type_document_id    = '2',
            prefix              = pdfLine86[5],
            resolution          = pdfLines[81],
            resolution_date     = new Date(pdfLines[40].split(' ')[0]),
            type_resolution     = `RESOLUCION FACEL ${resolution_date.getFullYear()}-A`,
            type_dispenser      = '0',
            resolution_dateText = resolution_date.toISOString().split('T')[0],
            from                = pdfLine86[6].replaceAll(',', ''),
            to                  = pdfLine86[7].replaceAll(',', ''),
            cons_actual         = from,
            date_fromText       = resolution_dateText,
            vigencia            = Number(pdfLine86[8]),
            date_to             = new Date(resolution_date.setMonth(resolution_date.getMonth() + vigencia)),
            date_toText         = date_to.toISOString().split('T')[0],
            created_atText      = currentDate.toISOString()
                .replace('T', ' ')
                .replace('Z', '')
                .split('.')[0],
            updated_atText      = created_atText,
            visible             = '1'

        ;
        
        const queryFACEL = `
            INSERT INTO \`ticketsoft_${codigo_estacion}\`.\`resoluciones\` (
                \`id\`, 
                \`codigo_estacion\`,
                \`type_document_id\`,
                \`prefix\`,
                \`resolution\`,
                \`type_resolution\`,
                \`type_dispenser\`,
                \`resolution_date\`,
                \`from\`,
                \`to\`,
                \`cons_actual\`,
                \`date_from\`,
                \`date_to\`,
                \`created_at\`,
                \`updated_at\`,
                \`visible\`)
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
        outputFACELElement.value = queryFACEL

        const queryNOTACREDITO = `
            INSERT INTO \`ticketsoft_${codigo_estacion}\`.\`resoluciones\` (
                \`id\`,
                \`codigo_estacion\`,
                \`type_document_id\`,
                \`prefix\`,
                \`resolution\`,
                \`type_resolution\`,
                \`type_dispenser\`,
                \`resolution_date\`,
                \`from\`,
                \`to\`,
                \`cons_actual\`,
                \`date_from\`,
                \`date_to\`,
                \`created_at\`,
                \`updated_at\`,
                \`visible\`
            )
            VALUES (
                null,
                '${codigo_estacion}',
                '7',
                'NOTC',
                '987',
                'NOTA CREDITO ${currentDate.getFullYear()}',
                '0',
                '${resolution_dateText}',
                '1',
                '1000',
                '1',
                '${resolution_dateText}',
                '2030-01-19',
                '${created_atText}',
                '${updated_atText}',
                '${visible}'
            );
        `.trim();
        outputNOTACREDITOElement.value = queryNOTACREDITO
        
        if (form.elements['copyAfterGenerate'].checked) {
            
            const temporalInput = document.createElement('input');
            temporalInput.id = 'temporalInput';
            temporalInput.value = queryFACEL + '\n' +  queryNOTACREDITO;
            document.body.appendChild(temporalInput);
            const temporalInputDOM = document.querySelector('#' + temporalInput.id);
            copy(temporalInputDOM);
            document.body.removeChild(temporalInputDOM);
            
        }

    });

})();