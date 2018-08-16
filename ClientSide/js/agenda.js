var pagina = 1;
var eventosPorPagina = 12;
var development = true;
var filtroEventos = 'todos'; //todos,hoy,semana,mes,fecha,busqueda
var urlsCategorias = 
[   
    { "patron": "/tiempolibre/cine-y-teatro", "codigo": 1 },
    { "patron": "/tiempolibre/actividades-familiares", "codigo": 2 },
    { "patron": "/tiempolibre/conciertos", "codigo": 3},
    { "patron": "/tiempolibre/deportes", "codigo": 4 },
    { "patron": "/tiempolibre/expediciones-y-viajes", "codigo":5 },
    { "patron": "/tiempolibre/gastronomia", "codigo":6 },
    { "patron": "/tiempolibre/exposiciones-y-convenciones", "codigo":7 },
    { "patron": "/tiempolibre/vida-nocturna", "codigo":8 }
];

var urlService = "//" + window.location.host + "/TiempoLibreServiceV2";
if (development)
    urlService = "https://gnw.prensalibre.com/TiempoLibreServiceV2";

var templateCardEventoCuadrilla = $('#template-card-evento-cuadrilla').html();
Mustache.parse(templateCardEventoCuadrilla);

obtenerEventos();

$(document).ready(function(){
    console.log("Agenda.js -> Ready!");
    console.log("Development: " + development);
    console.log("UrlService: " + urlService);

    datepickerES();
    /*JQueryUi DatePicker Mobile*/
    $("#fecha-inicio-mobile").datepicker({
        dateFormat: "dd/mm/yy",
        minDate: moment().format("DD/MM/YYYY")  
    });    
    
    $("#btn-filtro-fecha-mobile").on('click', function(){
        $("#fecha-inicio-mobile").datepicker("show");
        return false;
    });
    
    /*JQueryUi DatePicker Desk*/
    $("#fecha-inicio-desk").datepicker({
        dateFormat: "dd/mm/yy",
        minDate: moment().format("DD/MM/YYYY")  
    });
    
    $("#btn-filtro-fecha-desk").on('click', function(){
        $("#fecha-inicio-desk").datepicker("show");
        return false;
    });

    /*$(".card-evento-cuadrilla .fa-share-alt").on('click', function(){
        var cardEventoCuadrillaPadre = $(this).parents(".card-evento-cuadrilla");
        if (cardEventoCuadrillaPadre != undefined && cardEventoCuadrillaPadre){
            var rowNumber = cardEventoCuadrillaPadre.data("rownumber");
            if (rowNumber != undefined && rowNumber)
            {
                $(".card-evento-cuadrilla[data-rownumber=" + rowNumber + "] .opciones-compartir").toggle('fast');
            }
        }
    });*/
});

function ObtenerUnidadDeInformacion(x){
    return {
        rowNumber: x,
        tituloLimited: 'Exposición colectiva de mujeres "VITAL"',
        resumenLimited: '17 artistas presentarán obras inspiradas en las fuentes naturales de energía.',
        imagenSmall: 'https://gnwebprensalibrerootwest.s3.us-west-2.amazonaws.com/mmediafiles/pl/f7/f7072e7d-515b-46e0-ac9e-d7c735956dad_383_216.jpg',
        urlEvento: '/Agenda/Cine-y-Teatro/JUL18-Teatro-comediantes-vrd',
        urlEventoCompleta: 'https://www.prensalibre.com/Agenda/Cine-y-Teatro/JUL18-Teatro-comediantes-vrd',
        fecha: {
            valorCompleto: '06/07/2018 8:30:00 p. m.',
            sinHora: '06/07/2018',
            dia: '6',
            mes: {
                mes: '7',
                nombre: 'Jul'
            },
            anio: '2018',
            hora: '20',
            minuto: '30'
        },
        promocion: true,
        hoy: true
    }
}

