let reposLink = 'https://raw.githubusercontent.com/lugnitdgp/Hack-Day/2019/repos.json';
let dataLink = 'https://raw.githubusercontent.com/lugnitdgp/Hack-Day/2019/data.json';
let year = 2019;
let parentContainer;

let getSortedCommits = (commits, data) => {
  commits.sort((a, b) => ((a.commit.committer.date > b.commit.committer.date) ? 1 : -1));
  commits.forEach(async (commit) => {
    // check if commit was made bw sept and dec
    if (commit.commit.committer.date >= new Date(`Sept 1, ${year} 00:00:00`).toISOString() && commit.commit.committer.date <= new Date(`Dec 31, ${year} 00:00:00`).toISOString()) {
      let dateOfCommit = commit.commit.committer.date.split('T', 1)[0];
      if (data.date.indexOf(dateOfCommit) === -1) {
        data.date.push(dateOfCommit);
        data.daily_commits.push(1);
      } else {
        let idx = data.date.indexOf(dateOfCommit);
        data.daily_commits[idx] += 1;
      }
    }
  });
};

let getCommits = async (data) => {
  let i = 0;
  for (let flag = 0; flag === 0;) {
    i += 1;
    await $.get(`https://api.github.com/repos/lugnitdgp/Hack-Day/commits?page=${i}&per_page=100`, (commits) => {
      if (commits.length === 0) {
        flag += 1;
      } else {
        commits.forEach((commit) => data.commits.push(commit));
      }
    });
  }
};

let getForks = async (data) => {
  let i = 0;
  for (let flag = 0; flag === 0;) {
    i += 1;
    await $.get(`https://api.github.com/repos/lugnitdgp/Hack-Day/forks?page=${i}&per_page=100`, (forks) => {
      if (forks.length === 0) {
        flag += 1;
      } else {
        forks.forEach((fork) => {
          // check if fork was made bw sept and dec
          if (fork.created_at >= new Date(`Sept 1, ${year} 00:00:00`).toISOString() && fork.created_at <= new Date(`Dec 31, ${year} 00:00:00`).toISOString()) {
            data.forks += 1;
          }
        });
      }
    });
  }
};

let getPRData = async (PRValues) => {
  // gets pr data
  let i = 0;
  for (let flag = 0; flag === 0;) {
    i += 1;
    await $.get(`https://api.github.com/repos/lugnitdgp/Hack-Day/pulls?state=all&page=${i}&per_page=100`, (pulls) => {
      if (pulls.length === 0) {
        flag += 1;
      } else {
        pulls.forEach((pull) => {
        // check if PR was sent/merged bw sept and dec
          if (pull.created_at >= new Date(`Sept 1, ${year} 00:00:00`).toISOString() && pull.created_at <= new Date(`Dec 31, ${year} 00:00:00`).toISOString()) {
            if (pull.state === 'closed') {
              if (pull.merged_at === null) {
                PRValues.closed += 1;
              } else {
                PRValues.merged += 1;
              }
            } else {
              PRValues.open += 1;
            }
          }
        });
      }
    });
  }
};

let getIssuesData = async (data) => {
  let i = 0;
  for (let flag = 0; flag === 0;) {
    i += 1;
    await $.get(`https://api.github.com/repos/lugnitdgp/Hack-Day/issues?state=all&page=${i}&per_page=100`, (issues) => {
      if (issues.length === 0) {
        flag += 1;
      } else {
        issues.forEach((issue) => {
        // check if issue was created/closed bw sept and dec
          if (!issue.pull_request) {
            if (issue.created_at >= new Date(`Sept 1, ${year} 00:00:00`).toISOString() && issue.created_at <= new Date(`Dec 31, ${year} 00:00:00`).toISOString()) {
              if (issue.state === 'closed') {
                data.closed += 1;
              } else {
                data.open += 1;
              }
            }
          }
        });
      }
    });
  }
};

// repo chart definiton
let getRepoChart = (noOfRepos, noOfProfiles, forks) => ({
  type: 'bar',
  data: {
    labels: ['Forks', 'Repo cards', 'Profile cards'],
    datasets: [{
      barThickness: 10,
      data: [forks, noOfRepos, noOfProfiles],
      backgroundColor: [
        '#FF8AE2', 'rgb(147, 194, 219)', '#FF8AE2',
      ],
      borderColor: [
        'dark-red',
        'dark-red',
        'dark-red',
      ],
      borderWidth: 1,
    }],
  },
  options: {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontSize: 10,
          fontStyle: 'bold',
          fontColor: 'black',
        },
      }],
      xAxes: [{
        barThickness: 50,
        ticks: {
          fontSize: 10,
          fontStyle: 'bold',
          fontColor: 'black',
        },
      }],
    },
    title: {
      display: true,
      text: 'Repo data',
      position: 'top',
      fontSize: 15,
      fontColor: 'black',
      fontStyle: 'bold',
      paddingBottom: 30,
    },
  },
});

