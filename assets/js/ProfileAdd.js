$.getJSON('https://raw.githubusercontent.com/lugnitdgp/Hack-Day-2019/master/data.json', function(data) {
    // console.log(data); // this will show the info it in firebug console
    var profileKeys = ["handle", "image_link", "message"];

    var  pageSize =  12;
    var  maxPages =  4;
    
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

    
    //adding profile card according to pagination
    var cardParent = document.getElementById('profile-cards');
    var  addCard = function (start,end) {       
      cardParent.innerHTML= '';
      for (index = start; index < end; index++){ 
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
    }    

    //total pages for available cards
    var  pageTotal = Math.ceil( profiles.length  / pageSize) 


    //pagination integration with twbspagination plugin
    $('#pagination-demo').twbsPagination({
      totalPages: pageTotal,
      visiblePages: maxPages,
      onPageClick: function (event, page) {
        addCard((page-1) *pageSize,page*pageSize)
      }
  });
  checkSize();
    

});

/**
 * snipppet inspired from https://www.fourfront.us/blog/jquery-window-width-and-media-queries
 */
$(document).ready(function() {
  // run test on initial page load
  // checkSize();

  // run test on resize of the window
  $(window).resize(checkSize);
});

//Function to the css rule
function checkSize(){ 
  if ($(".size-tracker").css("display") == "none" ){ 
     $(".page-item.prev").first().html('<a href="#" class="page-link">&laquo;</a>')
     $(".page-item.next").first().html('<a href="#" class="page-link">&raquo;</a>')
     $(".page-item.first").first().html('<a href="#" class="page-link">&lsaquo;</a>')
     $(".page-item.last").first().html('<a href="#" class="page-link">&rsaquo;</a>')
  }else{
    $(".page-item.prev").first().html('<a href="#" class="page-link">Previous</a>')
    $(".page-item.next").first().html('<a href="#" class="page-link">Next</a>')
    $(".page-item.first").first().html('<a href="#" class="page-link">First</a>')
     $(".page-item.last").first().html('<a href="#" class="page-link">Last</a>')
  }
}
