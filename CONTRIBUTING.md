## Contribution Guidelines !

* Fork and Clone this repository.
```
git clone https://github.com/YASHMAROO/Hack-Day.git
cd Hack-Day
```
* Make a branch.
```
git checkout -b (branch-name)
```

* Add your Profile Card.
    1. Open data.json file in any text editor.
    2. Add a dictionary to the `profiles` array in the following format.
       ```
       {
          "image_link": "<link-to-your-avatar>",
          "handle": "<your-github-handle>",
          "message": "<your-message-to-the-community>"
       }
        ```
    3. Save your File.
    
    **NOTE:** Make sure to follow the format of dictionary. Commit message for profile card addition should be of the form *Added profile `profile_name`*

* Commit your code.
```
git add .
git commit -m "(brief description of what you have changed/fixed)"
git push -u origin (branch name)
```

* Go and open a pull request from your fork to the master branch of this repository. :tada:

* Please :star: this repo to make it more visible to new contributors.