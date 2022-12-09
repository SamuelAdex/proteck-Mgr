window.localStorage

//Sidenav
$(document).ready(function(){
    $('.sidenav').sidenav();
});

//Modal
$(document).ready(function(){
  $('.modal').modal();
});


//Slider
$(document).ready(function(){
  $('.slider').slider();
});

//Select Input
$(document).ready(function(){
    $('select').formSelect();
});

/* Scrollspy */
$(document).ready(function(){
  $('.scrollspy').scrollSpy();
});

/* Dropdown */
$('.dropdown-trigger').dropdown();


const light = document.getElementById('light'),
      dark = document.getElementById('dark');
//let theme = document.getElementById('theme').href;
//let fault = document.getElementById('default').href;

light.addEventListener('click', function(){  
  localStorage.setItem('light', './public/materialize/css/light.css');
  document.getElementById('theme').href = localStorage.getItem('light')
  document.getElementById('default').href = "";
  console.log("Light Theme");
});


dark.addEventListener('click', function(){
  localStorage.setItem('dark', './public/materialize/css/dark.css');
  document.getElementById('default').href = "";
  document.getElementById('theme').href = localStorage.getItem('dark')  
  console.log("Dark Theme");
});

var d = new Date();
document.getElementById("demo").innerHTML = d.getFullYear();