function obtenerEventos()
{
    var fechaSeleccionada = $("#fecha-inicio-desk").val();
    var textoBusqueda = $("#txt-buscar-mobile").val();
    var jqxhr = $.get(urlService, { filtro: filtroEventos, pagina:pagina, eventosPorPagina:eventosPorPagina, fecha:fechaSeleccionada, texto:textoBusqueda })
    .done(function(data){
        if (data)
        {
            if (data.eventos.length > 0)
            {
                if ($("#paginacion-eventos").html().trim() == ""){
                    var totalEventos = data.total;
                    console.log("Maximo de eventos disponibles apartir de hoy: " + totalEventos);
                    var totalPaginas = Math.ceil(totalEventos / eventosPorPagina);
                    generarPaginacion(totalPaginas);
                }
                
                var cadenaHoy = moment().format("DD/MM/YYYY");
                var eventosHoy = [];
                var eventosHoyDesordenados = [];
                var eventosNoHoy = [];
                
                for (var x = 0; x < data.eventos.length; x++)
                {
                    if (data.eventos[x].fechaInicio.sinHora == cadenaHoy){
                        eventosHoy.push(data.eventos[x]);
                    }
                    else {
                        eventosNoHoy.push(data.eventos[x]);
                    }
                }                
                
                eventosHoyDesordenados = eventosHoy.map((a) => ({sort: Math.random(), value: a})).sort((a, b) => a.sort - b.sort).map((a) => a.value);
                
                $("#wrapper-cards-eventos").html("");
                eventosHoyDesordenados.concat(eventosNoHoy).forEach(function(eventoItem, index){
                    var htmlActualCardsEventos = $("#wrapper-cards-eventos").html();
                    var htmlNuevoEvento = Mustache.render(templateCardEventoCuadrilla, eventoItem);
                    $("#wrapper-cards-eventos").html(htmlActualCardsEventos + htmlNuevoEvento);
                });
            }
            else {
                $("#wrapper-cards-eventos").html("");
                $("#paginacion-eventos").html("");
            }
        }
    })
    .fail(function(){
        console.log("obtenerEventos()->Fail!");
    })
    .always(function(){
        
    });
}

function datepickerES(){
    $.datepicker.regional['es'] = {
        closeText: 'Cerrar',
        prevText: '<Ant',
        nextText: 'Sig>',
        currentText: 'Hoy',
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene','Feb','Mar','Abr', 'May','Jun','Jul','Ago','Sep', 'Oct','Nov','Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom','Lun','Mar','Mié','Juv','Vie','Sáb'],
        dayNamesMin: ['Do','Lu','Ma','Mi','Ju','Vi','Sá'],
        weekHeader: 'Sm',
        dateFormat: 'dd/mm/yy',
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: ''
    };
    
    $.datepicker.setDefaults($.datepicker.regional['es']);
}

//Filtrado Desk
$("#btn-filtro-todos-desk, #btn-filtro-hoy-desk, #btn-filtro-semana-desk, #btn-filtro-mes-desk").on("click", function(){
    $("#fecha-inicio-mobile").val("");
    $("#fecha-inicio-desk").val("");
    
    var filtrar = $(this).data("filtrar");
    switch(filtrar){
        case "todos": 
            filtroEventos = 'todos';
            break;
        case "hoy":
            filtroEventos = 'hoy';
            break;
        case "semana":
            filtroEventos = 'semana';
            break;
        case "mes": 
            filtroEventos = 'mes'
            break;
    }
    mostrarSeleccionFiltro();
    pagina = 1;
    obtenerEventos();
});   

//Cambio Fecha Desk
$("#fecha-inicio-desk").on('change', function(){
    var fechaSeleccionadaDesk = $("#fecha-inicio-desk").val();
    $("#fecha-inicio-mobile").val(fechaSeleccionadaDesk);
    $(".btn-filtro-desk").removeClass("active");
    
    if (fechaSeleccionadaDesk != "")
        filtroEventos = "fecha";
    else
        filtroEventos = "todos";
    
    pagina = 1;
    obtenerEventos();
    mostrarSeleccionFiltro();
});

