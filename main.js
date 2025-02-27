//-------------------------
//        TABLERO
//-------------------------


function crearTablero() {
    const tablero = document.querySelector(".tablero");

    for(let fila = 0; fila < 8; fila++){
        for(let columna = 0; columna < 8; columna++){
            const casilla = document.createElement("div");
            casilla.classList.add("casilla")
            casilla.id = `${fila}${columna}`;
            //ASIGNO CASILLAS CLARAS Y OSCURAS
            if ((fila + columna) % 2 === 0){
                casilla.classList.add("casilla-clara")
            } else {
                casilla.classList.add("casilla-oscura")
            }
            tablero.appendChild(casilla);
        }
    }
    
}

function actualizarTablero(tableroArray, bandera){
    
    //AGREGO PIEZAS
    let pieza = "";
    const tablero = document.querySelector('.tablero');
    //SI YA FUERON CREADAS POR PRIMERA VEZ LAS PIEZAS, SE ELIMINAN TODOS LOS IMG
    if (bandera) {
        let piezasAActualizar = document.querySelectorAll(".pieza");
        piezasAActualizar.forEach(pieza => {
            pieza.remove();
        });
    }
        
    //Pongo las piezas
    for(let fila = 0; fila < 8; fila++){
        for(let columna = 0; columna < 8; columna++){
            pieza = tableroArray[fila][columna];
            const casilla = document.querySelector(".casilla")
            if (pieza){
                const img = document.createElement('img');
                img.classList.add(pieza[1] === "b" ? "blanco" : "negro");
                img.classList.add("pieza");
                img.classList.add(pieza);
                img.src = `piezas/${pieza}.png`;
                img.alt = pieza;
                casilla.appendChild(img);
            }
            tablero.appendChild(casilla);
        }
    }
    if(esMotorBlanco){
        rotarPieza();
    }
}

function hacerCopiaTablero(){
    let copiaMatriz = JSON.parse(JSON.stringify(tableroVolatilPiezas));
    return copiaMatriz;
}

// function hacerStringDeTablero(tableroArray){
//     strResu = "";
//     for(let f=0; f<8; f++){
//         for(let c=0; c<8; c++){
//             if(tableroArray[f][c]){
//                 strResu += tableroArray[f][c];
//             } else {
//                 strResu += "vacio";
//             }
//         }
//     }
//     return strResu;
// }
function hacerStringDeTablero(tableroArray) {
    let strResu = ""; // Inicializar el string resultante
    for (let f = 0; f < 8; f++) {
        for (let c = 0; c < 8; c++) {
            if (tableroArray[f][c] === "") {
                strResu += "vacio "; // Agregar "vacio" si la casilla está vacía
            } else {
                strResu += tableroArray[f][c] + " "; // Agregar el contenido de la casilla
            }
        }
        strResu += "\n"; // Agregar un salto de línea al final de cada fila
    }
    return strResu; // Retornar el string resultante
}
//------------------------------------
// MOVER PIEZAS EN EL TABLERO INTERNO
//------------------------------------
function moverPieza(posInicial, posFinal, tablero) {
    // Convertir las posiciones a índices numéricos
    const fInicial = Number(posInicial[0]); // Fila inicial
    const cInicial = Number(posInicial[1]); // Columna inicial
    const fFinal = Number(posFinal[0]);     // Fila final
    const cFinal = Number(posFinal[1]);     // Columna final

    // Verificar si las coordenadas son válidas
    if (
        isNaN(fInicial) || isNaN(cInicial) || isNaN(fFinal) || isNaN(cFinal) ||
        fInicial < 0 || fInicial > 7 || cInicial < 0 || cInicial > 7 ||
        fFinal < 0 || fFinal > 7 || cFinal < 0 || cFinal > 7
    ) {
        console.error("Coordenadas inválidas:", posInicial, posFinal);
        return tablero; // No hacer nada si las coordenadas son inválidas
    }

    // Verificar si la casilla de destino contiene una pieza enemiga
    if (tablero[fFinal][cFinal] !== "") {
        console.log("Captura de pieza enemiga!");
    }

    // Mover la pieza en el tablero lógico
    tablero[fFinal][cFinal] = tablero[fInicial][cInicial];
    tablero[fInicial][cInicial] = "";

    return tablero;
}

function realizarCapturaAlPaso(posInicial, posFinal, tablero){
    const xInicial = Number(posInicial[0]); 
    const yInicial = Number(posInicial[1]); 
    const xFinal = Number(posFinal[0]);     
    const yFinal = Number(posFinal[1]);     

    tablero[xFinal][yFinal] = tablero[xInicial][yInicial];  //Muevo el peon a su casilla destino
    tablero[xInicial][yInicial] = "";  //Elimino el peon que estaba seleccionado
    tablero[xInicial][yFinal] = "";  //Elimino el peon que quedo al paso
    return tablero;
}

function realizarEnroque(posInicial, posFinal, tablero) {
    const xInicial = Number(posInicial[0]);
    const yInicial = Number(posInicial[1]);
    const xFinal = Number(posFinal[0]);
    const yFinal = Number(posFinal[1]);

    //Determino si es enroque largo o corto
    const esEnroqueLargo = yInicial > yFinal;

    //Muevo el rey
    tablero[xFinal][yFinal] = tablero[xInicial][yInicial];
    tablero[xInicial][yInicial] = "";

    //Muevo la torre
    const torreYInicial = esEnroqueLargo ? yInicial - 4 : yInicial + 3;
    const torreYFinal = esEnroqueLargo ? yInicial - 1 : yInicial + 1;
    moverPieza(`${xInicial}${torreYInicial}`, `${xInicial}${torreYFinal}`, tablero);

    return tablero;
}

function realizarPromocion(pieza, posInicial, posFinal, tableroArray){
    removerContenedorPromocion();
    let fInicial = Number(posInicial[0]);
    let cInicial = Number(posInicial[1]);
    let fFinal = Number(posFinal[0]);
    let cFinal = Number(posFinal[1]);

    tableroArray[fInicial][cInicial] = "";
    tableroArray[fFinal][cFinal] = pieza; 
    permitirMovimiento = true;
    console.log("estoy realizando la promocion");
    return tableroArray;
}

// ---------------------------
//     EVENT LISTENERS
//----------------------------

//SELECCIONAR PIEZA
function seleccionarPieza(){
    //this es la pieza o img 
    if(!permitirMovimiento){
        return;
    }
    //
    console.log("ENTRASTE A SELECCIONAR PIEZA");
    let banderaTrueSiBlanco = this.classList.contains("blanco");
    let movimientosLegales;
    let posibleCapturaAlPaso;
    let posiblesEnroques = [];
    if((banderaTurnoBlancas && banderaTrueSiBlanco) || (!banderaTurnoBlancas && !banderaTrueSiBlanco)) {
        if(piezaSeleccionada){
            piezaSeleccionada.classList.remove("seleccionada");
            const casillasDestinoPosible = document.querySelectorAll(".destinoPosible");
            casillasDestinoPosible.forEach(casilla => {
                casilla.classList.remove("destinoPosible");
            });
        }
        posicionSeleccionada = this.parentElement.id;
        piezaSeleccionada = this;
        piezaSeleccionada.classList.add("seleccionada");
        console.log("pieza seleccionada!");

        //PEONES (NEGROS Y BLANCOS)
        if (piezaSeleccionada.classList[2][0] === "p"){
            movimientosLegales = validarMovimientosPeon(posicionSeleccionada, banderaTrueSiBlanco, tableroVolatilPiezas);
            posibleCapturaAlPaso = validarCapturaAlPaso(posicionSeleccionada, banderaTrueSiBlanco);
        } else if(piezaSeleccionada.classList[2][0] === "c"){
            movimientosLegales = validarMovimientosCaballo(posicionSeleccionada, banderaTrueSiBlanco, tableroVolatilPiezas);
        } else if(piezaSeleccionada.classList[2][0] === "a"){
            movimientosLegales = validarMovimientosAlfil(posicionSeleccionada, banderaTrueSiBlanco, tableroVolatilPiezas);
        } else if(piezaSeleccionada.classList[2][0] === "t"){
            movimientosLegales = validarMovimientosTorre(posicionSeleccionada, banderaTrueSiBlanco, tableroVolatilPiezas);
        } else if(piezaSeleccionada.classList[2][0] === "d"){
            movimientosLegales = validarMovimientosDama(posicionSeleccionada, banderaTrueSiBlanco, tableroVolatilPiezas);
        } else if(piezaSeleccionada.classList[2][0] === "r"){
            movimientosLegales = validarMovimientosRey(posicionSeleccionada, banderaTrueSiBlanco, tableroVolatilPiezas);
            posiblesEnroques = validarEnroque(posicionSeleccionada, banderaTrueSiBlanco, tableroVolatilPiezas, arrayBanderasEnroque);
        }
        //console.log(movimientosLegales);
        movimientosLegales.forEach(movimiento => {
            if(movimientoPosible(posicionSeleccionada, movimiento, banderaTurnoBlancas)){
                let casillaDestinoPosible = document.getElementById(movimiento);
                if(casillaDestinoPosible){
                    casillaDestinoPosible.classList.add("destinoPosible");
                }
                //CORONACION
                if(piezaSeleccionada.classList[2][0] === "p" && (movimiento[0] === "0" || movimiento[0] === "7")){
                    casillaDestinoPosible.classList.add("posibleCoronacion");
                }
            }// }else {
            //     console.log(movimiento, "este no es posible");
            // }
        })
        //CAPTURA AL PASO
        if(posibleCapturaAlPaso){
            if(movimientoPosible(posicionSeleccionada, posibleCapturaAlPaso, banderaTurnoBlancas)){
                let casillaDestinoPosibleCapturaAlPaso = document.getElementById(posibleCapturaAlPaso);
                if(casillaDestinoPosibleCapturaAlPaso){
                    casillaDestinoPosibleCapturaAlPaso.classList.add("destinoPosible");
                    casillaDestinoPosibleCapturaAlPaso.classList.add("posibleCapturaAlPaso");
                }
            }
        }
        //ENROQUE
        if(posiblesEnroques.length !== 0){
            posiblesEnroques.forEach(enroque =>{
                const casillaDestinoPosibleEnroque = document.getElementById(enroque);
                //revisar si es necesario este if
                if(casillaDestinoPosibleEnroque){
                    casillaDestinoPosibleEnroque.classList.add("destinoPosible");
                    casillaDestinoPosibleEnroque.classList.add("posibleEnroque");
                }
            })
        }
    }
}

