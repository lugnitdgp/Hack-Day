$.getJSON('../../data.json', function(data) {
    // console.log(data); // this will show the info it in firebug console
    var profiles = data.profiles;
    var cardParent = document.getElementById('profile-cards');
    for (index = 0; index < profiles.length; index++){
    var card = document.createElement('div');
    card.classList.add('col-12');
    card.classList.add('col-md-4');
    card.classList.add('p-3');

    var profile = profiles[index];
    card.innerHTML =
          `<div class="card">
            <div class="row no-gutters">
              <div class="col-4">
                <img src="${profile['image_link']}" class="card-img" alt="${profile['handle']}">
              </div>
              <div class="col-8">
                <div class="card-body">
                  <h6 class="card-title">${profile['handle']}</h6>
                  <p><small>${profile['message']}</small></p>
                </div>
              </div>
            </div>
          </div>
      `;
    cardParent.appendChild(card);
  }
});
