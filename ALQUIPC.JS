 let datosFacturaActual = {}; // Objeto para guardar la info temporalmente

        document.getElementById('billingForm').addEventListener('submit', function(e) {
            e.preventDefault();

            // Capturar datos del cliente
            let nombre = document.getElementById('nombreCliente').value.trim();
            let apellido = document.getElementById('apellidoCliente').value.trim();
            let correo = document.getElementById('correoCliente').value.trim();
            let errorCorreoDiv = document.getElementById('errorCorreo');

            // Validación estricta del correo (debe contener '@')
            if (!correo.includes('@') || correo.indexOf('@') === 0 || correo.indexOf('@') === correo.length - 1) {
                errorCorreoDiv.style.display = "block";
                document.getElementById('correoCliente').style.borderColor = "var(--error-color)";
                document.getElementById('correoCliente').focus();
                return;
            } else {
                errorCorreoDiv.style.display = "none";
                document.getElementById('correoCliente').style.borderColor = "var(--border-color)";
            }

            // Capturar datos de alquiler
            let cantidad_equipos = parseInt(document.getElementById('cantidadEquipos').value);
            let dias_iniciales = parseInt(document.getElementById('diasIniciales').value);
            let dias_adicionales = parseInt(document.getElementById('diasAdicionales').value);
            let opcion_ubicacion = parseInt(document.getElementById('opcionUbicacion').value);

            if (cantidad_equipos < 2) {
                alert("El alquiler requiere un mínimo de 2 equipos.");
                return;
            }

            let id_cliente = "CLI-" + Math.floor(1000 + Math.random() * 9000);

            const VALOR_DIA_EQUIPO = 35000;
            let total_dias = dias_iniciales + dias_adicionales;
            let subtotal_base = cantidad_equipos * total_dias * VALOR_DIA_EQUIPO;

            let ajuste_ubicacion = 0;
            let nombre_opcion = "";

            if (opcion_ubicacion === 1) {
                nombre_opcion = "Dentro de la ciudad";
                ajuste_ubicacion = 0;
            } else if (opcion_ubicacion === 2) {
                nombre_opcion = "Fuera de la ciudad";
                ajuste_ubicacion = subtotal_base * 0.05;
            } else if (opcion_ubicacion === 3) {
                nombre_opcion = "Dentro del establecimiento";
                ajuste_ubicacion = -(subtotal_base * 0.05);
            }

            let porcentaje_descuento_adicional = Math.min(dias_adicionales * 0.02, 0.20);
            let descuento_adicionales_valor = subtotal_base * porcentaje_descuento_adicional;
            let valor_total = subtotal_base + ajuste_ubicacion - descuento_adicionales_valor;

            const formatoMoneda = (valor) => "$" + valor.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});

            // Guardar datos en la variable global para el envío de correo
            datosFacturaActual = {
                id: id_cliente,
                nombre: `${nombre} ${apellido}`,
                correo: correo,
                total: formatoMoneda(valor_total)
            };

            // Rellenar datos en la interfaz del comprobante
            document.getElementById('resClienteID').textContent = id_cliente;
            document.getElementById('resNombreCompleto').textContent = datosFacturaActual.nombre;
            document.getElementById('resCorreo').textContent = correo;
            document.getElementById('resUbicacion').textContent = nombre_opcion;
            document.getElementById('resEquipos').textContent = cantidad_equipos;
            document.getElementById('resDiasIni').textContent = dias_iniciales;
            document.getElementById('resDiasAd').textContent = dias_adicionales;
            document.getElementById('resTotalDias').textContent = total_dias;
            document.getElementById('resSubtotal').textContent = formatoMoneda(subtotal_base);

            let rowAjuste = document.getElementById('rowAjuste');
            if (opcion_ubicacion === 2) {
                rowAjuste.style.display = "flex";
                document.getElementById('labelAjuste').textContent = "Incremento Domicilio (5%):";
                document.getElementById('resAjuste').textContent = "+" + formatoMoneda(ajuste_ubicacion);
            } else if (opcion_ubicacion === 3) {
                rowAjuste.style.display = "flex";
                document.getElementById('labelAjuste').textContent = "Descuento Local (5%):";
                document.getElementById('resAjuste').textContent = "-" + formatoMoneda(Math.abs(ajuste_ubicacion));
            } else {
                rowAjuste.style.display = "none";
            }

            let rowDescuentoAd = document.getElementById('rowDescuentoAd');
            if (dias_adicionales > 0) {
                rowDescuentoAd.style.display = "flex";
                document.getElementById('labelDescAd').textContent = `Descuento Días Adicionales (${porcentaje_descuento_adicional * 100}%):`;
                document.getElementById('resDescAd').textContent = "-" + formatoMoneda(descuento_adicionales_valor);
            } else {
                rowDescuentoAd.style.display = "none";
            }

            document.getElementById('resTotal').textContent = formatoMoneda(valor_total);

            // Ocultar mensaje previo de envío y mostrar factura
            document.getElementById('mensajeEnvio').style.display = "none";
            document.getElementById('invoiceSection').style.display = "block";
            document.getElementById('invoiceSection').scrollIntoView({ behavior: 'smooth' });
        });

        // Evento para simular el envío por correo al hacer clic en el botón verde
        document.getElementById('btnEnviarCorreo').addEventListener('click', function() {
            let mensaje = document.getElementById('mensajeEnvio');
            mensaje.style.display = "block";
            mensaje.textContent = `⏳ Enviando factura a ${datosFacturaActual.correo}...`;

            setTimeout(() => {
                mensaje.textContent = `✅ ¡Factura (ID: ${datosFacturaActual.id}) enviada exitosamente a ${datosFacturaActual.correo}!`;
            }, 1000);
        });