async function seleccionarCasilla() {
    const casillaPresionada = this;
    if (casillaPresionada.classList.contains("destinoPosible")) {
        let posicionAMover = casillaPresionada.id;
        //MARCO EL ULTIMO MOVIMIENTO HECHO CON COLORES
        if(casillaInicio && casillaFin){
            casillaInicio.classList.remove("ultimoMovInicio");
            casillaFin.classList.remove("ultimoMovFin");
        }
        casillaInicio = document.getElementById(posicionSeleccionada);
        casillaFin = casillaPresionada;
        casillaInicio.classList.add("ultimoMovInicio");
        casillaFin.classList.add("ultimoMovFin");
        //HAGO UNA COPIA DEL TABLERO PARA LUEGO USARLA EN LA NOTACION
        let copiaTableroVolatil = hacerCopiaTablero();
        let copiaPosSeleccionada = posicionSeleccionada;
        let copiaPosAMover = posicionAMover;
        //BANDERAS MOVS ESPECIALES
        let banderaCapturaAlPaso = false;
        let banderaEnroque = false;
        let banderaPromocion = false;
        let piezaPromocion;
        //muevo la pieza en el tablero interno
        if (casillaPresionada.classList.contains("posibleCapturaAlPaso")) { //SI HAY CAPTURA AL PASO
            tableroVolatilPiezas = realizarCapturaAlPaso(posicionSeleccionada, posicionAMover, tableroVolatilPiezas);
            banderaCapturaAlPaso = true;
        } else if (casillaPresionada.classList.contains("posibleEnroque")) { //SI HAY ENROQUE
            tableroVolatilPiezas = realizarEnroque(posicionSeleccionada, posicionAMover, tableroVolatilPiezas);
            banderaEnroque = true;
        } else if (casillaPresionada.classList.contains("posibleCoronacion")) { //SI HAY CORONACION
            permitirMovimiento = false;
            // Esperar a que el usuario seleccione una pieza de promoción
            const { pieza, tableroArray } = await mostrarPiezasPromocion(posicionSeleccionada, posicionAMover, tableroVolatilPiezas);
            // Realizar la promoción con la pieza seleccionada
            tableroVolatilPiezas = realizarPromocion(pieza, posicionSeleccionada, posicionAMover, tableroArray);
            piezaPromocion = pieza;
            banderaPromocion = true;
        } else { // SI ES UN MOVIMIENTO NORMAL
            tableroVolatilPiezas = moverPieza(posicionSeleccionada, posicionAMover, tableroVolatilPiezas);
        }

        //REGISTRO MOVIMIENTOS DE LOS REYES Y LAS TORRES
        switch(posicionSeleccionada){
            case "00": 
                arrayBanderasEnroque[0][0] = true;
                break;
            case "04":
                arrayBanderasEnroque[0][1] = true;
                break;
            case "07": 
                arrayBanderasEnroque[0][2] = true;
                break;
            case "70":
                arrayBanderasEnroque[1][0] = true;
                break;
            case "74":
                arrayBanderasEnroque[1][1] = true;
                break;
            case "77":
                arrayBanderasEnroque[1][2] = true;
                break;
        }

        //actualizo tablero visual
        actualizarTablero(tableroVolatilPiezas, banderaCreado);
        //Deselecciono la pieza que era seleccionada
        piezaSeleccionada.classList.remove("seleccionada");
        piezaSeleccionada = null;
        //CAMBIO DE TURNO
        banderaTurnoBlancas = !banderaTurnoBlancas;
        console.log("casilla seleccionada y movimiento hecho");
        // SACO EL COLOR DE LAS CASILLAS DESTINO POSIBLE, y las clases de casillas de especial movs
        const casillasDestinoPosible = document.querySelectorAll(".destinoPosible");
        casillasDestinoPosible.forEach(casilla => {
            casilla.classList.remove("destinoPosible");
        });

        const casillaCapturaAlPaso = document.querySelector(".posibleCapturaAlPaso");
        if (casillaCapturaAlPaso) {
            casillaCapturaAlPaso.classList.remove("posibleCapturaAlPaso");
        }

        const casillasEnroque = document.querySelectorAll(".posibleEnroque");
        if (casillasEnroque.length !== 0) {
            casillasEnroque.forEach(casilla => {
                casilla.classList.remove("posibleEnroque");
            });
        }
        const casillasCoronacion = document.querySelectorAll(".posibleCoronacion");
        if(casillasCoronacion.length !== 0){
            casillasCoronacion.forEach(casilla =>{
                casilla.classList.remove("posibleCoronacion");
            })
        }
        //COMPROBACION DE SI HAY JAQUE LUEGO DE MOVER UNA PIEZA
        let banderaJaqueReyNegro = comprobarJaque(true, tableroVolatilPiezas);
        let banderaJaqueReyBlanco = comprobarJaque(false, tableroVolatilPiezas);
        if (banderaJaqueReyBlanco) {
            console.log("Rey blanco en jaque");
        }
        if (banderaJaqueReyNegro) {
            console.log("Rey negro en jaque");
        }
        //COMPROBAR JAQUE MATE
        let banderaJaqueMate;
        if(banderaJaqueReyBlanco || banderaJaqueReyNegro){
            banderaJaqueMate = comprobarJaqueMateOAhogado(banderaTurnoBlancas, tableroVolatilPiezas, true, false);
            if (banderaJaqueMate) {
                banderaTurnoBlancas ? console.log("JAQUE MATE! Negras ganan") : console.log("JAQUE MATE! Blancas ganan");
            }
        }
        
        //ANOTO LOS MOVIMIENTOS EN DOS LISTAS (NOTACION) 
        if (!banderaTurnoBlancas) {
            movimientosBlancas.push(obtenerMovimientoRealizado(copiaPosSeleccionada, copiaPosAMover, copiaTableroVolatil, banderaJaqueReyNegro, banderaJaqueMate, banderaCapturaAlPaso, banderaEnroque, banderaPromocion, piezaPromocion));

        } else {
            movimientosNegras.push(obtenerMovimientoRealizado(copiaPosSeleccionada, copiaPosAMover, copiaTableroVolatil, banderaJaqueReyBlanco, banderaJaqueMate, banderaCapturaAlPaso, banderaEnroque, banderaPromocion, piezaPromocion));
        }

        console.log("BLANCAS: ", movimientosBlancas);
        console.log("NEGRAS: ", movimientosNegras);

        // COMPROBAR TABLAS
        let banderaTablas;
        listaTableroHistorial.push(hacerStringDeTablero(tableroVolatilPiezas));
        banderaTablas = tablas(banderaTurnoBlancas, tableroVolatilPiezas, movimientosBlancas, movimientosNegras, listaTableroHistorial);
        if(banderaTablas){
            console.log("TABLAS!");
        }
        //FIN DEL JUEGO
        if(banderaTablas ||  banderaJaqueMate){
            finalPartida(banderaTurnoBlancas, banderaTablas, banderaJaqueMate);
        }
        //Mostrar fen
        console.log(generateFEN(tableroVolatilPiezas));
        //ACTUALIZO LAS VARIABLES PIEZAS Y CASILLAS PARA QUE PUEDAN VOLVER A SER USADAS
        agregarEventListeners();
    }
}


// function agregarEventListeners(){
//     piezas = document.querySelectorAll(".pieza")
//     casillas = document.querySelectorAll(".casilla");

//     piezas.forEach(pieza => {
//         pieza.addEventListener("click", seleccionarPieza);
        
//         if ((banderaTurnoBlancas && pieza.classList.contains("negro"))||(!banderaTurnoBlancas && pieza.classList.contains("blanco"))){
//             pieza.removeEventListener("click", seleccionarPieza);
//         }
//     })

//     casillas.forEach(casilla =>{
//         casilla.addEventListener("click", seleccionarCasilla);

//         if(casilla.hasChildNodes()){
//             if ((banderaTurnoBlancas && casilla.firstChild.classList.contains("blanco")) || (!banderaTurnoBlancas && casilla.firstChild.classList.contains("negro"))){
//                 casilla.removeEventListener("click", seleccionarCasilla);
//             }
//         }
            
//     })

// };

// function agregarEventListeners() {
//     const piezas = document.querySelectorAll(".pieza");
//     const casillas = document.querySelectorAll(".casilla");

//     piezas.forEach(pieza => {
//         pieza.addEventListener("click", seleccionarPieza);
//         pieza.setAttribute("draggable", true); // Hacer que las piezas sean arrastrables

//         pieza.addEventListener("dragstart", (e) => {
//             if (!permitirMovimiento) {
//                 e.preventDefault(); // Evitar arrastrar si no se permiten movimientos
//                 return;
//             }

//             // Verificar si es el turno del jugador
//             const esPiezaValida = (banderaTurnoBlancas && pieza.classList.contains("blanco")) || 
//                                   (!banderaTurnoBlancas && pieza.classList.contains("negro"));
//             if (!esPiezaValida) {
//                 e.preventDefault(); // Evitar arrastrar si no es el turno del jugador
//                 return;
//             }

//             // Guardar una referencia a la pieza en el objeto de transferencia de datos
//             e.dataTransfer.setData("text/plain", "pieza"); // No necesitamos el ID, solo un identificador
//             e.dataTransfer.setData("pieza", pieza); // Guardar la referencia a la pieza

//             // Simular la selección de la pieza
//             seleccionarPieza.call(pieza); // Llamar a seleccionarPieza con el contexto de la pieza
//         });

//         // Deshabilitar el clic si no es el turno del jugador
//         if ((banderaTurnoBlancas && pieza.classList.contains("negro")) || 
//             (!banderaTurnoBlancas && pieza.classList.contains("blanco"))) {
//             pieza.removeEventListener("click", seleccionarPieza);
//         }
//     });

//     casillas.forEach(casilla => {
//         casilla.addEventListener("click", seleccionarCasilla);

//         casilla.addEventListener("dragover", (e) => {
//             e.preventDefault(); // Permitir soltar la pieza en esta casilla
//         });

//         casilla.addEventListener("drop", (e) => {
//             e.preventDefault();

//             // Obtener la referencia a la pieza desde el objeto de transferencia de datos
//             const pieza = e.dataTransfer.getData("pieza");

//             // Verificar si la pieza existe
//             if (!pieza) {
//                 console.error("No se encontró la pieza arrastrada.");
//                 return;
//             }

//             // Simular la selección de la casilla
//             seleccionarCasilla.call(casilla); // Llamar a seleccionarCasilla con el contexto de la casilla
//         });

//         // Deshabilitar el clic si la casilla tiene una pieza del mismo color
//         if (casilla.hasChildNodes()) {
//             const primeraPieza = casilla.firstChild;
//             if ((banderaTurnoBlancas && primeraPieza.classList.contains("blanco")) || 
//                 (!banderaTurnoBlancas && primeraPieza.classList.contains("negro"))) {
//                 casilla.removeEventListener("click", seleccionarCasilla);
//             }
//         }
//     });
// }

