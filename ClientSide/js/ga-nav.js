$(document).ready(function(){
    $("#categoria-conciertos a").on('click', function(){
        ga('send', 'event', 'Menu-Agenda', 'categoria', 'conciertos');
    });
    
    $("#categoria-deportes a").on('click', function(){
        ga('send', 'event', 'Menu-Agenda', 'categoria', 'Deportes');
    });
        
    $("#categoria-cineteatro a").on('click', function(){
        ga('send', 'event', 'Menu-Agenda', 'categoria', 'CineTeatro');
    });
        
    $("#categoria-familiares a").on('click', function(){
        ga('send', 'event', 'Menu-Agenda', 'categoria', 'Familiares');
    });
        
    $("#categoria-gastronomia a").on('click', function(){
        ga('send', 'event', 'Menu-Agenda', 'categoria', 'Gastronomia');
    });
        
    $("#categoria-expedicionesviajes a").on('click', function(){
        ga('send', 'event', 'Menu-Agenda', 'categoria', 'ExpedicionesViajes');
    });
        
    $("#categoria-exposicionesconvenciones a").on('click', function(){
        ga('send', 'event', 'Menu-Agenda', 'categoria', 'ExposicionesConvenciones');
    });
        
    $("#categoria-vidanoctura a").on('click', function(){
        ga('send', 'event', 'Menu-Agenda', 'categoria', 'VidaNocturna');
    });    
});