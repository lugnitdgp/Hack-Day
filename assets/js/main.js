// Countdown-->

// Set the date we're counting down to
let countDownDate = new Date('Oct 1, 2020 00:00:00').getTime();

// Update the count down every 1 second
let x = setInterval(() => {
// Get today's date and time
  let now = new Date().getTime();

  // Find the distance between now and the count down date
  let distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  let days = Math.floor(distance / (1000 * 60 * 60 * 24));
  let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id='demo'
  document.getElementById('days').innerHTML = `${days}d`;
  document.getElementById('hours').innerHTML = `${hours}h`;
  document.getElementById('minutes').innerHTML = `${minutes}m`;
  document.getElementById('seconds').innerHTML = `${seconds}s`;

  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById('demo').innerHTML = 'EXPIRED';
  }
}, 1000);

$(() => {
  $('a[href*="#"]').on('click', (e) => {
    e.preventDefault();
    $('html, body').animate({ scrollTop: $($(this).attr('href')).offset().top }, 500, 'linear');
  });
});