// function agregarEventListeners() {
//     const piezas = document.querySelectorAll(".pieza");
//     const casillas = document.querySelectorAll(".casilla");

//     piezas.forEach(pieza => {
//         pieza.addEventListener("click", seleccionarPieza);
//         pieza.setAttribute("draggable", true);

//         pieza.addEventListener("dragstart", (e) => {
//             if (!permitirMovimiento) {
//                 e.preventDefault();
//                 return;
//             }

//             // Verificar si es el turno del jugador
//             const esPiezaValida = (banderaTurnoBlancas && pieza.classList.contains("blanco")) || 
//                                   (!banderaTurnoBlancas && pieza.classList.contains("negro"));
//             if (!esPiezaValida) {
//                 e.preventDefault();
//                 return;
//             }

//             // Crear un clon de la pieza
//             const clon = pieza.cloneNode(true);
//             clon.id = "pieza-clon"; // Asignar un ID al clon
//             document.body.appendChild(clon);

//             // Posicionar el clon en la posición del cursor
//             clon.style.left = `${e.clientX - clon.offsetWidth / 2}px`;
//             clon.style.top = `${e.clientY - clon.offsetHeight / 2}px`;

//             // Guardar la referencia a la pieza
//             e.dataTransfer.setData("text/plain", "pieza");
//             e.dataTransfer.setData("pieza", pieza);

//             // Simular la selección de la pieza
//             seleccionarPieza.call(pieza);
//         });

//         pieza.addEventListener("dragend", () => {
//             // Eliminar el clon al finalizar el arrastre
//             const clon = document.getElementById("pieza-clon");
//             if (clon) {
//                 clon.remove();
//             }
//         });

//         // Deshabilitar el clic si no es el turno del jugador
//         if ((banderaTurnoBlancas && pieza.classList.contains("negro")) || 
//             (!banderaTurnoBlancas && pieza.classList.contains("blanco"))) {
//             pieza.removeEventListener("click", seleccionarPieza);
//         }
//     });

//     casillas.forEach(casilla => {
//         casilla.addEventListener("click", seleccionarCasilla);

//         casilla.addEventListener("dragover", (e) => {
//             e.preventDefault();

//             // Mover el clon con el cursor
//             const clon = document.getElementById("pieza-clon");
//             if (clon) {
//                 clon.style.left = `${e.clientX - clon.offsetWidth / 2}px`;
//                 clon.style.top = `${e.clientY - clon.offsetHeight / 2}px`;
//             }
//         });

//         casilla.addEventListener("drop", (e) => {
//             e.preventDefault();

//             // Obtener la referencia a la pieza
//             const pieza = e.dataTransfer.getData("pieza");

//             // Verificar si la pieza existe
//             if (!pieza) {
//                 console.error("No se encontró la pieza arrastrada.");
//                 return;
//             }

//             // Simular la selección de la casilla
//             seleccionarCasilla.call(casilla);

//             // Eliminar el clon
//             const clon = document.getElementById("pieza-clon");
//             if (clon) {
//                 clon.remove();
//             }
//         });

//         // Deshabilitar el clic si la casilla tiene una pieza del mismo color
//         if (casilla.hasChildNodes()) {
//             const primeraPieza = casilla.firstChild;
//             if ((banderaTurnoBlancas && primeraPieza.classList.contains("blanco")) || 
//                 (!banderaTurnoBlancas && primeraPieza.classList.contains("negro"))) {
//                 casilla.removeEventListener("click", seleccionarCasilla);
//             }
//         }
//     });
// }

function agregarEventListeners() {
    const piezas = document.querySelectorAll(".pieza");
    const casillas = document.querySelectorAll(".casilla");

    piezas.forEach(pieza => {
        pieza.addEventListener("click", seleccionarPieza);
        pieza.setAttribute("draggable", true);

        pieza.addEventListener("dragstart", (e) => {
            if (!permitirMovimiento) {
                e.preventDefault();
                return;
            }

            // Verificar si es el turno del jugador
            const esPiezaValida = (banderaTurnoBlancas && pieza.classList.contains("blanco")) || (!banderaTurnoBlancas && pieza.classList.contains("negro"));
            if (!esPiezaValida) {
                e.preventDefault();
                return;
            }

            // Ocultar la pieza original
            pieza.classList.add("dragging");

            // Crear un clon de la pieza
            const clon = pieza.cloneNode(true);
            clon.id = "pieza-clon"; // Asignar un ID al clon
            document.body.appendChild(clon);

            // Ajustar el tamaño del clon
            const rect = pieza.getBoundingClientRect();
            clon.style.width = `${rect.width}px`;
            clon.style.height = `${rect.height}px`;

            // Posicionar el clon en la posición del cursor
            clon.style.left = `${e.clientX}px`;
            clon.style.top = `${e.clientY}px`;

            // Guardar la referencia a la pieza
            e.dataTransfer.setData("text/plain", "pieza");
            e.dataTransfer.setData("pieza", pieza);
            //DOY VUELTA EL CLON DE PIEZA SI EL MOTOR JUEGA BLANCAS
            if(esMotorBlanco){
                clon.style.transform = clon.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
            }

            // Simular la selección de la pieza
            seleccionarPieza.call(pieza);
        });

        pieza.addEventListener("dragend", () => {
            // Eliminar el clon al finalizar el arrastre
            const clon = document.getElementById("pieza-clon");
            if (clon) {
                clon.remove();
            }

            // Mostrar la pieza original nuevamente
            pieza.classList.remove("dragging");
        });

        // Deshabilitar el clic si no es el turno del jugador
        if ((banderaTurnoBlancas && pieza.classList.contains("negro")) || 
            (!banderaTurnoBlancas && pieza.classList.contains("blanco"))) {
            pieza.removeEventListener("click", seleccionarPieza);
        }
    });

    casillas.forEach(casilla => {
        casilla.addEventListener("click", seleccionarCasilla);

        casilla.addEventListener("dragover", (e) => {
            e.preventDefault();

            // Mover el clon con el cursor
            const clon = document.getElementById("pieza-clon");
            if (clon) {
                clon.style.left = `${e.clientX}px`;
                clon.style.top = `${e.clientY}px`;
            }
            
        });

        casilla.addEventListener("drop", (e) => {
            e.preventDefault();

            // Obtener la referencia a la pieza
            const pieza = e.dataTransfer.getData("pieza");

            // Verificar si la pieza existe
            if (!pieza) {
                console.error("No se encontró la pieza arrastrada.");
                return;
            }

            // Simular la selección de la casilla
            seleccionarCasilla.call(casilla);

            // Eliminar el clon
            const clon = document.getElementById("pieza-clon");
            if (clon) {
                clon.remove();
            }
        });

        // Deshabilitar el clic si la casilla tiene una pieza del mismo color
        if (casilla.hasChildNodes()) {
            const primeraPieza = casilla.firstChild;
            if ((banderaTurnoBlancas && primeraPieza.classList.contains("blanco")) || 
                (!banderaTurnoBlancas && primeraPieza.classList.contains("negro"))) {
                casilla.removeEventListener("click", seleccionarCasilla);
            }
        }
    });
}

// ----------------------------------------
//     VALIDACION MOVIMIENTOS POR PIEZA
//-----------------------------------------

//MOVIMIENTOS DEL PEON
function validarMovimientosPeon(piezaPosicion, banderaColorPiezaBlanca, tableroArray){
    let x = Number(piezaPosicion[0]);
    let y = Number(piezaPosicion[1]);
    let movimientosLegales = [];
    
    if(banderaColorPiezaBlanca){ //BLANCAS
        if(x-1 >= 0 && x-1 <= 7){
            let casillaDeAvanzadaBlanca1 = tableroArray[x-1][y];
            !casillaDeAvanzadaBlanca1 ? movimientosLegales.push(`${x-1}${y}`) : {};
        }
        if(x-2 >= 0 && x-2 <=7){
            let casillaDeAvanzadaBlanca1 = tableroArray[x-1][y];
            let casillaDeAvanzadaBlanca2 = tableroArray[x-2][y];
            if (x === 6){
                (!casillaDeAvanzadaBlanca2 && !casillaDeAvanzadaBlanca1) ? movimientosLegales.push(`${x-2}${y}`) : {};
            }
        }
    } else if(!banderaColorPiezaBlanca){ //NEGRAS
        if(x+1 >= 0 && x+1 <=7){
            let casillaDeAvanzadaNegra1 = tableroArray[x+1][y]; 
            !casillaDeAvanzadaNegra1 ? movimientosLegales.push(`${x+1}${y}`) : {};
        }
        if(x+2 >= 0 && x+2 <=7){
            let casillaDeAvanzadaNegra1 = tableroArray[x+1][y]; 
            let casillaDeAvanzadaNegra2 = tableroArray[x+2][y]; 
            if(x === 1){
                (!casillaDeAvanzadaNegra2 && !casillaDeAvanzadaNegra1) ? movimientosLegales.push(`${x+2}${y}`) : {};
            }
        }
        
    }
    //SUMAMOS CAPTURAS DISPONIBLES
    let capturasDisponibles = validarCapturasPeon(piezaPosicion, banderaColorPiezaBlanca, tableroArray);
    // capturasDisponibles.forEach(captura => {
    //     movimientosLegales.push(captura);
    // })
    return [...movimientosLegales, ...capturasDisponibles];
}

function validarCapturasPeon(piezaPosicion, banderaColorPiezaBlanca, tableroArray){
    let x = Number(piezaPosicion[0]);
    let y = Number(piezaPosicion[1]);
    let capturasDisp = [];
    //BLANCAS (1 y 2) , NEGRAS (3 Y 4)
    if(banderaColorPiezaBlanca && (x-1 >= 0 && x-1 <= 7)){
        let casillaAtacadaPorPeon1 = tableroArray[x-1][y-1];
        let casillaAtacadaPorPeon2 = tableroArray[x-1][y+1];
        if(casillaAtacadaPorPeon1){
            casillaAtacadaPorPeon1[1] == "n" ? capturasDisp.push(`${x-1}${y-1}`) : {};
        }
        if(casillaAtacadaPorPeon2){
            casillaAtacadaPorPeon2[1] == "n" ? capturasDisp.push(`${x-1}${y+1}`) : {};
        }
    } else if (!banderaColorPiezaBlanca && (x+1 >= 0 && x+1 <= 7)){
        let casillaAtacadaPorPeon3 = tableroArray[x+1][y-1];
        let casillaAtacadaPorPeon4 = tableroArray[x+1][y+1];
        if(casillaAtacadaPorPeon3){
            casillaAtacadaPorPeon3[1] == "b" ? capturasDisp.push(`${x+1}${y-1}`) : {};
        }
        if(casillaAtacadaPorPeon4){
            casillaAtacadaPorPeon4[1] == "b" ? capturasDisp.push(`${x+1}${y+1}`) : {};
        }
    }
    

    return capturasDisp;
}

