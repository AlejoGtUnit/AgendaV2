var eventosPorPagina = 12;
var development = true;

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
    var jqxhr = $.get(urlService, { inicio:0, fin:0, categoria:0 })
    .done(function(data){
        if (data){
            if (data.eventos.length > 0)
            {
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
        }
    })
    .fail(function(){
        console.log("obtenerEventos()->Fail!");
    })
    .always(function(){
        
    });
}