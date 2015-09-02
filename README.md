# Posta

Posta is a collaborative productivity tool for teams who manage multiple shared inboxes. Divide and conquer your own inbox at <a href="posta.work">www.posta.work</a>!

<img src="http://i.imgur.com/gY34Ego.jpg">

# Techonologies Used
* MEAN stack
* G-Mail API
* Socket.io
* Firebase

# Features
Posta provides the ability for the user to:
* Grant teammates access to a shared inbox
* Assign threads to a specfic teammate
* View a personal, consolidated inbox that displays all threads assigned to the user
* Participate in live chat unique to each thread, allowing users to comment on emails

### Looking Ahead
Eventually we'd like to add the ability to provide text analysis on incoming e-mails, as well as suggest canned responses based on the user's outbox.

# Challenges
### G-Mail API
Google's G-Mail API is updated notoriously often. As a result, we had to dig into much of the node modules ourselves to tweak the way we used them via trial-and-error. The API's response format is also not consistent, so we implemented a system that accounted for each response type. 

### Double OAuth
Users can sign up for our app using their G-Mail account, and then sync a <i>team</i> e-mail through another G-Mail account. Since we were using Passport.js to handle OAuth, we set up middleware that separated the user and team sign-in into separate routes, each requesting different sets of information from Google. We also ensured that the user’s signed in state was not overwritten by the team sign-in.

Interestingly, we discovered that we were able to use scope variables for the OAuth redirect that specifically weren't listed in Google's official documentation, but was detailed by Breno de Medeiros (a Google employee) in his <a href="http://stackoverflow.com/questions/14384354/force-google-account-chooser/14393492#14393492">Stack Overflow answer</a>.

### E-mail Format