function validarCapturaAlPaso(piezaPosicion, banderaColorPiezaBlanca){
    let ultimoMov;
    //let x = Number(piezaPosicion[0]);
    let y = Number(piezaPosicion[1]);
    if(banderaColorPiezaBlanca){
        if (movimientosNegras.length === 0){
            return;
        } else if(movimientosNegras[movimientosNegras.length-1].length !== 2){
            return;
        } else{
            ultimoMov = movimientosNegras[movimientosNegras.length-1];
            //HAY QUE TRANSFORMAR "E4" POR EJ A "44"
            for (let fila = 0; fila < 8; fila++) {
                for (let columna = 0; columna < 8; columna++) {
                    if (tableroPosiciones[fila][columna] === ultimoMov) {
                        ultimoMov = `${fila}${columna}}`;
                    }
                }
            }
        }

        if(ultimoMov[0] === "3" && !movimientosNegras.includes(`2${ultimoMov[1]}`)){
            if(piezaPosicion[0] === "3" && (y + 1) === (Number(ultimoMov[1]))){
                return `2${y+1}`;
            }
            if(piezaPosicion[0] === "3" && (y - 1) === (Number(ultimoMov[1]))){
                return `2${y-1}`;
            }
        }
    } else{
        if (movimientosBlancas.length === 0){
            return;
        } else if(movimientosBlancas[movimientosBlancas.length-1].length !== 2){
            return;
        } else{
            ultimoMov = movimientosBlancas[movimientosBlancas.length-1];
            //HAY QUE TRANSFORMAR "E4" POR EJ A "44"
            for (let fila = 0; fila < 8; fila++) {
                for (let columna = 0; columna < 8; columna++) {
                    if (tableroPosiciones[fila][columna] === ultimoMov) {
                        ultimoMov = `${fila}${columna}}`;
                    }
                }
            }
        }

        if(ultimoMov[0] === "4" && !movimientosBlancas.includes(`5${ultimoMov[1]}`)){
            if(piezaPosicion[0] === "4" && (y + 1) === (Number(ultimoMov[1]))){
                return `5${y+1}`;
            }
            if(piezaPosicion[0] === "4" && (y - 1) === (Number(ultimoMov[1]))){
                return `5${y-1}`;
            }
        }
    }
    return;
}
//MOVIMIENTOS DEL CABALLO
function validarMovimientosCaballo(piezaPosicion, banderaColorPiezaBlanca, tableroArray) {
    let x = Number(piezaPosicion[0]);
    let y = Number(piezaPosicion[1]);
    let movimientosLegales = [];

    // Movimientos posibles del caballo (relativos a la posición actual)
    const movimientosCaballo = [
        [-2, -1], [-2, 1], [2, -1], [2, 1], // Movimientos verticales
        [-1, -2], [1, -2], [-1, 2], [1, 2]  // Movimientos horizontales
    ];

    //Recorremos todos los movimientos posibles
    for (let [dx, dy] of movimientosCaballo) {
        let nuevaX = x + dx;
        let nuevaY = y + dy;

        //Verificamos que la nueva posición esté dentro del tablero
        if (nuevaX >= 0 && nuevaX <= 7 && nuevaY >= 0 && nuevaY <= 7) {
            let piezaEnCasilla = tableroArray[nuevaX][nuevaY];

            //Verificamos si la casilla esta vacia o tiene una pieza del color contrario
            if (!piezaEnCasilla || (banderaColorPiezaBlanca && piezaEnCasilla[1] === "n") || (!banderaColorPiezaBlanca && piezaEnCasilla[1] === "b")) {
                movimientosLegales.push(`${nuevaX}${nuevaY}`);
            }
        }
    }

    return movimientosLegales;
}

//MOVIMIENTOS DEL ALFIL
function validarMovimientosAlfil(piezaPosicion, banderaColorPiezaBlanca, tableroArray){
    let x = Number(piezaPosicion[0]);
    let y = Number(piezaPosicion[1]);
    let movimientosLegales = [];
    
    let banderasPiezasBloqueando = [false, false, false, false];
    //SON 7 CASILLAS MAXIMAS EN DIAGONAL
    for(let i=1; i<8 ; i++){
        let banderaXSuma = (x+i >= 0 && x+i <=7);
        let banderaXResta = (x-i >= 0 && x-i <=7);
        let banderaYSuma = (y+i >= 0 && y+i <=7);
        let banderaYResta = (y-i >= 0 && y-i <=7);
        if(banderaXSuma && banderaYSuma){
            if (tableroArray[x+i][y+i]){
                if(((banderaColorPiezaBlanca && tableroArray[x+i][y+i][1] === "n")||(!banderaColorPiezaBlanca && tableroArray[x+i][y+i][1] === "b")) && !banderasPiezasBloqueando[0]){ // DEFINIR ACA LAS BANDERAS PARA QUE SEA UN POCO MAS LEGIBLE
                    movimientosLegales.push(`${x+i}${y+i}`);
                }
                banderasPiezasBloqueando[0] = true;
            }
            if (!banderasPiezasBloqueando[0]){
                movimientosLegales.push(`${x+i}${y+i}`);
            }
        }
        if(banderaXResta && banderaYResta){
            if (tableroArray[x-i][y-i]){
                if(((banderaColorPiezaBlanca && tableroArray[x-i][y-i][1] === "n")||(!banderaColorPiezaBlanca && tableroArray[x-i][y-i][1] === "b")) && !banderasPiezasBloqueando[1]){
                    movimientosLegales.push(`${x-i}${y-i}`);
                }
                banderasPiezasBloqueando[1] = true;
            }
            if (!banderasPiezasBloqueando[1]){
                movimientosLegales.push(`${x-i}${y-i}`);
            }
        }
        if(banderaXResta && banderaYSuma){
            if (tableroArray[x-i][y+i]){
                if(((banderaColorPiezaBlanca && tableroArray[x-i][y+i][1] === "n")||(!banderaColorPiezaBlanca && tableroArray[x-i][y+i][1] === "b")) && !banderasPiezasBloqueando[2]){
                    movimientosLegales.push(`${x-i}${y+i}`);
                }
                banderasPiezasBloqueando[2] = true;
            }
            if (!banderasPiezasBloqueando[2]){
                movimientosLegales.push(`${x-i}${y+i}`);
            }
        }
        if (banderaXSuma && banderaYResta){
            if(tableroArray[x+i][y-i]){
                if(((banderaColorPiezaBlanca && tableroArray[x+i][y-i][1] === "n")||(!banderaColorPiezaBlanca && tableroArray[x+i][y-i][1] === "b")) && !banderasPiezasBloqueando[3]){
                    movimientosLegales.push(`${x+i}${y-i}`);
                }
                banderasPiezasBloqueando[3] = true;
            }
            if (!banderasPiezasBloqueando[3]){ 
                movimientosLegales.push(`${x+i}${y-i}`);
            }
        }
    }
    return movimientosLegales;
}

//MOVIMIENTOS DE LA TORRE
function validarMovimientosTorre(piezaPosicion, banderaColorPiezaBlanca, tableroArray){
    let x = Number(piezaPosicion[0]);
    let y = Number(piezaPosicion[1]);
    let movimientosLegales = [];

    let banderasPiezasBloqueando = [false, false, false, false];
    for(let i=1; i < 8; i++){
        let banderaXSuma = (x+i >= 0 && x+i <= 7);
        let banderaYSuma = (y+i >= 0 && y+i <= 7);
        let banderaXResta = (x-i >=0 && x-i <= 7);
        let banderaYResta = (y-i >=0 && y-i <= 7);
        if (banderaXSuma){
            if(tableroArray[x+i][y]){
                if(((banderaColorPiezaBlanca && tableroArray[x+i][y][1] === "n") || (!banderaColorPiezaBlanca && tableroArray[x+i][y][1] === "b")) && !banderasPiezasBloqueando[0]){
                    movimientosLegales.push(`${x+i}${y}`);
                }
                banderasPiezasBloqueando[0] = true;
            }
            if(!banderasPiezasBloqueando[0]){
                movimientosLegales.push(`${x+i}${y}`);
            }
        }
        if (banderaYSuma){
            if(tableroArray[x][y+i]){
                if(((banderaColorPiezaBlanca && tableroArray[x][y+i][1] === "n") || (!banderaColorPiezaBlanca && tableroArray[x][y+i][1] === "b")) && !banderasPiezasBloqueando[1]){
                    movimientosLegales.push(`${x}${y+i}`);
                }
                banderasPiezasBloqueando[1] = true;
            }
            if(!banderasPiezasBloqueando[1]){
                movimientosLegales.push(`${x}${y+i}`);
            }
        }
        if (banderaXResta){
            if(tableroArray[x-i][y]){
                if(((banderaColorPiezaBlanca && tableroArray[x-i][y][1] === "n") || (!banderaColorPiezaBlanca && tableroArray[x-i][y][1] === "b")) && !banderasPiezasBloqueando[2]){
                    movimientosLegales.push(`${x-i}${y}`);
                }
                banderasPiezasBloqueando[2] = true;
            }
            if(!banderasPiezasBloqueando[2]){
                movimientosLegales.push(`${x-i}${y}`);
            }
        }
        if (banderaYResta){
            if(tableroArray[x][y-i]){
                if(((banderaColorPiezaBlanca && tableroArray[x][y-i][1] === "n") || (!banderaColorPiezaBlanca && tableroArray[x][y-i][1] === "b")) && !banderasPiezasBloqueando[3]){
                    movimientosLegales.push(`${x}${y-i}`);
                }
                banderasPiezasBloqueando[3] = true;
            }
            if(!banderasPiezasBloqueando[3]){
                movimientosLegales.push(`${x}${y-i}`);
            }
        }
    }

    return movimientosLegales;
}
//MOVIMIENTOS DE LA DAMA
function validarMovimientosDama(piezaPosicion, banderaColorPiezaBlanca, tableroArray){
    let movimientosLegalesSemi1 = validarMovimientosAlfil(piezaPosicion,banderaColorPiezaBlanca, tableroArray);
    let movimientosLegalesSemi2 = validarMovimientosTorre(piezaPosicion, banderaColorPiezaBlanca, tableroArray);
    let movimientosLegales = [...movimientosLegalesSemi1,...movimientosLegalesSemi2]; 
    return movimientosLegales;
}

