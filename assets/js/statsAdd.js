var repos="https://raw.githubusercontent.com/lugnitdgp/Hack-Day/2020/repos.json";
var data="https://raw.githubusercontent.com/lugnitdgp/Hack-Day/2020/data.json";
var year=2019;

$.when($.getJSON(repos),$.getJSON(data)).done(function(repos,data){
    
    // data for number of repos,profile,forks chart
    var repos=repos[0].repos;
    var profiles=data[0].profiles;

    var no_of_repos=repos.length;
    var no_of_profiles=profiles.length;

    var fork_values={
        forks:0
    };

    // data for no of PRs and closed PRs 
    var PR_values={
        open:0,
        closed:0,
        merged:0
    };

    //data for no of issues and closed issues
    var issues_values={
        open:0,
        closed:0
    };

    //data for getting and sorting commits
    var commit_values={
        daily_commits:[],
        date:[]
    }

    var commits={
        commits:[]
    }

    //function call for getting all data and making charts after data received
    Promise.all([
        getCommits(commits).then(()=>{
            getSortedCommits(commits.commits,commit_values)
        }),
        getForks(fork_values),
        getPRData(PR_values),
        getIssuesData(issues_values)
    ])
    .then(()=>{

        var repochart=getRepoChart(no_of_repos,no_of_profiles,fork_values.forks); 
        var contribchart=getContribChart(PR_values);
        var commitchart=getCommitChart(commit_values);
        var issuechart=getIssuesChart(issues_values);

        var charts=[repochart,contribchart,commitchart,issuechart]

        document.getElementById('contrib-value').innerHTML=no_of_profiles

        var parentContainer=document.getElementById('stats-cards');
        parentContainer.classList.add('justify-content-center')
        
        for(i=0;i<charts.length;i++)
        {
            //create card for each chart
            var card=document.createElement('canvas');
            card.classList.add('stats-card');
            card.classList.add('col-12');
            card.classList.add('col-md-4');
            card.classList.add('p-3');
            var ctx=card.getContext('2d');

            var newChart=new Chart(ctx,charts[i])
            parentContainer.appendChild(card);
        }
    })
    .catch((err)=>{
        console.log(err)
    })
})

var getSortedCommits=(commits,data)=>{
    commits.sort((a,b)=>(a.commit.committer.date > b.commit.committer.date) ? 1 : -1)
    commits.forEach(async (commit)=>{
        //check if commit was made bw sept and dec
        if(commit.commit.committer.date>=new Date(`Sept 1, ${year} 00:00:00`).toISOString() && commit.commit.committer.date<=new Date(`Dec 31, ${year} 00:00:00`).toISOString())
        {
            var date_of_commit=commit.commit.committer.date.split('T',1)[0];
           
            if(data.date.indexOf(date_of_commit)==-1)
            {
                data.date.push(date_of_commit)
                data.daily_commits.push(1);
            }
            else{
                var idx=data.date.indexOf(date_of_commit)
                data.daily_commits[idx]++;
            }
        }
    })
}

var getCommits=async(data)=>{
    try 
    {
        var i=0;
        var flag=0;
        while(flag==0)
        {
            ++i;
            await $.get(`https://api.github.com/repos/lugnitdgp/Hack-Day/commits?page=${i}&per_page=100`,(commits)=>{
                if(commits.length==0)
                {
                    ++flag;
                }
                else
                {
                    commits.forEach((commit)=>data.commits.push(commit));
                }
            }) 
        }  
    } 
    catch (error) 
    {
        console.log(error)  
    }
}

var getForks=async(data)=>{
    try 
    {
        var i=0;
        var flag=0;
        while(flag==0)
        {
            ++i;
            await $.get(`https://api.github.com/repos/lugnitdgp/Hack-Day/forks?page=${i}&per_page=100`,function(forks)
            {
                if(forks.length==0)
                {
                    ++flag;
                }
                else
                {
                    forks.forEach((fork)=>{
                        //check if fork was made bw sept and dec
                        if(fork.created_at>=new Date(`Sept 1, ${year} 00:00:00`).toISOString() && fork.created_at<=new Date(`Dec 31, ${year} 00:00:00`).toISOString())
                        {
                            data.forks++;
                        }
                    })
                }
            }) 
        }  
    } 
    catch (error) 
    {
        console.log(error)  
    }
}


