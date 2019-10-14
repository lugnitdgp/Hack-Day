$.getJSON('https://raw.githubusercontent.com/lugnitdgp/Hack-Day-2019/master/data.json', function(data) {
    // console.log(data); // this will show the info it in firebug console
    var profileKeys = ["handle", "image_link", "message"];
    /**
     * Check if a profile has handle image_link and message properties
     */
    var isProfileValid = function(profile) {
      return profileKeys.every(k => k in profile)
    };
    
    /**
     * Given an array of profiles, keep only one for handle (handle is the id of the profile)
     */
    var getUniqueProfiles = function(profiles) {
      return Array.from(new Set(profiles.map(p => p.handle))).map(id => {
        var profile = {}
        profileKeys.forEach(k => profile[k] = profiles.find(p => p.handle === id)[k])
        return profile;
      })
    }
    
    // get only unique and valid profiles 
    var profiles = getUniqueProfiles(data.profiles.filter(isProfileValid));
    
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
