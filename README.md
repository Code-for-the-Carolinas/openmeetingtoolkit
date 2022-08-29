# openmeetingstoolkit
Educational materials to replicate openmeetingspolicy.com in any North Carolina community

The toolkit site can be found here: https://code-for-the-carolinas.github.io/openmeetingtoolkit


---

# Contributing to gh-pages
If you would like to contribute please follow the below instructions:
1. After you fork the repo to your local machine, go to the terminal and do the below:
  - `git clone <YOUR_REMOTE_URL>` - your SSH key
  - `git remote add upstream  <THEIR_REMOTE_URL>` -the SSH key of the repo you cloned
  - ``git remote -v` to double check that your origin and upstream are correct. Origin will have a fetch and push with your URL and upstream will have a fetch and push of the repo URL you cloned from.
  - `git checkout gh-pages`
  - `git push --set-upstream origin gh-pages`
  - `git branch` - double check that you have main and gh-pages under your branch lists
2. Make your changes 
3. Save and push your changes to Github:
  - `git add -A`
  - `git commit -m "decription of changes"
  - `git push`
4. Create a merge request from your gh-pages to code-for-the-Carolina's gh-pages
5. Approve the changes and make sure the website is up to date with the changes. Please note it can take up to 15 minutes for the updates to pull through. 
6. Manually synch your forked repo to code-for-the-Carolina's by clicking the synch button in Github

