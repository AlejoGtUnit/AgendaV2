var development = false;

var urlService = "//" + window.location.host + "/TiempoLibreServiceV2";
if (development)
    urlService = "https://gnw.prensalibre.com/TiempoLibreServiceV2";

var templateOtroEvento = $('#template-otro-evento').html();
Mustache.parse(templateOtroEvento);

function obtenerOtrosEventos()
{
    var jqxhr = $.get(urlService, { pagina:1, eventosPorPagina:10 })
    .done(function(data)
    {
        if (data)
        {
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
                var eventosUnidos = eventosHoyDesordenados.concat(eventosNoHoy);
                
                for (var x= 0; x < eventosUnidos.length; x++)
                {
                    var htmlActualOtrosEventos = $("#owl-carousel-otros-eventos").html();
                    var htmlNuevoOtroEvento = Mustache.render(templateOtroEvento, eventosUnidos[x]);
                    
                    if (window.location.href != eventosUnidos[x].urlEventoCompleta)        
                        $("#owl-carousel-otros-eventos").html(htmlActualOtrosEventos + htmlNuevoOtroEvento);
                }
            }
        }

        var owlCarouselOtrosEventos = $("#owl-carousel-otros-eventos");
        owlCarouselOtrosEventos.owlCarousel({
            loop:false,
            margin:30,
            nav:true,
            dots: true,
            responsive:{
              0:{
                  items:1,
                  dots:false
              },
              600:{
                  items:3
              }
            },
            navContainer: "#nav-otros-eventos"
        });   

        $("#modulo-otros-eventos .owl-prev").html("<span class='far fa-caret-square-left'></span>");
        $("#modulo-otros-eventos .owl-next").html("<span class='far fa-caret-square-right'></span>");
    })
    .fail(function(){
        console.log("obtenerOtrosEventos()->Fail!");
    })
    .always(function(){
        
    });
}

$(document).ready(function(){
    obtenerOtrosEventos();
});