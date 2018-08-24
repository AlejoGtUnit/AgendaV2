
$(".publicar-evento").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'opcion', 'publique');
});

$(".fa-whatsapp").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'whatsapp');
});

$(".fa-facebook-f").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'facebook');
});

$(".fa-google-plus-g").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'google+');
});

$(".fa-twitter").on('click', function(){
    ga('send', 'event', 'Menu-Agenda', 'Shared', 'twitter');
});

