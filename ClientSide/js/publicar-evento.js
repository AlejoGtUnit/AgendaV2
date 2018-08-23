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
});