//MOVIMIENTOS DEL REY
function validarMovimientosRey(piezaPosicion, banderaColorPiezaBlanca, tableroArray){
    let x = Number(piezaPosicion[0]);
    let y = Number(piezaPosicion[1]);
    let movimientosLegales = [];

    const movimientosRey = [
        [1, 1], [-1,-1],[1,-1],[-1,1],
        [0, 1], [1, 0], [0,-1], [-1,0]
    ];
    for(let [rx, ry] of movimientosRey){
        let nuevaX = x + rx;
        let nuevaY = y + ry;
        if(nuevaX >= 0 && nuevaX <= 7 && nuevaY >= 0 && nuevaY <= 7){
            let piezaEnCasilla = tableroArray[nuevaX][nuevaY];
            //Verificamos si la casilla esta vacia o si hay una pieza enemiga para permitir que el rey se mueva
            if (!piezaEnCasilla || (banderaColorPiezaBlanca && piezaEnCasilla[1] === "n") || (!banderaColorPiezaBlanca && piezaEnCasilla[1] === "b")) {
                movimientosLegales.push(`${nuevaX}${nuevaY}`);
            }
        }
    }
    return movimientosLegales;
}

function validarEnroque(piezaPosicion, banderaColorPiezaBlanca, tableroArray, arrayBanderasEnroque){
    let xIni = Number(piezaPosicion[0]);
    let yIni = Number(piezaPosicion[1]);
    console.log(piezaPosicion);
    let enroquesDisp = [];
    let caminoReyEnJaque = false;
    //JUNTO TODOS LOS MOVIMIENTOS LEGALES ENEMIGOS PARA LUEGO COMPROBAR JAQUES
    //let movimientosLegalesTotalesEnemigos = obtenerMovimientosLegales(tableroArray, !banderaColorPiezaBlanca);
    let movimientosLegalesTotalesEnemigos = [];
    for(let x=0; x<8; x++){
        for(let y=0; y<8; y++){
            let pieza = tableroArray[x][y];
            if(pieza){
                //JUNTO TODOS LOS MOVIMIENTOS LEGALES PROPIOS LUEGO DE MI MOVIMIENTO
                if((!banderaColorPiezaBlanca && pieza[1] === "b") || (banderaColorPiezaBlanca && pieza[1] === "n")){
                    if(pieza[0] === "p"){
                        let movimientosValidosPeon = validarCapturasPeon(`${x}${y}`,!banderaColorPiezaBlanca, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosPeon);
                        //console.log(`Capturas validas peon ${x}${y}: ${movimientosValidosPeon}`);
                    } else if(pieza[0] === "t"){
                        let movimientosValidosTorre = validarMovimientosTorre(`${x}${y}`, !banderaColorPiezaBlanca, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosTorre);
                        //console.log(`Movimientos validos torre ${x}${y}: ${movimientosValidosTorre}`);
                    } else if(pieza[0] === "a"){
                        let movimientosValidosAlfil = validarMovimientosAlfil(`${x}${y}`, !banderaColorPiezaBlanca, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosAlfil);
                        //console.log(`Movimientos validos alfil ${x}${y}: ${movimientosValidosAlfil}`);
                    } else if(pieza[0] === "c"){
                        let movimientosValidosCaballo = validarMovimientosCaballo(`${x}${y}`, !banderaColorPiezaBlanca, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosCaballo);
                        //console.log(`Movimientos validos caballo ${x}${y}: ${movimientosValidosCaballo}`);
                    } else if(pieza[0] === "d"){
                        let movimientosValidosDama = validarMovimientosDama(`${x}${y}`, !banderaColorPiezaBlanca, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosDama);
                        //console.log(`Movimientos validos dama ${x}${y}: ${movimientosValidosDama}`);
                    } else if(pieza[0] === "r"){
                        let movimientosValidosRey = validarMovimientosRey(`${x}${y}`, !banderaColorPiezaBlanca, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosRey);
                        //console.log(`Movimientos validos rey ${x}${y}: ${movimientosValidosRey}`);
                    }
                }
            }
        }
    }

    
    if(banderaColorPiezaBlanca && piezaPosicion === "74"){
        //Si el rey blanco no se movio
        if(!arrayBanderasEnroque[1][1]){
            //Si la torre larga no se movio
            if(!arrayBanderasEnroque[1][0]){
                movimientosLegalesTotalesEnemigos.forEach(movimiento =>{
                    if(movimiento === "72" || movimiento === "73" || movimiento === "74"){
                        caminoReyEnJaque = true;
                    }
                })
                //Si no hay ninguna pieza entre rey y torre y el rey no esta en jaque ni pasa por un jaque
                if(!tableroArray[7][1] && !tableroArray[7][2] && !tableroArray[7][3] && !caminoReyEnJaque){
                    enroquesDisp.push(`${xIni}${yIni-2}`);
                }
            } 
            //Si la torre corta no se movio
            if(!arrayBanderasEnroque[1][2]){
                movimientosLegalesTotalesEnemigos.forEach(movimiento =>{
                    if(movimiento === "74" || movimiento === "75" || movimiento === "76"){
                        caminoReyEnJaque = true;
                    }
                })
                //Si no hay ninguna pieza entre rey y torre y el rey no esta en jaque ni pasa por un jaque
                if(!tableroArray[7][5] && !tableroArray[7][6] && !caminoReyEnJaque){
                    enroquesDisp.push(`${xIni}${yIni+2}`);
                }
            }
        }
    }else if(!banderaColorPiezaBlanca && piezaPosicion === "04"){
        //Si el rey negro no se movio
        if(!arrayBanderasEnroque[0][1]){
            //Si la torre larga no se movio
            if(!arrayBanderasEnroque[0][0]){
                movimientosLegalesTotalesEnemigos.forEach(movimiento =>{
                    if(movimiento === "02" || movimiento === "03" || movimiento === "04"){ 
                        caminoReyEnJaque = true;
                    }
                })
                //Si no hay ninguna pieza entre rey y torre y el rey no esta en jaque ni pasa por un jaque
                if(!tableroArray[0][1] && !tableroArray[0][2] && !tableroArray[0][3] && !caminoReyEnJaque){
                    enroquesDisp.push(`${xIni}${yIni-2}`);
                }
            } 
            //Si la torre corta no se movio
            if(!arrayBanderasEnroque[0][2]){
                movimientosLegalesTotalesEnemigos.forEach(movimiento =>{
                    if(movimiento === "04" || movimiento === "05" || movimiento === "06"){
                        caminoReyEnJaque = true;
                    }
                })
                //Si no hay ninguna pieza entre rey y torre y el rey no esta en jaque ni pasa por un jaque
                if(!tableroArray[0][5] && !tableroArray[0][6] && !caminoReyEnJaque){
                    enroquesDisp.push(`${xIni}${yIni+2}`);
                }
            }
        }
    }
    return enroquesDisp;
}

// function obtenerMovimientosLegales(tableroArray, colorPieza, esRey = false) {
//     const movimientosLegalesTotales = [];

//     for (let x = 0; x < 8; x++) {
//         for (let y = 0; y < 8; y++) {
//             const pieza = tableroArray[x][y];
//             if (pieza) {
//                 // Determinar si la pieza es del color opuesto
//                 const esPiezaEnemiga = (!colorPieza && pieza[1] === "n") || (colorPieza && pieza[1] === "b");

//                 if (esPiezaEnemiga) {
//                     let movimientosValidos = [];

//                     // Calcular movimientos válidos según el tipo de pieza
//                     switch (pieza[0]) {
//                         case "p":
//                             movimientosValidos = esRey ? 
//                                 validarCapturasPeon(`${x}${y}`, colorPieza, tableroArray) : 
//                                 validarMovimientosPeon(`${x}${y}`, colorPieza, tableroArray);
//                             break;
//                         case "t":
//                             movimientosValidos = validarMovimientosTorre(`${x}${y}`, colorPieza, tableroArray);
//                             break;
//                         case "a":
//                             movimientosValidos = validarMovimientosAlfil(`${x}${y}`, colorPieza, tableroArray);
//                             break;
//                         case "c":
//                             movimientosValidos = validarMovimientosCaballo(`${x}${y}`, colorPieza, tableroArray);
//                             break;
//                         case "d":
//                             movimientosValidos = validarMovimientosDama(`${x}${y}`, colorPieza, tableroArray);
//                             break;
//                         case "r":
//                             movimientosValidos = validarMovimientosRey(`${x}${y}`, colorPieza, tableroArray);
//                             break;
//                     }

//                     // Filtrar movimientos válidos si es necesario
//                     if (!esRey) {
//                         movimientosValidos.forEach(movimiento => {
//                             if (movimientoPosible(`${x}${y}`, movimiento, colorPieza)) {
//                                 movimientosLegalesTotales.push(movimiento);
//                             }
//                         });
//                     } else {
//                         movimientosLegalesTotales.push(...movimientosValidos);
//                     }
//                 }
//             }
//         }
//     }

//     return movimientosLegalesTotales;
// };




//VALIDAR CADA MOVIMIENTO
function movimientoPosible(posInicial, posFinal, banderaTurnoWhite){
    let copiaTablero = hacerCopiaTablero(tableroVolatilPiezas);
    copiaTablero = moverPieza(posInicial, posFinal, copiaTablero);
    //let banderaJaqueAfterMov = comprobarJaque(!banderaTurnoWhite, copiaTablero); 
    let banderaJaqueReyNegro = comprobarJaque(true, copiaTablero);
    let banderaJaqueReyBlanco = comprobarJaque(false, copiaTablero);
    

    if((banderaTurnoWhite && banderaJaqueReyBlanco) || (!banderaTurnoWhite && banderaJaqueReyNegro)){
        //console.log("Rey blanco o negro en jaque");
        return false;
    } else if((banderaTurnoWhite && !banderaJaqueReyBlanco) || (!banderaTurnoWhite && !banderaJaqueReyNegro)) {
        //console.log("No hay jaque ni para el rey negro ni para el blanco");
        return true;
    } 
}

// ---------------------------
//     JAQUE Y JAQUE MATE
//----------------------------

