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
2. Checkout gh-pages before making any changes
  - `git checkout gh-pages`
3. Make your changes 
4. Save and push your changes to Github:
  - `git add -A`
  - `git commit -m "description of changes"`
  - `git push`
5. Create a pull request from your gh-pages to code-for-the-Carolina's gh-pages
6. Approve & merge the changes and make sure the website is up to date with the changes. Please note it can take up to 15 minutes for the updates to pull through. 
7. Manually synch your forked repo to code-for-the-Carolina's by clicking the synch button in Github

# Getting the latest updates
Once you are ready to make more changes, you will need to do a pull request to get the lastest updates from the repo:
1. On your local machine, in the terminal do `git checkout main` --if you aren't already in the main branch. 
2. `git pull`
3. Follow the above steps in Contributing to gh-pages, starting at #2 if you want to make any more changes. 

