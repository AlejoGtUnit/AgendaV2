var development = true;
var urlService = "//" + window.location.host + "/TiempoLibreServiceV2";
if (development)
    urlService = "https://gnw.prensalibre.com/TiempoLibreServiceV2";

var templateFechasEventos = $('#template-fechas-evento').html();
Mustache.parse(templateFechasEventos);


if (development)
    obtenerFechasEvento("/Agenda/Cine-y-Teatro/JUL18-Teatro-comediantes-vrd");
else
{
    var urlEvento = obtenerUrlEvento();
    if (urlEvento != undefined && urlEvento != "")
        obtenerFechasEvento(urlEvento);    
}

function obtenerFechasEvento(pUrlEvento)
{
    var jqxhr = $.get(urlService, { filtro: "evento", urlEvento:pUrlEvento })
    .done(function(data){
        if (data)
        {
            if (data.eventos.length > 1)
                    $("#modulo-fechas-evento").show();
                
            if (data.eventos.length > 0)
            {    
                var totalEventos = data.total;
                data.eventos.forEach(function(fechaEvento, index)
                {
                    if (index == 0)
                    {
                        $("#fecha-mas-proxima #dia-semana").html(fechaEvento.fechaInicio.diaSemana);
                        $("#fecha-mas-proxima #mes").html(fechaEvento.fechaInicio.mes.nombre);
                        $("#fecha-mas-proxima #dia").html(fechaEvento.fechaInicio.dia);
                        $("#fecha-mas-proxima #hora").html(fechaEvento.fechaInicio.horaCompleta);
                    }
                    else
                    {
                        $("#ver-mas-fechas-evento").show();
                        var htmlFechaEvento = Mustache.render(templateFechasEventos, fechaEvento);
                        var htmlActualFechas = $("#fechasEventos").html();
                        $("#fechasEventos").html(htmlActualFechas + htmlFechaEvento);
                    }
                });
            }
        }
    })
    .fail(function(){
        console.log("obtenerFechasEvento()->Fail!");
    })
    .always(function(){

    });
}

function obtenerUrlEvento()
{
    var resultado = "";
    var href = window.location.href;
    if (href != undefined && href) {
        var indiceMenor = href.indexOf("/Agenda/");
        if (indiceMenor > -1){
            var urlEvento = href.substring(indiceMenor);
            if (urlEvento != undefined && urlEvento){
                resultado = urlEvento;
            }
        }
    }
    return resultado;
}