//COMPROBAR JAQUE
function comprobarJaque(banderaColorReyBlanco, tableroArray){
    //HAY QUE HACER UNA LISTA CON TODOS LOS MOVIMIENTOS LEGALES ENEMIGOS, Y SI LA POSICION DEL REY ESTA DENTRO DE ESOS MOV, HAY JAQUE
    let banderaJaque = false;
    let posicionReyBlanco;
    let posicionReyNegro;
    //let movimientosLegalesTotalesEnemigos = obtenerMovimientosLegales(tableroArray, !banderaColorReyBlanco);
    let movimientosLegalesTotalesEnemigos = [];
    for(let x=0; x<8; x++){
        for(let y=0; y<8; y++){
            let pieza = tableroArray[x][y];
            if(pieza){
                //ME GUARDO LAS COORDS DE LOS REYES
                (pieza === "rb") ? posicionReyBlanco = `${x}${y}` : posicionReyBlanco;
                
                (pieza === "rn") ? posicionReyNegro = `${x}${y}` : posicionReyNegro;
                
                //JUNTO TODOS LOS MOVIMIENTOS LEGALES PROPIOS LUEGO DE MI MOVIMIENTO
                if((!banderaColorReyBlanco && pieza[1] === "n") || (banderaColorReyBlanco && pieza[1] === "b")){
                    if(pieza[0] === "p"){
                        let movimientosValidosPeon = validarCapturasPeon(`${x}${y}`,banderaColorReyBlanco, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosPeon);
                        //console.log(`Capturas validas peon ${x}${y}: ${movimientosValidosPeon}`);
                    } else if(pieza[0] === "t"){
                        let movimientosValidosTorre = validarMovimientosTorre(`${x}${y}`, banderaColorReyBlanco, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosTorre);
                        //console.log(`Movimientos validos torre ${x}${y}: ${movimientosValidosTorre}`);
                    } else if(pieza[0] === "a"){
                        let movimientosValidosAlfil = validarMovimientosAlfil(`${x}${y}`, banderaColorReyBlanco, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosAlfil);
                        //console.log(`Movimientos validos alfil ${x}${y}: ${movimientosValidosAlfil}`);
                    } else if(pieza[0] === "c"){
                        let movimientosValidosCaballo = validarMovimientosCaballo(`${x}${y}`, banderaColorReyBlanco, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosCaballo);
                        //console.log(`Movimientos validos caballo ${x}${y}: ${movimientosValidosCaballo}`);
                    } else if(pieza[0] === "d"){
                        let movimientosValidosDama = validarMovimientosDama(`${x}${y}`, banderaColorReyBlanco, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosDama);
                        //console.log(`Movimientos validos dama ${x}${y}: ${movimientosValidosDama}`);
                    } else if(pieza[0] === "r"){
                        let movimientosValidosRey = validarMovimientosRey(`${x}${y}`, banderaColorReyBlanco, tableroArray);
                        movimientosLegalesTotalesEnemigos = movimientosLegalesTotalesEnemigos.concat(movimientosValidosRey);
                        //console.log(`Movimientos validos rey ${x}${y}: ${movimientosValidosRey}`);
                    }
                }
            }
        }
    }
    
    const movimientosLegalesTotalesEnemigosSet = new Set(movimientosLegalesTotalesEnemigos);
    //Si el rey esta dentro de un movimiento legal enemigo...
    if((!banderaColorReyBlanco && movimientosLegalesTotalesEnemigosSet.has(posicionReyBlanco)) || (banderaColorReyBlanco && movimientosLegalesTotalesEnemigosSet.has(posicionReyNegro))){
        banderaJaque = true;
    } 

    return banderaJaque;
}
//COMPROBAR JAQUE MATE o REY AHOGADO
function comprobarJaqueMateOAhogado(colorPieza, tableroArray, banderaMate, banderaAhogado){
    //COMPROBAR TODOS LOS MOVIMIENTOS POSIBLES DE TODAS LAS PIEZAS DE UN REY QUE ESTA EN JAQUE, Y SI EN TODOS LOS MOVIMIENTOS POSIBLES (USAR EL MOVIMIENTO POSIBLE PARA COMPROBAR JAQUES LUEGO DE UN MOV) SIGUE HABIENDO JAQUE, ENTONCES HAY JAQUE MATE.
    let banderaJaque = comprobarJaque(!colorPieza, tableroArray);
    let movimientosLegalesTotalesEnemigos = [];
    //let movimientosLegalesTotalesEnemigos = obtenerMovimientosLegales(tableroArray, colorPieza);
    for(let x=0; x<8; x++){
        for(let y=0; y<8; y++){
            let pieza = tableroArray[x][y];
            if(pieza){
                //JUNTO TODOS LOS MOVIMIENTOS LEGALES PROPIOS LUEGO DE MI MOVIMIENTO
                if((!colorPieza && pieza[1] === "n") || (colorPieza && pieza[1] === "b")){
                    if(pieza[0] === "p"){
                        let movimientosValidosPeon = validarMovimientosPeon(`${x}${y}`,colorPieza, tableroArray);
                        movimientosValidosPeon.forEach(movimiento => {
                            if(movimientoPosible(`${x}${y}`, movimiento, colorPieza)){
                                movimientosLegalesTotalesEnemigos.push(movimiento);
                            }
                        })
                    } else if(pieza[0] === "t"){
                        let movimientosValidosTorre = validarMovimientosTorre(`${x}${y}`, colorPieza, tableroArray);
                        movimientosValidosTorre.forEach(movimiento => {
                            if(movimientoPosible(`${x}${y}`, movimiento, colorPieza)){
                                movimientosLegalesTotalesEnemigos.push(movimiento);
                            }
                        })
                    } else if(pieza[0] === "a"){
                        let movimientosValidosAlfil = validarMovimientosAlfil(`${x}${y}`, colorPieza, tableroArray);
                        movimientosValidosAlfil.forEach(movimiento => {
                            if(movimientoPosible(`${x}${y}`, movimiento, colorPieza)){
                                movimientosLegalesTotalesEnemigos.push(movimiento);
                            }
                        })
                    } else if(pieza[0] === "c"){
                        let movimientosValidosCaballo = validarMovimientosCaballo(`${x}${y}`, colorPieza, tableroArray);
                        movimientosValidosCaballo.forEach(movimiento => {
                            if(movimientoPosible(`${x}${y}`, movimiento, colorPieza)){
                                movimientosLegalesTotalesEnemigos.push(movimiento);
                            }
                        })
                    } else if(pieza[0] === "d"){
                        let movimientosValidosDama = validarMovimientosDama(`${x}${y}`, colorPieza, tableroArray);
                        movimientosValidosDama.forEach(movimiento => {
                            if(movimientoPosible(`${x}${y}`, movimiento, colorPieza)){
                                movimientosLegalesTotalesEnemigos.push(movimiento);
                            }
                        })
                    } else if(pieza[0] === "r"){
                        let movimientosValidosRey = validarMovimientosRey(`${x}${y}`, colorPieza, tableroArray);
                        movimientosValidosRey.forEach(movimiento => {
                            if(movimientoPosible(`${x}${y}`, movimiento, colorPieza)){
                                movimientosLegalesTotalesEnemigos.push(movimiento);
                            }
                        })
                    }
                }
            }
        }
    }
    //si no hay movimientos legales, entonces hay jaque mate o rey ahogado
    // if(banderaMate && banderaJaque && movimientosLegalesTotalesEnemigos.length === 0){
    //     return true;
    // } else{
    //     return false;
    // }

    // if(banderaAhogado && !banderaJaque && movimientosLegalesTotalesEnemigos.length === 0){
    //     return true;
    // } else {
    //     return false;
    // }
    if(movimientosLegalesTotalesEnemigos.length === 0){
        if( (banderaMate && banderaJaque) || (banderaAhogado && !banderaJaque) ){
            return true;
        }
    } else{
        return false;    
    }
}

//------------------------------------
//             NOTACION
//------------------------------------

// NOTACION DE CADA MOVIMIENTO
function obtenerMovimientoRealizado(posInicial, posFinal, tableroArray, banderaJaque, banderaJaqueMate, banderaCapturaAlPaso, banderaEnroque, banderaPromocion, piezaPromocion){
    let xIni = posInicial[0];
    let yIni = posInicial[1];
    let xFin = posFinal[0];
    let yFin = posFinal[1];
    let resu;
    if(banderaCapturaAlPaso){ //CAPTURA AL PASO
        resu = `${tableroPosiciones[xIni][yIni][0]}x${tableroPosiciones[xFin][yFin]}`;
    } else if(banderaEnroque){ //ENROQUE
        let enroqueLargo = yIni > yFin;
        enroqueLargo ? resu = "O-O-O" : resu = "O-O";
    } else if(banderaPromocion){
        if(tableroArray[xFin][yFin]){
            resu = `${tableroPosiciones[xIni][yIni][0]}x${tableroPosiciones[xFin][yFin]}=${piezaPromocion[0].toUpperCase()}`;
        } else {
            resu = `${tableroPosiciones[xFin][yFin]}=${piezaPromocion[0].toUpperCase()}`;
        }
    } else{
        //HAY CAPTURA
        if(tableroArray[xFin][yFin]){
            if(tableroArray[xIni][yIni][0] === "p"){
                resu = `${tableroPosiciones[xFin][yFin][0]}x${tableroPosiciones[xFin][yFin]}`;
            } else {
                resu = `${tableroArray[xIni][yIni][0].toUpperCase()}x${tableroPosiciones[xFin][yFin]}`;
            }
        } else { //NO HAY CAPTURA
            if(tableroArray[xIni][yIni][0] === "p"){
                resu = `${tableroPosiciones[xFin][yFin]}`;
            } else {
                resu = `${tableroArray[xIni][yIni][0].toUpperCase()}${tableroPosiciones[xFin][yFin]}`;
            }
        }
    }
    

    //Hay jaque mate?
    if(banderaJaqueMate){
        resu = resu + "#";
    } else if(banderaJaque && !banderaJaqueMate){ //Hay jaque?
        resu = resu + "+";
    }
    return resu;
}

//------------------------------------
//             CORONACION
//------------------------------------
// function mostrarPiezasPromocion(posInicial, posFinal, tableroArray){
//     let filaInicial = Number(posInicial[0]);
//     let filaFinal = Number(posFinal[0]);
//     let columna = Number(posFinal[1]);

//     let colorPiezaBlanca = filaInicial > filaFinal;
//     let tercerFila = colorPiezaBlanca ? filaInicial + 1 : filaInicial -1;
//     let cuartaFila = colorPiezaBlanca ? filaInicial + 2 : filaInicial -2;

//     let primerCasillaID = posFinal;
//     let segundaCasillaID = `${filaInicial}${columna}`;
//     let tercerCasillaID = `${tercerFila}${columna}`;
//     let cuartaCasillaID = `${cuartaFila}${columna}`;

//     const primerCasilla = document.getElementById(primerCasillaID);
//     const segundaCasilla = document.getElementById(segundaCasillaID);
//     const tercerCasilla = document.getElementById(tercerCasillaID);
//     const cuartaCasilla = document.getElementById(cuartaCasillaID);

//     let pieza1 = crearPieza("d", colorPiezaBlanca);
//     let pieza2 = crearPieza("c", colorPiezaBlanca);
//     let pieza3 = crearPieza("t", colorPiezaBlanca);
//     let pieza4 = crearPieza("a", colorPiezaBlanca);

