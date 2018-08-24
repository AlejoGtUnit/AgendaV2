/*Google Analytics*/

/*Inicio Filtros Desk*/
$("#btn-filtro-todos-desk").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'calendario', 'Todos');
});
$("#btn-filtro-hoy-desk").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'calendario', 'Hoy');
});
$("#btn-filtro-semana-desk").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'calendario', 'Semana');
});
$("#btn-filtro-mes-desk").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'calendario', 'Mes');
});
/*Fin Filtros Desk*/

/*Inicio Filtros Mobile*/
$("#select-filtros-mobile").on('change', function(){
    var filtro = $("#select-filtros-mobile").val();
    
    switch (filtro)
    {
        case "todos":
            ga('send', 'event', 'Menu-Agenda', 'calendario', 'Todos');
            break;
        case "hoy":
            ga('send', 'event', 'Menu-Agenda', 'calendario', 'Hoy');
            break;
        case "semana":
            ga('send', 'event', 'Menu-Agenda', 'calendario', 'Semana');
            break;
        case "mes":
            ga('send', 'event', 'Menu-Agenda', 'calendario', 'Mes');
            break;
    }
});
/*Fin Filtros Mobile*/

$("#fecha-inicio-mobile").on('change', function(){
   ga('send', 'event', 'Menu-Agenda', 'calendario', 'Fecha');     
});
            
$("#fecha-inicio-desk").on('change', function(){
    ga('send', 'event', 'Menu-Agenda', 'calendario', 'Fecha');  
});
            
$("#txt-buscar-mobile, #txt-buscar-desk").bind('keypress keydown keyup', function(e){
   if(e.keyCode == 13) {
        ga('send', 'event', 'Menu-Agenda', 'opcion', 'Buscar');
        e.preventDefault();
   }
});
            
/*Inicio Contacto - Publicar*/
$("#link-contacto").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'opcion', 'contacto');
});

$("#link-publicar").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'opcion', 'publique');
});
/*Fin Contacto - Publicar*/

/*Inicio compartir en Cards*/
$(".fa-share-alt").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'compartir');
});

$(".icon-whatsapp").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'whatsapp');
});

$(".icon-facebook").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'facebook');
});

$(".icon-googleplus").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'google+');
});

$(".icon-twitter").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'twitter');
});
/*Fin compartir en cards*/