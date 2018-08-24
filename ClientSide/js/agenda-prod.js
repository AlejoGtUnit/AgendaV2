var pagina = 1;
var eventosPorPagina = 36;
var development = true;
var filtroEventos = 'todos'; //todos,hoy,semana,mes,fecha,busqueda
var urlsCategorias = 
[   
    { "patron": "/agenda/cine-y-teatro", "codigo":1, "carousel":"categoria-cineteatro", indiceCarousel:2 },
    { "patron": "/agenda/actividades-familiares", "codigo":2, "carousel":"categoria-familiares", indiceCarousel:3 },
    { "patron": "/agenda/conciertos", "codigo":3, carousel:"categoria-conciertos", indiceCarousel:0 },
    { "patron": "/agenda/deportes", "codigo":4, carousel:"categoria-deportes", indiceCarousel:1 },
    { "patron": "/agenda/expediciones-y-viajes", "codigo":5, carousel:"categoria-expedicionesviajes", indiceCarousel:4 },
    { "patron": "/agenda/gastronomia", "codigo":6, carousel:"categoria-gastronomia", indiceCarousel:5 },
    { "patron": "/agenda/exposiciones-y-convenciones", "codigo":7, carousel:"categoria-exposicionesconvenciones", indiceCarousel:6 },
    { "patron": "/agenda/vida-nocturna", "codigo":8, carousel:"categoria-vidanoctura", indiceCarousel:7 }
];

function obtenerCodigoCategoria()
{
    var resultado = "";
    var href = window.location.href.toLowerCase();
    var categoria = urlsCategorias.find(function(item){
        return (href.indexOf(item.patron) > -1);
    });
    
    if (categoria != undefined && categoria){
        resultado = categoria.codigo;
    }
    return resultado;
}

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
    
    mostrarCategoriaSeleccionada();
});

function obtenerEventos()
{
    var fechaSeleccionada = $("#fecha-inicio-desk").val();
    var textoBusqueda = $("#txt-buscar-mobile").val();
    
    var jqxhr = $.get(urlService, { categoria:obtenerCodigoCategoria, filtro: filtroEventos, pagina:pagina, eventosPorPagina:eventosPorPagina, fecha:fechaSeleccionada, texto:textoBusqueda })
    .done(function(data){
        if (data)
        {
            if (data.eventos.length > 0)
            {
                //if ($("#paginacion-eventos").html().trim() == "")
                {
                    $("#paginacion-eventos").show();
                    var totalEventos = data.total;
                    var totalPaginas = Math.ceil(totalEventos / eventosPorPagina);
                    console.log("Eventos encontrados:" + totalEventos, ", paginas:" + totalPaginas);
                    generarPaginacion(totalPaginas);

                    if (data.pagina != undefined && data.pagina)
                        $(".pagina-eventos[data-pagina=" + data.pagina + "]").addClass("active");
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
            filtroEventos = 'mes';
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
});

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
        //var claseActiva = (x == 1 ? "active" : "");
        var htmlPagina = "<span class='pagina-eventos' data-pagina='" + x + "'>" + x + " </span>";
        $("#paginacion-eventos").html(htmlActual + htmlPagina);
    }
    
    $(".pagina-eventos").on('click', function(){
        var paginaSeleccionada = $(this).data("pagina");
        if (paginaSeleccionada != undefined && paginaSeleccionada)
        {
            console.log("Pagina: " + paginaSeleccionada);
            
            mostrarSeleccionFiltro();
            pagina = paginaSeleccionada;
            obtenerEventos();
            $("html, body").animate({ scrollTop: $('#main-contenedor-agenda').offset().top }, 700);
        }
    });
}

var owlCarouselCategorias = $("#carousel-categorias");
owlCarouselCategorias.owlCarousel({
    loop:false,
    margin:10,
    nav:false,
    dots: false,
    responsive:{
      0:{
          items:1
      },
      768:{
          items:4
      }
    }
});

$("#categorias-left .fa-chevron-left").on('click', function(){
    $("#carousel-categorias").trigger('prev.owl.carousel');
});

$("#categorias-right .fa-chevron-right").on('click', function(){
    $("#carousel-categorias").trigger('next.owl.carousel');
});

function mostrarCategoriaSeleccionada()
{
    var categoria = obtenerCodigoCategoria();
    if (categoria)
    {
        var conf = urlsCategorias.find(x => { return x.codigo == categoria; });
        if (conf != undefined && conf){
            $("#" + conf.carousel).css("background-color", "#ecedef");
            $("#" + conf.carousel).css("color", "#2c3240");
            var srcImagen = $("#" + conf.carousel + " .img-categoria").attr("src");
            $("#" + conf.carousel + " .img-categoria").attr("src", srcImagen.replace(".png", "_hover.png"));
            
            $("#carousel-categorias").trigger('to.owl.carousel', conf.indiceCarousel, 500);
        }
    }
}