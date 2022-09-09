# openmeetingstoolkit
Educational materials to replicate openmeetingspolicy.com in any North Carolina community

The toolkit site can be found here: https://code-for-the-carolinas.github.io/openmeetingtoolkit


---

# Contributing to gh-pages
If you would like to contribute please follow the below instructions:
1. After you fork the repo, go to your local machine and in the terminal and do the below steps:
  - `git clone <YOUR_REMOTE_URL>` - your SSH key
  - `git remote add upstream  <THEIR_REMOTE_URL>` -the SSH key of the repo you cloned
  - `git remote -v` to double check that your origin and upstream are correct. Origin will have a fetch and push with your URL and upstream will have a fetch and push of the repo URL you cloned from.
  - `git push --set-upstream origin gh-pages`
  - `git branch` - double check that you have main and gh-pages under your branch lists
2. Checkout gh-pages **BEFORE** making any changes
  - `git checkout gh-pages`
3. Make your changes 
4. Save and push your changes to Github:
  - `git add -A`
  - `git commit -m "description of changes"`
  - `git push`
5. Merge gh-pages to main branch in terminal:
  - `git checkout main`
  - `git merge gh-pages`
  - `git push`
  - `git status`, you might have to do other commands until the status says your branch is up to date. 
  
6. In [Github](https://github.com/Code-for-the-Carolinas/openmeetingtoolkit) create a pull request from your gh-pages to code-for-the-Carolina's gh-pages, 
  - click on Pull requests
  - click on New Pull request button -in green on the right
  - click on compare across forks link -at the top in blue
  - Make sure to select the correct repo and branch for the base & head repository--
  
  base respository: Code-for-the-Carolinas/openmeetingtoolkit & base: gh-pages 
  **you will have to select from dropdown menu to select your repo and gh-pages to compare:**
  
  (click on compare across forks link again to select what you are comparing if it goes away)
  
  should be like this:  
  ![screenshot of pull request](https://user-images.githubusercontent.com/97912154/188233686-b6512fab-a3ac-4406-92fe-68bee1bdcac5.jpg)
  - You will then see your pushed changes, select create pull request
  - Enter any optional comments and select create pull request - in green 
  - Select Merge pull request 
  - Select Confirm merge
7. Check the website to make sure it has your changes--please note it can take up to 15 minutes for the updates to pull through. 
8. Close out the github issue you worked on, if applicable 
9. Manually synch your forked repo to code-for-the-Carolina's by clicking the synch button in Github
10. Don't forget to update the main branch with the changes you made in gh-pages in Github. Most of us have been manually updating it (copying the material from the file(s) we changed in gh-pages and pasting it in the correspoding file(s) in main. You are able to do a pull request though from your repo's main to Code for Carolina's main though--message in slack if you need help)

# Getting the latest updates
Once you are ready to make more changes, you will need to do a pull request to get the lastest updates from the repo:
1. On your local machine, in the terminal do `git checkout main` --if you aren't already in the main branch. 
2. `git pull`
3. `git status`, you might have to do other commands until the status says your branch is up to date. 
4. **BEFORE** making any changes: `git checkout gh-pages`
5. `git pull upstream gh-pages`
6. `git status` to double check your branch is up to date. 
7. Follow the above steps in Contributing to gh-pages, starting at #3 if you want to make any more changes. 