// contributions chart definition
let getContribChart = (data) => ({
  type: 'pie',
  data: {
    labels: ['open', 'unmerged', 'merged'],
    datasets: [
      {
        fill: true,
        backgroundColor: ['#FF8AE2', 'rgb(147, 194, 219)', '#9C4668'],
        data: [data.open, data.closed, data.merged],
        borderColor: ['black', 'black', 'black'],
        borderWidth: [2, 2, 2],
      }],
  },
  options: {
    legend: {
      position: 'right',
      labels: {
        fontColor: 'black',
        fontSize: 10,
        fontStyle: 'bold',
      },
    },
    title: {
      display: true,
      text: 'Pull Requests',
      position: 'top',
      fontSize: 15,
      fontColor: 'black',
      fontStyle: 'bold',
      paddingBottom: 30,
    },
  },
});

let getCommitChart = (data) => ({
  type: 'line',
  data: {
    labels: data.date.map((date) => moment(date).format('MMM Do')),
    datasets: [{
      fill: true,
      backgroundColor: '#FF8AE2',
      data: data.daily_commits,
      borderColor: 'darkpink',
    },
    ],
  },
  options: {
    legend: {
      display: false,
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          fontSize: 20,
          fontColor: 'black',
        },
      }],
      xAxes: [{
        ticks: {
          fontSize: 10,
          fontColor: 'black',
        },
      }],
    },
    title: {
      display: true,
      text: 'Daily Commit Data',
      position: 'top',
      fontSize: 15,
      fontColor: 'black',
      fontStyle: 'bold',
      paddingBottom: 30,
    },
  },
});

let getIssuesChart = (data) => ({
  type: 'doughnut',
  data: {
    labels: ['open', 'closed'],
    datasets: [{
      fill: true,
      backgroundColor: ['#FF8AE2', 'rgb(147, 194, 219)'],
      data: [data.open, data.closed],
      borderColor: ['black', 'black'],
      borderWidth: [2, 2],
    }],
  },
  options: {
    legend: {
      position: 'right',
      labels: {
        fontColor: 'black',
        fontSize: 10,
        fontStyle: 'bold',
      },
    },
    title: {
      display: true,
      text: 'Issues',
      position: 'top',
      fontSize: 15,
      fontColor: 'black',
      fontStyle: 'bold',
      paddingBottom: 30,
    },
  },
});

let makeChart = (noOfRepos, noOfProfiles) => {
  let repochart = getRepoChart(noOfRepos, noOfProfiles, JSON.parse(localStorage.getItem('forks')));
  let contribchart = getContribChart(JSON.parse(localStorage.getItem('PRValues')));
  let commitchart = getCommitChart(JSON.parse(localStorage.getItem('commitValues')));
  let issuechart = getIssuesChart(JSON.parse(localStorage.getItem('issuesValues')));
  let charts = [repochart, contribchart, commitchart, issuechart];
  document.getElementById('contrib-value').innerHTML = noOfProfiles;
  parentContainer = document.getElementById('stats-cards');
  // parentContainer.classList.add('justify-content-center')
  for (let i = 0; i < charts.length; i += 1) {
    // create card for each chart
    let card = document.createElement('canvas');
    card.classList.add('stats-card');
    card.classList.add('col-12');
    card.classList.add('col-md-5');
    card.classList.add('p-2');
    card.classList.add('m-1');
    let ctx = card.getContext('2d');

    Chart.Title.prototype.afterFit = () => {
      this.paddingBottom += 50;
    };
    // eslint-disable-next-line no-unused-vars
    let newChart = new Chart(ctx, charts[i]);
    parentContainer.appendChild(card);
  }
};

$.when($.getJSON(reposLink), $.getJSON(dataLink)).done((repos, data) => {
  // data for number of repos,profile,forks chart
  let reposData = repos[0].repos;
  let profilesData = data[0].profiles;
  let noOfRepos = reposData.length;
  let noOfProfiles = profilesData.length;
  let forkValues = {
    forks: 0,
  };
    // data for no of PRs and closed PRs
  let PRValues = {
    open: 0,
    closed: 0,
    merged: 0,
  };
    // data for no of issues and closed issues
  let issuesValues = {
    open: 0,
    closed: 0,
  };
    // data for getting and sorting commits
  let commitValues = {
    daily_commits: [],
    date: [],
  };
  let commits = {
    commits: [],
  };
    // function call for getting all data and making charts after data received
  if (localStorage.getItem('isStored')) {
    makeChart(noOfRepos, noOfProfiles);
  } else {
    Promise.all([
      getCommits(commits).then(() => {
        getSortedCommits(commits.commits, commitValues);
      }),
      getForks(forkValues),
      getPRData(PRValues),
      getIssuesData(issuesValues),
    ])
      .then(() => {
        localStorage.setItem('isStored', true);
        localStorage.setItem('forks', JSON.stringify(forkValues.forks));
        localStorage.setItem('PRValues', JSON.stringify(PRValues));
        localStorage.setItem('commitValues', JSON.stringify(commitValues));
        localStorage.setItem('issuesValues', JSON.stringify(issuesValues));

        makeChart(noOfRepos, noOfProfiles);
      })
      .catch((err) => {
        throw (err);
      });
  }
});
