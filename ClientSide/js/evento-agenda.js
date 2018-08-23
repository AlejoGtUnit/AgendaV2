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

$(document).ready(function(){
    $(".img-categoria").css("display", "inherit");
    
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
    
    mostrarCategoriaSeleccionada();
});
