var development = true;

var urlService = "//" + window.location.host + "/TiempoLibreServiceV2";
if (development)
    urlService = "https://gnw.prensalibre.com/TiempoLibreServiceV2";

var templateOtroEvento = $('#template-otro-evento').html();
Mustache.parse(templateOtroEvento);

function obtenerOtrosEventos()
{
    var jqxhr = $.get(urlService, { pagina:1, eventosPorPagina:24 })
    .done(function(data){
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
                
                $("#wrapper-cards-eventos").html("");
                /*eventosHoyDesordenados.concat(eventosNoHoy).forEach(function(eventoItem, index){
                    var htmlActualCardsEventos = $("#wrapper-cards-eventos").html();
                    var htmlNuevoEvento = Mustache.render(templateCardEventoCuadrilla, eventoItem);
                    $("#wrapper-cards-eventos").html(htmlActualCardsEventos + htmlNuevoEvento);
                });*/
                
                var eventosUnidos = eventosHoyDesordenados.concat(eventosNoHoy);
                for (var x= 0; x < eventosUnidos.length; x++){
                    var htmlActualCardsEventos = $("#wrapper-cards-eventos").html();
                    var htmlNuevoEvento = Mustache.render(templateCardEventoCuadrilla, eventosUnidos[x]);
                    $("#wrapper-cards-eventos").html(htmlActualCardsEventos + htmlNuevoEvento);
                }
            }
            else {
                $("#wrapper-cards-eventos").html("No se encontraron eventos.");
                $("#paginacion-eventos").html("");
                $("#paginacion-eventos").hide();
            }
        }
    })
    .fail(function(){
        console.log("obtenerEventos()->Fail!");
    })
    .always(function(){
        $(".card-evento-cuadrilla .fa-share-alt").on('click', function(){
            $(this).parents(".card-evento-cuadrilla").find(".opciones-compartir").toggle(350);
        });
    });
}