//     primerCasilla.appendChild(pieza1);
//     segundaCasilla.appendChild(pieza2);
//     tercerCasilla.appendChild(pieza3);
//     cuartaCasilla.appendChild(pieza4);

//     //tablero.addEventListener("contextmenu", removerContenedorPromocion);

//     let opcionesPromocion = document.getElementsByClassName("contenedorPromocion");
//     for(let i=0; i < opcionesPromocion.length ; i++){
//         let nombrePieza = opcionesPromocion[i].classList[1];
//         opcionesPromocion[i].addEventListener("click", ()=>{
//             tableroArray = realizarPromocion(nombrePieza, posInicial, posFinal, tableroArray);
//         })
//     }
//     return tableroArray;
// }

function mostrarPiezasPromocion(posInicial, posFinal, tableroArray) {
    return new Promise((resolve) => {
        let filaInicial = Number(posInicial[0]);
        let filaFinal = Number(posFinal[0]);
        let columna = Number(posFinal[1]);

        let colorPiezaBlanca = filaInicial > filaFinal;
        let tercerFila = colorPiezaBlanca ? filaInicial + 1 : filaInicial - 1;
        let cuartaFila = colorPiezaBlanca ? filaInicial + 2 : filaInicial - 2;

        let primerCasillaID = posFinal;
        let segundaCasillaID = `${filaInicial}${columna}`;
        let tercerCasillaID = `${tercerFila}${columna}`;
        let cuartaCasillaID = `${cuartaFila}${columna}`;

        const primerCasilla = document.getElementById(primerCasillaID);
        const segundaCasilla = document.getElementById(segundaCasillaID);
        const tercerCasilla = document.getElementById(tercerCasillaID);
        const cuartaCasilla = document.getElementById(cuartaCasillaID);

        let pieza1 = crearPieza("d", colorPiezaBlanca);
        let pieza2 = crearPieza("c", colorPiezaBlanca);
        let pieza3 = crearPieza("t", colorPiezaBlanca);
        let pieza4 = crearPieza("a", colorPiezaBlanca);

        primerCasilla.appendChild(pieza1);
        segundaCasilla.appendChild(pieza2);
        tercerCasilla.appendChild(pieza3);
        cuartaCasilla.appendChild(pieza4);

        

        let opcionesPromocion = document.getElementsByClassName("contenedorPromocion");
        for (let i = 0; i < opcionesPromocion.length; i++) {
            opcionesPromocion[i].addEventListener("click", () => {
                let nombrePieza = opcionesPromocion[i].classList[1];
                // Resolver la promesa con la pieza seleccionada
                resolve({ pieza: nombrePieza, tableroArray });
                // Remover las opciones de promoción
                removerContenedorPromocion();
            });
        }
    });
}

function removerContenedorPromocion(){
    //ev.preventDefault();
    let elementosAEliminar = tablero.querySelectorAll(".contenedorPromocion")
    elementosAEliminar.forEach(elemento =>{
        elemento.parentElement.removeChild(elemento);
    })
}

function crearPieza(tipoPieza, color){
    let colorLetra = color ? "b" : "n";
    let nombrePieza = `piezas/${tipoPieza}${colorLetra}.png`
    let divPieza = document.createElement("div");
    divPieza.classList.add("contenedorPromocion");
    divPieza.classList.add(`${tipoPieza}${colorLetra}`)
    let img = document.createElement("img");
    img.src = nombrePieza;
    img.alt = `${tipoPieza}${colorLetra}`;
    divPieza.appendChild(img);
    return divPieza;
}


//-----------------------------------
//              TABLAS
//-----------------------------------
function tablas(colorPieza, tableroArray, movimientosBlancas, movimientosNegras, listaTableroHistorial){
    let tab1 = insuficienciaMaterial(tableroArray);  //implementado
    let tab2 = repeticionTriple(listaTableroHistorial); //implementado
    let tab3 = comprobarJaqueMateOAhogado(colorPieza, tableroArray, false, true); 
    let tab4; //implementado
    if(movimientosBlancas.length >= 50 && movimientosNegras.length >= 50){
        tab4 = cincuentaMovimientos(movimientosBlancas, movimientosNegras);
    } else {
        tab4 = false
    }
    //tab4 = (contadorMovimientosEmpateBlanco >= 50 || contadorMovimientosEmpateNegro >= 50) ? true : false //implementado
    //let tab5 = mutuoAcuerdo();
    if (tab1){
        return "insuficiencia material";
    } else if(tab2){
        return "triple repeticion"
    } else if(tab3){
        return "rey ahogado"
    } else if(tab4){
        return "regla de los 50 movimientos"
    } else{
        return;
    }
}

function insuficienciaMaterial(tableroArray){
    let piezasEnTablero = [];
    let anClaro;
    let anOscuro;
    let abClaro;
    let abOscuro;
    for(let f=0; f<8; f++){
        for(let c=0; c<8; c++){
            if(tableroArray[f][c]){
                piezasEnTablero.push(tableroArray[f][c]);
                if(tableroArray[f][c] === "ab"){
                    if((f+c) % 2 === 0){
                        abClaro = true;
                    } else{
                        abOscuro = true;
                    }
                } else if(tableroArray[f][c] === "an"){
                    if((f+c) % 2 === 0){
                        anClaro = true;
                    } else{
                        anOscuro = true;
                    }
                }
            }
        }
    }

    //rey contra rey
    if(piezasEnTablero.length === 2){
        return true;
    }
    if(piezasEnTablero.length === 3){
        //rey y caballo contra rey
        if(piezasEnTablero.includes("cb") || piezasEnTablero.includes("cn")){
            return true;
        }
        //rey y alfil contra rey
        if(piezasEnTablero.includes("ab") || piezasEnTablero.includes("an")){
            return true;
        }
    }
    //rey y alfil contra rey y alfil (alfiles mismo color)
    if(piezasEnTablero.length === 4){
        let alfilesClaros = anClaro && abClaro;
        let alfilesOscuros = anOscuro && abOscuro;
        if(piezasEnTablero.includes("ab") && piezasEnTablero.includes("an") && (alfilesClaros || alfilesOscuros)){
            return true;
        }
    }

    return false;
    
}

function cincuentaMovimientos(movimientosBlancas, movimientosNegras){
    let contador = 0;
    let ultimoMovNegras;
    let ultimoMovBlancas;
    for(let i=1; i<=50; i++){
        ultimoMovNegras = movimientosNegras[movimientosNegras.length - i]; // en esta linea me tira error y no se pq
        ultimoMovBlancas = movimientosBlancas[movimientosBlancas.length - i];
        if( (ultimoMovNegras.includes("x") || ["a","b","c","d","e","f","g","h"].includes(ultimoMovNegras[0])) || (ultimoMovBlancas.includes("x") || ["a","b","c","d","e","f","g","h"].includes(ultimoMovBlancas[0])) ){
            contador = 0;
        } else {
            contador = contador + 1; //contador++
        }
    }
    return contador >= 50 ? true : false;
}

function repeticionTriple(listaTableroHistorial){
    const contador = {}; // Objeto para contar las ocurrencias de cada string

    for (const elemento of listaTableroHistorial) {
        if (contador[elemento]) {
            contador[elemento]++; // Incrementar el contador si el string ya existe
        } else {
            contador[elemento] = 1; // Inicializar el contador si es la primera vez que aparece
        }

        // Si algún string aparece tres veces, retornar true
        if (contador[elemento] === 3) {
            return true;
        }
    }

    return false; // Si no se encontraron tres strings iguales, retornar false
}

//-----------------------------------
//           FIN DEL JUEGO
//-----------------------------------
function finalPartida(colorPieza, razonTablas, banderaJaqueMate){
    //si colorPieza es true y hay mate, significa que ganaron las negras
    const ventanaFinPartida = document.createElement("div");
    ventanaFinPartida.classList.add("ventanaFinPartida");
    const ventanaFinPartidaContenedorTitulo = document.createElement("div");
    ventanaFinPartida.classList.add("ventanaFinPartida-tituloContainer");
    
    //TITULO
    let mensajeTitulo = "";
    let mensajeSubtitulo = "";
    if(razonTablas){
        mensajeTitulo = "¡TABLAS!";
        mensajeSubtitulo = "por "+razonTablas;
    } else if(banderaJaqueMate){
        mensajeTitulo = colorPieza ? "¡NEGRAS GANAN!" : "¡BLANCAS GANAN!";
        mensajeSubtitulo = "por Jaque Mate";
    }

    const elementoMensajeTitulo = document.createElement("p");
    const elementoMensajeSubtitulo = document.createElement("p");
    elementoMensajeTitulo.textContent = mensajeTitulo;
    ventanaFinPartida.classList.add("ventanaFinPartida-titulo");
    elementoMensajeSubtitulo.textContent = mensajeSubtitulo;
    ventanaFinPartida.classList.add("ventanaFinPartida-razonTitulo");

    ventanaFinPartidaContenedorTitulo.appendChild(elementoMensajeTitulo);
    ventanaFinPartidaContenedorTitulo.appendChild(elementoMensajeSubtitulo);

    ventanaFinPartida.appendChild(ventanaFinPartidaContenedorTitulo);
    //BOTON JUGAR DE NUEVO
    const ventanaFinPartidaBotonJugarDeNuevo = document.createElement("button");
    ventanaFinPartidaBotonJugarDeNuevo.classList.add("ventanaFinPartida-botonJugarDeNuevo")
    ventanaFinPartidaBotonJugarDeNuevo.textContent = "Jugar de nuevo";
    ventanaFinPartida.appendChild(ventanaFinPartidaBotonJugarDeNuevo);

    //BOTON VOLVER AL MENU PRINCIPAL
    const ventanaFinPartidaBotonVolverAlMenu = document.createElement("button");
    ventanaFinPartidaBotonVolverAlMenu.classList.add("ventanaFinPartida-botonJugarDeNuevo");
    ventanaFinPartidaBotonVolverAlMenu.textContent = "Volver al menú";
    ventanaFinPartida.appendChild(ventanaFinPartidaBotonVolverAlMenu);

    //BOTON CERRAR
    const ventanaFinPartidaBotonCerrar = document.createElement("button");
    ventanaFinPartidaBotonCerrar.textContent = "X";
    ventanaFinPartidaBotonCerrar.classList.add("ventanaFinPartida-botonCerrar");
    
    // Agregar el botón de cerrar a la ventana modal
    ventanaFinPartida.appendChild(ventanaFinPartidaBotonCerrar);

    // Agregar la ventana modal al cuerpo del documento
    document.body.appendChild(ventanaFinPartida);

    // Funcionalidad para cerrar la ventana modal
    ventanaFinPartidaBotonCerrar.addEventListener("click", () => {
        ventanaFinPartida.remove();
    //funcionalidad para jugar de nuevo
    ventanaFinPartidaBotonJugarDeNuevo.addEventListener("click", ()=>{
        console.log("hola");
        const ultimoMovCasillaFin = document.querySelector(".ultimoMovFin");
        const ultimoMovCasillaInicio = document.querySelector(".ultimoMovInicio");
        if(ultimoMovCasillaFin && ultimoMovCasillaInicio){
            ultimoMovCasillaFin.classList.remove("ultimoMovFin");
            ultimoMovCasillaInicio.classList.remove("ultimoMovInicio");
        }


        tableroVolatilPiezas = [
            ["tn", "cn", "an", "dn", "rn", "an", "cn", "tn"],
            ["pn", "pn", "pn", "pn", "pn", "pn", "pn", "pn"],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", ""],
            ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb"],
            ["tb", "cb", "ab", "db", "rb", "ab", "cb", "tb"]
        ];
        banderaCreado = true;
        actualizarTablero(piezasIniciales, banderaCreado);
        piezaSeleccionada = null;
        banderaTurnoBlancas = true;
        posicionSeleccionada = null;
        movimientosBlancas = [];
        movimientosNegras = [];
        arrayBanderasEnroque = [
            [false,false, false],
            [false, false, false]
        ];
        permitirMovimiento = true;
        contadorMovimientosEmpateBlanco = 0;
        contadorMovimientosEmpateNegro = 0;
        listaTableroHistorial = [];

        casillaInicio;
        casillaFin;
        esMotorBlanco = false;
        //switchSides.disabled = false;
        agregarEventListeners();
        })
    });
}


