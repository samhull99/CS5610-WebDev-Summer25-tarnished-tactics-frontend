**TARNISHED TACTICS - ITERATION 3 PLANNED FEATURES**

IMPROVED HOMEPAGE
- Homepage displays highlights of websites and allows user action rather than being just a landing page

GUIDE GENERATION
- Guide generation based on build the user creates
- Overall gameplay strategy generation, pathing, combat strategy
- Individual boss guides per build
- Embedded videos
- Lore tidbits on guide pages

BUILD GENERATOR QUIZ
- Option for user to take a quiz to generate build based on answering questions regarding preferred playstyle and more

BUILD CREATION IMPROVEMENTS
- Photos for corresponding gear
- Selection for weapons, armor, and talismans rather than manual input
- Choosing starter class correctly changes starting stats
- Ability to rate other builds, average rating will be publicly visible

USER FORUM
- Simple user form for community discussion


**
TARNISHED TACTICS FRONTEND - ITERATION 2 FEATURES**

Deployed frontend: https://tarnished-tactics-frontend.uc.r.appspot.com/

UI ELEMENTS
- Added tagline
- Added togglable Elden Ring OST
- Banner of ingame screenshot

GOOGLE SIGN IN
- Google sign in implemented
- State is tracked to display additional options when signed in
- User info is secure (not stored anywhere)

BUILD LIST AND BUILD PAGE DISPLAY
- Styling of builds list page improved
- Added a detailed display page for individual builds

BUILD CREATION FEATURE
- Core feature of web app
- Option for user creation when signed in
- Several form fields to corresponding equipment slots
- Level calculation based on stat allocation
- Option for sharing public or keeping private
- Allows users to edit or delete their own builds



**
TARNISHED TACTICS FRONTEND - ITERATION 1 FEATURES**

CORE STRUCTURE
- React app with Elden Ring-themed styling (dark/gold colors)
- Component-based architecture with proper file organization

NAVIGATION
- Header with site title
- Working navbar (Home, Builds, Guides) with active states
- Page switching functionality

DATA PAGES
- Builds Page: Displays build data (stats, equipment, tags) from API
- Guides Page: Shows guide content (title, description, difficulty) from API
- Loading states and error handling

API INTEGRATION
- Environment-based configuration for local/production
- Connected to deployed backend: https://tarnished-tactics-backend.uc.r.appspot.com
- Successfully displays sample data from MongoDB Atlas

DEPLOYMENT
- Google Cloud App Engine ready

STATUS: Full-stack app working with live backend connection
