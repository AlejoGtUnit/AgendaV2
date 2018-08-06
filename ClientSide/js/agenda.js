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
    urlService = "//gnw.prensalibre.com/TiempoLibreServiceV2";


var templateCardEventoCuadrilla = $('#template-card-evento-cuadrilla').html();
Mustache.parse(templateCardEventoCuadrilla);

$(document).ready(function(){
    console.log("Agenda.js -> Ready!");
    console.log("Development: " + development);
    console.log("UrlService: " + urlService);
    
    $("#wrapper-cards-eventos").html("");
    for (var x=0; x < eventosPorPagina; x++){
        var htmlActualCardsEventos = $("#wrapper-cards-eventos").html();
        var htmlNuevoEvento = Mustache.render(templateCardEventoCuadrilla, ObtenerUnidadDeInformacion(x+1));
        $("#wrapper-cards-eventos").html(htmlActualCardsEventos + htmlNuevoEvento);
    }
    
    $(".card-evento-cuadrilla .fa-share-alt").on('click', function(){
        var cardEventoCuadrillaPadre = $(this).parents(".card-evento-cuadrilla");
        if (cardEventoCuadrillaPadre != undefined && cardEventoCuadrillaPadre){
            var rowNumber = cardEventoCuadrillaPadre.data("rownumber");
            if (rowNumber != undefined && rowNumber)
            {
                $(".card-evento-cuadrilla[data-rownumber=" + rowNumber + "] .opciones-compartir").toggle('fast');
            }
        }
    });
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
