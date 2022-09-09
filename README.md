<<<<<<< HEAD
# Open Meeting Toolkit
Educational materials to replicate [open meetings policy](openmeetingspolicy.com) in any North Carolina community.

Our work in progress creating a website to host the toolkit can be found [here](https://code-for-the-carolinas.github.io/openmeetingtoolkit).
# Table of contents

1. [Problem](#problem)
2. [Solution](#solution)
3. [Action](#action)
4. [How to Contribute](#how-to-contribute)
4. [Acknowledgments](#acknowledgments)
5. [Contact](#contact)

---

# Problem
In practice, residents face barriers to attending and participating in local government meetings, even when they have the legal right to do so. Put yourself in the position of someone who needs to request time off work to attend a public meeting. Would you know far enough in advance when the issue that concerns you will be on the agenda? If you rely on public transportation, can you attend a Planning Board meeting at 7pm? Did the online responses to COVID make it easier for you to participate, or create new technological barriers? These challenges and many more mean that even when North Carolina's open meetings law gives "the general public a right to attend official meetings of public bodies," that right is not always realized in practice.

# Solution
In preparation for the Hackathon, Code for the Carolinas is developing an Open Meeting Toolkit that will allow teams of volunteers to evaluate their local government’s public meetings and to make recommendations. At the Hackathon, local teams will launch a Meeting Marathon, to run through the end of 2022.  In the Meeting Marathon, individuals or teams commit to attend and evaluate 5K, 10K, or 26 public meetings. During the Hackathon, local teams will complete an environmental scan of their communities. Code for the Carolinas and other Hackathon volunteers will support these local teams. This project will scale the impact of the Open Meetings Policy by partners Code for Asheville and Sunshine request by extending their work throughout North Carolina.

# Action
- Add public meeting information to state map in a jump-right-in, hands on activity that may involve internet searches or adapting simple scripts. 
- Complete environmental scan STEEPLE analysis for local communities. 
- Local teams commit to a schedule of 5, 10, or 26 public meetings to attend and evaluate by the end of 2022. 
- Learn how to use Toolkit to evaluate meetings, analyze results, and develop recommendations. 
- Offer feedback on usability of Toolkit.
  
# How to Contribute
1. [Volunteer](https://www.democracylab.org/projects/1021) - roles needed: <br>
    - Volunteer Engagement
    - User Researcher
    - Data Analyst
    - Data Visualization
    - UI Designer
    - Subject Matter Expert: SME: Political Reform

2. [Infographics for Hackathon](https://drive.google.com/file/d/1rDgtecClKOVJc6c39xRqD7hBCdk9BDHQ/view)
3. [Hacktember to Remember](https://www.democracylab.org/events/hacktember2022/projects/1021) -sign up for the hackathon on September 10, 2022

# Acknowledgments
- DemocracyLab
- Code for America
  - Code for the Carolinas
  - Code for Asheville

# Contact
- [Meetup](https://www.meetup.com/codeforthecarolinas/)
- [Website](http://codeforthecarolinas.org/)
- [Slack](https://codeforthecarolinas.slack.com/join/shared_invite/zt-ggwi3ynm-f82eIgTN2_CUFxh_6t5hwQ#/shared-invite/email)
- [DemocracyLab](https://www.democracylab.org/projects/1021)
=======
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
5. In [Github](https://github.com/Code-for-the-Carolinas/openmeetingtoolkit) create a pull request from your gh-pages to code-for-the-Carolina's gh-pages, 
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
10. Don't forget to update the main branch with the changes you made in gh-pages in Github. Most of us have been manually updating it (copying the material from the file(s) we changed in gh-pages and pasting it in the correspoding file(s) in main--message in slack if you need more info about this)

# Getting the latest updates
Once you are ready to make more changes, you will need to do a pull request to get the lastest updates from the repo:
1. On your local machine, in the terminal do `git checkout main` --if you aren't already in the main branch. 
2. `git pull`
3. **BEFORE** making any changes: `git checkout gh-pages`
3. `git pull upstream gh-pages`
4. `git status` to double check you are up to date. 
3. Follow the above steps in Contributing to gh-pages, starting at #3 if you want to make any more changes. 

>>>>>>> gh-pages
