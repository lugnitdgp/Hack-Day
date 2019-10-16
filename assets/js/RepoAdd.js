jQuery.ajaxSetup({async:false});
$.getJSON('https://raw.githubusercontent.com/lugnitdgp/Hack-Day-2019/master/repos.json', function(data) {
    // console.log(data); // this will show the info it in firebug console
    var repos = data.repos;
    var cardParent = document.getElementById('repo-cards');
    for (index = 0; index < repos.length; index++){
    var card = document.createElement('div');
    card.classList.add('col-12');
    card.classList.add('col-md-4');
    card.classList.add('p-3');

    var repo_link = repos[index].repo_link;
    repo_link=repo_link.split("/");
    var repo_name=repo_link[repo_link.length-1];
    var repo_owner=repo_link[repo_link.length-2];
    var repo_tags="";
    $.get("https://api.github.com/repos/"+repo_owner+"/"+repo_name+"/tags", function(tags) {
      repo_tags=Object.keys(tags);
      if(repo_tags=="")
        repo_tags="No tags specified";
    })
    var repo_languages=""
    $.get("https://api.github.com/repos/"+repo_owner+"/"+repo_name+"/languages", function(languages) {
      repo_languages=Object.keys(languages);
    })
    card.innerHTML =
          `<div class="card">
            <div class="row no-gutters">
              <div class="col-12">
                <div class="card-body">
                  <a href="${repos[index].repo_link}"><h6 class="card-title">${repo_name}</h6></a>
                  <p style="line-height:1rem">
                    <small>Owner: ${repo_owner}</small><br>
                    <small>Tags: ${repo_tags}</small><br>
                    <small>Languages: ${repo_languages}</small><br>
                  </p>
                </div>
              </div>
            </div>
          </div>
      `;
    cardParent.appendChild(card);
  }
});