var getPRData=async (PR_values)=>{
    try 
    {
        //gets pr data
        var i=0;
        var flag=0;
        while(flag==0)
        {
            ++i;
            await $.get(`https://api.github.com/repos/lugnitdgp/Hack-Day/pulls?state=all&page=${i}&per_page=100`,function(pulls)
            {
                if(pulls.length==0)
                {
                    ++flag;
                }
                else
                {
                    pulls.forEach((pull)=>{
                        //check if PR was sent/merged bw sept and dec
                        if(pull.created_at>=new Date(`Sept 1, ${year} 00:00:00`).toISOString() && pull.created_at<=new Date(`Dec 31, ${year} 00:00:00`).toISOString())
                        {
                            if(pull.state=='closed')
                            {
                                if(pull.merged_at==null)
                                PR_values.closed++;
                                else
                                PR_values.merged++;
                            }
                            else
                            PR_values.open++;
                        }
                    })
                }
            }) 
        }  
    } 
    catch (error) 
    {
        console.log(error)  
    }
}

var getIssuesData=async (data)=>{
    try 
    {
        var i=0;
        var flag=0;
        while(flag==0)
        {
            ++i;
            await $.get(`https://api.github.com/repos/lugnitdgp/Hack-Day/issues?state=all&page=${i}&per_page=100`,function(issues)
            {
                if(issues.length==0)
                {
                    ++flag;
                }
                else
                {
                    issues.forEach((issue)=>{
                        //check if issue was created/closed bw sept and dec
                        if(!issue.pull_request)
                        if(issue.created_at>=new Date(`Sept 1, ${year} 00:00:00`).toISOString() && issue.created_at<=new Date(`Dec 31, ${year} 00:00:00`).toISOString())
                        {
                            if(issue.state=='closed')
                            data.closed++;
                            else
                            data.open++;
                        }
                    })
                }
            }) 
        }  
    } 
    catch (error) 
    {
        console.log(error)  
    }
}

//repo chart definiton
var getRepoChart=(no_of_repos,no_of_profiles,forks)=> {
    return {
        type:'bar',
        data:{
            labels:['Forks','Repo cards','Profile cards'],
            datasets:[{
                label:"Repo Data",
                barThickness:10,
                data:[forks,no_of_repos,no_of_profiles],
                backgroundColor:[
                    '#FF8AE2','rgb(147, 194, 219)','#FF8AE2'
                ],
                borderColor:[
                    'dark-red',
                    'dark-red',
                    'dark-red'
                ],
                borderWidth:1,
            }]
        },
        options:{
            legend:{
                labels:{
                    fontColor: 'black',
                    fontSize:25
                }
            },
            scales:{
                yAxes:[{
                    ticks:{
                        beginAtZero: true,
                        fontSize:20,
                        fontColor:"black"
                    }
                }],
                xAxes:[{
                    barThickness: 50,
                    ticks:{
                        fontSize:20,
                        fontColor:"black"
                    }
                }]
            }
        }
    }
}

// contributions chart definition
var getContribChart=(data)=>{
    return {
        type:'pie',
        data:{
            labels: ["open", "unmerged", "merged"],
            datasets: [
                {
                    fill: true,
                    backgroundColor: ['#FF8AE2','rgb(147, 194, 219)','#9C4668'],
                    data: [data.open, data.closed,data.merged],
                    borderColor:['black', 'black','black'],
                    borderWidth: [2,2,2]
            }]
        },
        options:{
            legend:{
                labels:{
                    fontColor: 'black',
                    fontSize:25
                }
            },
            title: {
                display: true,
                text: 'Pull Requests',
                position: 'top',
                fontSize:30,
                fontColor:"black"
            },
        }
    }
}

var getCommitChart=(data)=>{
    return{
        type:'line',
        data:{
            labels: data.date.map((date)=>moment(date).format('MMM Do')),
            datasets:[
                {
                    label:"Daily Number Of Commits",
                    fill:true,
                    backgroundColor:'#FF8AE2',
                    data:data.daily_commits,
                    borderColor:'darkpink',
                }
            ]
        },
        options:{
            legend:{
                labels:{
                    fontColor: 'black',
                    fontSize:25
                }
            },
            scales:{
                yAxes:[{
                    ticks:{
                        beginAtZero: true,
                        fontSize:20,
                        fontColor:"black"
                    }
                }],
                xAxes:[{
                    ticks:{
                        fontSize:10,
                        fontColor:"black"
                    }
                }]
            }
        }
    }
}

var getIssuesChart=(data)=>{
    return {
        type:'doughnut',
        data:{
            labels: ["open", "closed"],
            datasets: [
                {
                    fill: true,
                    backgroundColor: ['#FF8AE2','rgb(147, 194, 219)'],
                    data: [data.open, data.closed],
                    borderColor:['black', 'black'],
                    borderWidth: [2,2]
            }]
        },
        options:{
            legend:{
                labels:{
                    fontColor: 'black',
                    fontSize:25
                }
            },
            title: {
                display: true,
                text: 'Issues',
                position: 'top',
                fontSize:30,
                fontColor:"black"
            },
        }
    }
}