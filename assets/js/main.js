//Countdown-->

// Set the date we're counting down to
var countDownDate = new Date("Oct 19, 2019 15:37:25").getTime();

// Update the count down every 1 second
var x = setInterval(function () {

    // Get today's date and time
    var now = new Date().getTime();

    // Find the distance between now and the count down date
    var distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    document.getElementById("demo").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

    // If the count down is finished, write some text
    if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
    }
}, 1000);


$(function () {
    $('a[href*=#]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 500, 'linear');
    });
});

// Add pagination to data table containing cards
$(document).ready(function(){
    var table =  $('#section02');
    
    for (var i =0 ; i < 10; i++) {
      
      var $nr = $('<tr><td>A-' + i + '</td><td>B-' + i  + '</td></tr>');
      table.append($nr);
    }
    
    // after table is populated, initiate plug-in
    $('#section02').DataTable(
        { "lengthMenu": [[5, 10, -1], [5, 10, "All"]] 
    });
});
