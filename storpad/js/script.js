    $(document).ready(function() {
        var menuBtn = $('.notifyDrop');
        var menu = $('.popupnotification');

         menuBtn.on('click', function (event){
            event.preventDefault();
            menu.toggleClass('popupnotification__active');
    });
    
});

$('.dropdownTitle').click(function () {
        $(this).next('.dropdownBlock').slideToggle();
});
/*$('.dropdownTitle').click(function() {
  $(this).next('.dropdown').toggleClass('droprotate');
});*/
/*$(this)('.dropdownTitle').click(function() {
  $(this)('.dropdown').toggleClass('droprotate');
});
*/
$('.object-size').click(function() {
  $('.objectHead-size').toggleClass('size-icondrop');
  $('.objectHead-size').toggleClass('size-iconup');
});
document.querySelector('.dSet').onclick = function() {
  document.querySelector('.cSet').classList.toggle('droprotate');
}
document.querySelector('.dCor').onclick = function() {
  document.querySelector('.cCor').classList.toggle('droprotate');
}
document.querySelector('.dBan').onclick = function() {
  document.querySelector('.cBan').classList.toggle('droprotate');
}
document.querySelector('.dCol').onclick = function() {
  document.querySelector('.cCol').classList.toggle('droprotate');
}

    var theInput1 = document.getElementById("colorBlockLogo1");
    var theColor1 = theInput1.value;
    var theInput2 = document.getElementById("colorBlockLogo2");
    var theColor2 = theInput2.value;

    theInput1.addEventListener("input", function() {
    
    document.getElementById("inputColor1").innerHTML = theInput1.value;
    document.getElementById("inputColor1").value = theInput1.value;
    document.getElementById("inputColor2").innerHTML = theInput2.value;
    document.getElementById("inputColor2").value = theInput2.value;
    });

    theInput2.addEventListener("input", function() {
    
    document.getElementById("inputColor2").innerHTML = theInput2.value;
    document.getElementById("inputColor2").value = theInput2.value;
    });

/*function myFunction() {
  var element = document.getElementById("myDIV");
  element.classList.toggle("mystyle");
}*/
/*var all = document.querySelectorAll('.titleShowcase');

all.forEach((e) => {
  e.addEventListener('click', () => {
    document.querySelector('.dropdown').classList.toggle('droprotate');
  })
});*/