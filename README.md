# GRADER NOTES
User interface with data by at least 2 CRUD operations (create, read, update, delete) for at least one database table
- Create, read, update, and delete for builds and guides databases. At least 3 different UI routes (appearing to the user as different pages)
Home page, builds page, build detail page, build creator, guides page, guide detail page, guide creator, my builds page (when signed in)
- At least one Bootstrap UI component not featured in the demo application
Used badge Bootstrap UI component, however I mostly used custom CSS, and added background music.
- Different layout and design from the demo application; it should not look like an obvious clone
Self evident
- 3rd party library for React (not including React DnD, unless its use is completely different from the use in the demo project)
framer-motion animation library for transitioning between pages and hovering over build/guide cards

# Tarnished Tactics - Feature Overview
Please see next section to see iteration 3 specific features.
Deployed frontend: https://tarnished-tactics-frontend.uc.r.appspot.com
# Homepage
<img width="2880" height="2842" alt="image" src="https://github.com/user-attachments/assets/c712325f-7171-4bde-8958-7305389e68d3" />

## 1. Browse Builds
**Feature Description:**  
Comprehensive build discovery system with advanced filtering and viewing options.

**How It Works:**
- **Public Build Library:** Access community-created builds and preset builds from the development team.
- **Dual View Modes:** Switch between grid view (visual cards) and list view (compact details) for optimal browsing.
- **Build Type Indicators:** Visual badges distinguish between:
  - 👤 **User Build**
  - 📋 **Preset**
- **Detailed Build Cards:** Display starting class, level, key stats (VIG, STR, DEX, INT, FAI), main weapon, and timestamps.
- **Clickable Navigation:** Links to detailed build pages for in-depth analysis of stats, equipment, and strategies.
- **Real-time Updates:** Library refreshes automatically with latest community contributions.
<img width="2880" height="1567" alt="image" src="https://github.com/user-attachments/assets/59a4b134-f11e-4cf5-8085-054d645b919b" />


---

## 2. Read Guides
**Feature Description:**  
Comprehensive strategy guide system providing gameplay advice and build optimization tips.

**How It Works:**
- **Community Guide Library:** Access user-generated guides for different playstyles and strategies.
- **AI-Generated Content:** Intelligent system analyzes build data to create tailored strategies.
- **Categorized Content:** Organize by difficulty, build type, and gameplay focus (PvP, PvE, boss strategies).
- **Associated Build Integration:** See how guides connect directly to relevant builds.
- **Rich Content Support:** Include text formatting, equipment recommendations, and step-by-step progression.
- **Search & Discovery:** Filter guides by categories and player needs.
<img width="2880" height="2631" alt="image" src="https://github.com/user-attachments/assets/19a9bb1b-f744-478c-8095-4ecfa1e4584f" />


---

## 3. Create Your Own
**Feature Description:**  
Build and guide creation and management with detailed stat tracking and customization.

**How It Works:**
- **Interactive Build Creator:** Real-time level calculation while creating custom builds.
- **Dynamic Stat Allocation:** Input all eight core stats (Vigor, Mind, Endurance, Strength, Dexterity, Intelligence, Faith, Arcane).
- **Equipment Tracking:** Manage weapons, armor sets, and talisman configurations.
- **Tag System:** Add custom tags for categorization and searching.
- **Privacy Controls:** Toggle public or private visibility.
- **Edit & Update:** Full CRUD functionality with history tracking.
- **Validation & Error Handling:** Ensures correct and complete build data.
  <img width="2880" height="3550" alt="image" src="https://github.com/user-attachments/assets/54eab791-82c4-411d-ad4c-2085d985dba9" />
  <img width="2880" height="2966" alt="image" src="https://github.com/user-attachments/assets/5aa25da3-8319-4fb7-a232-8c182d7efda3" />

---

## 4. Generate AI Guides
**Feature Description:**  
AI-powered personalized strategy guide generation for any build.

**How It Works:**
- **Intelligent Build Analysis:** Understands stats, equipment, and starting class.
- **Automated Content Generation:** Creates guides on combat, progression, equipment priorities, and tips.
- **Build-Specific Recommendations:** Suggests weapon scaling, spell usage, and combat tactics.
- **Strategy Optimization:** Highlights strengths, weaknesses, and situational advantages.
- **Universal Compatibility:** Works for any build (personal, community, or preset).
- **One-Click Generation:** Generates formatted content in seconds.
<img width="1813" height="153" alt="image" src="https://github.com/user-attachments/assets/1e90788b-4d21-4b3f-a9d5-1443ebe92dfc" />


---

## 5. Share & Collaborate
**Feature Description:**  
Community-driven sharing with social interaction features.

**How It Works:**
- **Public/Private Toggle:** Control build visibility.
- **Community Discovery:** Public builds appear in the main library.
- **Build Sharing URLs:** Share builds with unique links.
- **Cross-User Guide Generation:** Any public build can receive AI-generated guides from the community.
- **Build Attribution:** Clearly show build creators while respecting privacy.
- **Collaborative Learning:** Study, adapt, and contribute to build strategies.
- **Social Features:** View, analyze, and gain inspiration from others' creations.
<img width="2880" height="1567" alt="image" src="https://github.com/user-attachments/assets/b807daab-59e6-49dd-a31b-ea4f99237013" />


**

# TARNISHED TACTICS FRONTEND - ITERATION 3 FEATURES**
**Updated  Homepage**
- Give users tooltips on how to use the site.

**AI Generation of Guides**
- I implemented a feature using the OpenAI API to allow a user to generate a guide based on a build that they or other users created
- Seamless integration via an output of json object from API in backend
- **Intelligent Build Analysis:** Understands stats, equipment, and starting class.
- **Automated Content Generation:** Creates guides on combat, progression, equipment priorities, and tips.
- **Build-Specific Recommendations:** Suggests weapon scaling, spell usage, and combat tactics.
- **Strategy Optimization:** Highlights strengths, weaknesses, and situational advantages.
- **Universal Compatibility:** Works for any build (personal, community, or preset).
- **One-Click Generation:** Generates formatted content in seconds.

**More accurate build creation**
- Build creation now more accurately calculates level based on stats and allows starting at 0 for all stats and level 1

**Better Guide Creation**
- Overall format of guide list page was improved
- Allowed more detail to be input during guide creation

# TARNISHED TACTICS FRONTEND - ITERATION 2 FEATURES**

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