function jugarDeNuevo(){
    // if(esMotorBlanco){
    //     rotarTablero()
    // }

    const ultimoMovCasillaFin = document.querySelector(".ultimoMovFin");
    const ultimoMovCasillaInicio = document.querySelector(".ultimoMovInicio");
    if(ultimoMovCasillaFin && ultimoMovCasillaInicio){
        ultimoMovCasillaFin.classList.remove("ultimoMovFin");
        ultimoMovCasillaInicio.classList.remove("ultimoMovInicio");
    }


    tableroVolatilPiezas = [
        ["tn", "cn", "an", "dn", "rn", "an", "cn", "tn"],
        ["pn", "pn", "pn", "pn", "pn", "pn", "pn", "pn"],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb"],
        ["tb", "cb", "ab", "db", "rb", "ab", "cb", "tb"]
    ];
    banderaCreado = true;
    actualizarTablero(piezasIniciales, banderaCreado);
    piezaSeleccionada = null;
    banderaTurnoBlancas = true;
    posicionSeleccionada = null;
    movimientosBlancas = [];
    movimientosNegras = [];
    arrayBanderasEnroque = [
        [false,false, false],
        [false, false, false]
    ];
    permitirMovimiento = true;
    contadorMovimientosEmpateBlanco = 0;
    contadorMovimientosEmpateNegro = 0;
    listaTableroHistorial = [];

    casillaInicio;
    casillaFin;
    esMotorBlanco = false;
    //switchSides.disabled = false;
    agregarEventListeners();
}

//-----------------------------------
//               FEN
//-----------------------------------
function generateFEN(tableroArray){
    let fen="";
    for(let fila=0; fila<=7; fila++){
        tableroArray[fila].forEach(casilla =>{
            let pieceNotation = "";
            let letra = casilla[0];
            let color = casilla[1];
            
            if(casilla){
                switch(letra){
                    case "p":
                        pieceNotation = "p";
                        break;
                    case "a":
                        pieceNotation = "b";
                        break;
                    case "c":
                        pieceNotation = "n";
                        break;
                    case "t":
                        pieceNotation = "r";
                        break;
                    case "d":
                        pieceNotation = "q";
                        break;
                    case "r":
                        pieceNotation = "k";
                        break;
                }
                fen += color == "b" ? pieceNotation.toUpperCase() : pieceNotation;
            }else{
                pieceNotation = "blank";
                fen += pieceNotation;
            }
        });
        if(fila<8){
            fen+="/";
        }
    }
    fen = fen.replace(new RegExp("blankblankblankblankblankblankblankblank", "g"),"8");
    fen = fen.replace(new RegExp("blankblankblankblankblankblankblank", "g"),"7");
    fen = fen.replace(new RegExp("blankblankblankblankblankblank", "g"),"6");
    fen = fen.replace(new RegExp("blankblankblankblankblank", "g"),"5");
    fen = fen.replace(new RegExp("blankblankblankblank", "g"),"4");
    fen = fen.replace(new RegExp("blankblankblank", "g"),"3");
    fen = fen.replace(new RegExp("blankblank", "g"),"2");
    fen = fen.replace(new RegExp("blank", "g"),"1");
    fen+= banderaTurnoBlancas ? " w " : " b ";
    let castlingString="";
    
    !arrayBanderasEnroque[1][1]
    let shortCastlePossibleForWhite = !arrayBanderasEnroque[1][1] && !arrayBanderasEnroque[1][2];
    let longCastlePossibleForWhite = !arrayBanderasEnroque[1][1] && !arrayBanderasEnroque[1][0];
    let shortCastlePossibleForBlack = !arrayBanderasEnroque[0][1] && !arrayBanderasEnroque[0][2];
    let longCastlePossibleForBlack = !arrayBanderasEnroque[0][1] && !arrayBanderasEnroque[0][0];
    if(shortCastlePossibleForWhite){castlingString+="K";}
    if(longCastlePossibleForWhite){castlingString+="Q";}
    if(shortCastlePossibleForBlack){castlingString+="k";}
    if(longCastlePossibleForBlack){castlingString+="q";}
    if(castlingString==""){castlingString+="-";}
    castlingString+=" ";
    fen+=castlingString;
    //ESTE FALTA 
    let enPassantSquare = chequearCapturaAlPaso(banderaTurnoBlancas, tableroVolatilPiezas);
    fen+=enPassantSquare=="blank" ? "-" : enPassantSquare;
    //ESTE FALTA. LISTO
    let fiftyMovesRuleCount= contadorMovimientosEmpateBlanco + contadorMovimientosEmpateNegro;
    fen+=" "+fiftyMovesRuleCount;
    //ESTE FALTA. LISTO
    let moves = [...movimientosBlancas, ...movimientosNegras];
    let moveCount=Math.floor(moves.length/2)+1;
    fen+=" "+moveCount;

    return fen;
}

function chequearCapturaAlPaso(banderaTurnoBlancas, tableroArray){
    const columnas = new Map([
        ["a", "0"],
        ["b", "1"],
        ["c", "2"],
        ["d", "3"],
        ["e", "4"],
        ["f", "5"],
        ["g", "6"],
        ["h", "7"],
    ]);
    for(let f=0; f<8 ;f++){
        for(let c=0; c<8; c++){
            if(banderaTurnoBlancas){
                if(tableroArray[f][c] == "pb"){
                    let capturaAlPaso = validarCapturaAlPaso(`${f}${c}`,banderaTurnoBlancas);
                    if(capturaAlPaso){
                        for(let [c, v] of columnas){
                            if (capturaAlPaso[1] == v){
                                resu = `${c}${8 - capturaAlPaso[0]}`;
                                return resu;
                            }
                        }
                        
                    }
                }
            }
            else{
                if(tableroArray[f][c] == "pn"){
                    let capturaAlPaso = validarCapturaAlPaso(`${f}${c}`,banderaTurnoBlancas);
                    if(capturaAlPaso){
                        for(let [c, v] of columnas){
                            if (capturaAlPaso[1] == v){
                                resu = `${c}${8 - capturaAlPaso[0]}`;
                                return resu;
                            }
                        }
                    }
                }
            }
        }
    }
    return "blank"
}
//-----------------------------------
//              MAIN
//-----------------------------------

//COORDENADAS TABLERO
const tableroPosiciones = [
    ["a8", "b8", "c8", "d8", "e8", "f8","g8", "h8"],
    ["a7", "b7", "c7", "d7", "e7", "f7", "g7", "h7"],
    ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
    ["a5", "b5", "c5", "d5", "e5", "f5", "g5", "h5"],
    ["a4", "b4", "c4", "d4", "e4", "f4", "g4", "h4"],
    ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
    ["a2", "b2", "c2", "d2", "e2", "f2", "g2", "h2"],
    ["a1", "b1", "c1", "d1", "e1", "f1", "g1", "h1"]
];

// Configuración inicial del tablero (filas y piezas) JUEGAN BLANCAS
const piezasIniciales = [
    ["tn", "cn", "an", "dn", "rn", "an", "cn", "tn"],
    Array(8).fill("pn"),
    ...Array(4).fill(Array(8).fill("")),
    Array(8).fill("pb"),
    ["tb", "cb", "ab", "db", "rb", "ab", "cb", "tb"]
];

let tableroVolatilPiezas = [
    ["tn", "cn", "an", "dn", "rn", "an", "cn", "tn"],
    ["pn", "pn", "pn", "pn", "pn", "pn", "pn", "pn"],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["", "", "", "", "", "", "", ""],
    ["pb", "pb", "pb", "pb", "pb", "pb", "pb", "pb"],
    ["tb", "cb", "ab", "db", "rb", "ab", "cb", "tb"]
];

let banderaCreado = false;

//MOVIMIENTOS
const tablero = document.querySelector(".tablero");
const piezas = document.querySelectorAll(".pieza");
const casillas = document.querySelectorAll(".casilla");
let piezaSeleccionada = null;
let banderaTurnoBlancas = true;
let posicionSeleccionada = null;
let movimientosBlancas = [];
let movimientosNegras = [];
let arrayBanderasEnroque = [
    [false,false, false],
    [false, false, false]
];
let permitirMovimiento = true;
let contadorMovimientosEmpateBlanco = 0;
let contadorMovimientosEmpateNegro = 0;
let listaTableroHistorial = [];

let casillaInicio;
let casillaFin;

let esMotorBlanco = false;
let nivelSeleccionado = 1;




crearTablero();
actualizarTablero(piezasIniciales, banderaCreado);
banderaCreado = true;

agregarEventListeners();

newGame.addEventListener("click", jugarDeNuevo);

// switchSides.addEventListener("click", rotarTablero);
// function rotarTablero(){
//     rotarPieza();
//     tablero.style.transform = tablero.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";

//     esMotorBlanco = !esMotorBlanco;
// }

function rotarPieza(){
    Array.from(document.getElementsByClassName("pieza")).forEach(div =>{
        div.style.transform = div.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
    });
}
