jQuery.ajaxSetup({ async: false });
$.getJSON('https://raw.githubusercontent.com/lugnitdgp/Hack-Day-2019/master/repos.json', (data) => {
  // console.log(data); // this will show the info it in firebug console
  let { repos } = data;
  let cardParent = document.getElementById('repo-cards');
  for (let index = 0; index < repos.length; index += 1) {
    let card = document.createElement('div');
    card.classList.add('col-12');
    card.classList.add('col-md-4');
    card.classList.add('p-3');

    let repoLink = repos[index].repo_link;
    repoLink = repoLink.split('/');
    let repoName = repoLink[repoLink.length - 1];
    let repoOwner = repoLink[repoLink.length - 2];
    let repoTags = '';
    $.get(`https://api.github.com/repos/${repoOwner}/${repoName}/tags`, (tags) => {
      repoTags = Object.keys(tags);
      if (repoTags === '') {
        repoTags = 'No tags specified';
      }
    });
    let repoLanguages = '';
    $.get(`https://api.github.com/repos/${repoOwner}/${repoName}/languages`, (languages) => {
      repoLanguages = Object.keys(languages);
    });
    card.innerHTML = `<div class="card">
            <div class="row no-gutters">
              <div class="col-12">
                <div class="card-body">
                  <a href="${repos[index].repo_link}"><h6 class="card-title">${repoName}</h6></a>
                  <p style="line-height:1rem">
                    <small>Owner: ${repoOwner}</small><br>
                    <small>Tags: ${repoTags}</small><br>
                    <small>Languages: ${repoLanguages}</small><br>
                  </p>
                </div>
              </div>
            </div>
          </div>
      `;
    cardParent.appendChild(card);
  }
});