//Filtrado Mobile
$("#select-filtros-mobile").on('change', function()
{
    $("#fecha-inicio-mobile").val("");
    $("#fecha-inicio-desk").val("");
    
    filtroEventos = $("#select-filtros-mobile").val();
    mostrarSeleccionFiltro();
    pagina = 1;
    obtenerEventos();
});

$("#fecha-inicio-mobile").on('change', function(){
    var fechaSeleccionadaMobile = $("#fecha-inicio-mobile").val();
    $("#fecha-inicio-desk").val(fechaSeleccionadaMobile);
    
    if (fechaSeleccionadaMobile != "")
        filtroEventos = "fecha";
    else
        filtroEventos = "todos";
    
    pagina = 1;
    obtenerEventos();
    mostrarSeleccionFiltro();
})

function mostrarSeleccionFiltro()
{
    $(".btn-filtro-desk").removeClass("active");
    $("#btn-filtro-fecha-desk").removeClass("active");
    switch (filtroEventos)
    {
        case 'todos':
            $("#select-filtros-mobile").val("todos");
            $("#btn-filtro-todos-desk").addClass("active");
            $("#mostrando").text("Mostrando: Todos");
            break;
        case 'hoy':
            $("#select-filtros-mobile").val("hoy");
            $("#btn-filtro-hoy-desk").addClass("active");
            $("#mostrando").text("Mostrando: Hoy");
            break;
        case 'semana':
            $("#select-filtros-mobile").val("semana");
            $("#btn-filtro-semana-desk").addClass("active");
            $("#mostrando").text("Mostrando: Semana");
            break;
        case 'mes':
            $("#select-filtros-mobile").val("mes");
            $("#btn-filtro-mes-desk").addClass("active");
            $("#mostrando").text("Mostrando: Mes");
            break;
        case 'fecha':
            $("#select-filtros-mobile").val("fecha");
            $("#btn-filtro-fecha-desk").addClass("active");
            $("#mostrando").text("Mostrando: " + $("#fecha-inicio-mobile").val());
            break;
        case 'busqueda':
            $("#select-filtros-mobile").val("busqueda");
            $("#mostrando").text("Mostrando: " + $("#txt-buscar-mobile").val());
            break;
        default:
            break;
    }
    
    if (filtroEventos != 'fecha'){
        $("#fecha-inicio-mobile").val("");
        $("#fecha-inicio-desk").val("");
    }
    
    if (filtroEventos != 'busqueda'){
        $("#txt-buscar-mobile").val("");
        $("#txt-buscar-desk").val("");
    }
}

$("#txt-buscar-mobile").on('keyup',function(){
    $("#txt-buscar-desk").val($("#txt-buscar-mobile").val());
});

$("#txt-buscar-desk").on('keyup',function(){
    $("#txt-buscar-mobile").val($("#txt-buscar-desk").val());
});

$("#txt-buscar-mobile, #txt-buscar-desk").bind('keypress keydown keyup', function(e){
   if(e.keyCode == 13) {
       filtroEventos = 'busqueda';
       pagina = 1;
       obtenerEventos();
       mostrarSeleccionFiltro();
       e.preventDefault(); 
   }
});

function generarPaginacion(paginas)
{
    $("#paginacion-eventos").html("");
    for(var x=1; x <= paginas; x++)
    {
        var htmlActual = $("#paginacion-eventos").html();
        var claseActiva = (x == 1 ? "active" : "");
        var htmlPagina = "<span class='pagina-eventos " + claseActiva + "' data-pagina='" + x + "'>" + x + " </span>";
        $("#paginacion-eventos").html(htmlActual + htmlPagina);
    }
    
    $(".pagina-eventos").on('click', function(){
        var paginaSeleccionada = $(this).data("pagina");
        console.log("Pagina: " + paginaSeleccionada);
        
        if (paginaSeleccionada != undefined && paginaSeleccionada){
            var fin = paginaSeleccionada * eventosPorPagina;
            var inicio = (fin - eventosPorPagina) + 1;
        }
        $(".pagina-eventos").removeClass("active");
        $(this).addClass("active");
    });
}

