# Desti #
A Social Food Review application

![Logo](https://raw.githubusercontent.com/Tan-Jia-Rong/Desti/main/assets/icon.png?token=GHSAT0AAAAAABULXMBUGKGS5H33YLDVAL2IYUUS32A)

Proposed level of achievement: Apollo 11

## Motivation ##

When visiting an unfamiliar area, one often finds themselves wondering about what kind of delicacies are there in the area.

A few features one would probably search are recent promotions, user review, and pictures of the dishes. However, searching the web for popular eateries nearby often returns ads and messy interfances, which leads to frustration.

Additionally, when comparing between eateries, one often have to open multiple tabs. As a result, people may find it a hassle and be iscouraged from discovering the hidden gems in their own  neighborhoods.

Furthermore, when deciding on what to eat - especially with friends, one might find themselves having trouble deciding on what to eat.

So wouldn't it be nice if there exist a place where you can find and put all the information you need about eateries in your area and something to help you filter down the restaurants to choose from?

## Aim ##
By providing relevant information to facilitate the decision-making process, we hope to make the process of choosing a restaurant easier by connecting users and store owners.

## User Stories ##

1. As a person having trouble deciding on what to eat, I would like to have someone to decide for me with the constraints that I have provided.

2. As a food enthusiast, I want to be able to share my food experience with the public.

3. As a person trying to find delicious food, I would want to look at honest reviews and ratings.

4. As a person trying to eat, I want to be able to know what my friends and people I'm following are planning to eat.

5. As a foodie, I want to have a collage of what I have eaten before and refer to past reviews of mine.

6. As a foodie, I want to be able to safekeep restaurants that U feel is worth coming back to.

7. As a person trying to decide on what to eat, I want to be able to compare between similarly-themed eateries to ultimately decide on one.

8. As a money-conscious person, I want to know of promotions by eateries currently happening around me.

9. As a money-conscious person, I would like to be updated of promotions by eateries around me.

10. As a person planning to eat, I would like to have a list to organize and bookmark on what I plan to eat.

11. As a person travelling to eat, I would like to know how to get to that location and the travelling time required.

## Scope of Project ##

1. A ***Home Page*** allows users to view food reviews by their friends and other users as well as post reviews.

2. A ***Map*** feature will be provided for the users to identify popular eateries around them with highlighted icons.

3. A ***Restaurant Search*** feature
    * Attached with brief details such as description and address
    * User can post reviews and ratings
    * User can bookmark the restaurants

4. A ***User Search*** feature
    * Attached with brief details such as description
    * User can follow other users, priortizing their reviews in the Home Page
    
5. A ***Roulette*** feature
    * Prompts the users for inputs - price range, maximum distance from current location, theme of eatery, several restaurants, etc
    * Construct a list of all available eateries that meets the constraints and return that list, while providing a roulette option to randomly decide on one.

6. An ***Bookmark*** feature
    * Allows Users to bookmark restaurants for future reference

## Software Development ##

### Considerations ###
* Goals
    * The application should be comprehensive to minimise the need to refer to other applications or website when choosing a restaurant. Thus, the features of the application should include most things that people need when choosing on what restaurant to dine in.
    * An easy-to-use interface

* Assumptions
    * It is assumed that users will have connection to the internet.

* How are we different from other platform?
    * Google Maps
      * Ranked according to ratings provided by all users and may not be accurate. We plan to rank the restaurants solely using ratings provided by our users.
    * Food Advisor
      * Does not provide ratings
      * Does not provide directions to restaurant
    * Burpple
      * Reviews can only be seen in restaurant page. We would like to provide a feeds screen similar to Instagram for users to view various restaurant other users reviewed to aid them in searching for a new restaurant.
      * Does not have a roulette function to aid the users in selecting a restaurant to dine in. Often users uses food application because they are unsure of what to eat.


### Activity Diagram ###
![Activity Diagram](https://raw.githubusercontent.com/Tan-Jia-Rong/Desti/main/.github/ActivityDiagram.png?token=GHSAT0AAAAAABULXMBVMMRL5XSEW4QN3US6YUUS4TQ)

The activity diagram shows the overview of the actions that users can take at various page and the relationship between pages in the application.

### Technical Stack ###
* Visual Studio Code
* Firebase
* React Native
* Expo

### Implementation ###
* Account System
    * Link to Firebase Authentication: authentication using email and password
    * FirebaseAuth.AuthStateListener: If there is already a user signed in, application will skip login page when launched.

## Development Plan ##
<table>
  <tbody>
    <tr>
      <th>Week</th>
      <th>Tasks</th>
    </tr>
     <tr>
      <td>4 (31/5 - 6/6)</td>
      <td>
        <ul>
          <li>Do up Firebase Database</li>
          <li>Home Page : real time update of Review's + Add Review button</li>
          <li>Review Page : Add Review to Home Page + Upload Photo </li>
        </ul>
      </td>
     </tr>
    <tr>
      <td>5 (7/6 - 13/6)</td>
      <td>
        <ul>
          <li>Restaurant Page + features</li>
          <li>Link Reviews to Restaurant Page</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>6 (14/6 - 20/6)</td>
      <td>
        <ul>
          <li>Bookmark Page + features</li>
          <li>Link Restaurant Page to Bookmarks</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>7 (21/6 - 27/6)</td>
      <td>
        <ul>
          <li>Map Feature</li>
          <li>Search Feature</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>8 (28/6 - 4/7)</td>
      <td>
        <ul>
          <li>Roulette Feature</li>
          <li>To be filled</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>9 (5/7 - 11/7)</td>
      <td>
        <ul>
          <li>Profile Page</li>
          <li>Edit Profile Page</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>10 (12/7 - 18/7)</td>
      <td>
        <ul>
          <li>To be filled</li>
          <li>To be filled</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>11 (19/7 - 25/7)</td>
      <td>
        <ul>
          <li>To be filled</li>
          <li>To be filled</li>
        </ul>
      </td>
    </tr> 
  </tbody>
</table>

## Project Log ##
<table>
  <tbody>
    <tr>
      <th>Task</th>
      <th>Date</th>
      <th>Wei Rui</th>
      <th>Jia Rong</th>
      <th>Remarks</th>
    </tr>
    <tr>
        <td style="text-align: center; vertical-align: middle;">
          Mission Control 1
        </td>
        <td style="text-align: center; vertical-align: middle;">14/05/22</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">React Native 1st Workshop</td>
    </tr>
    <tr>
        <td style="text-align: center; vertical-align: middle;">
          Mission Control 1
        </td>
        <td style="text-align: center; vertical-align: middle;">14/05/22</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">SupaBase 1st Workshop</td>
    </tr>
    <tr>
        <td style="text-align: center; vertical-align: middle;">
          Mission Control 1
        </td>
         <td style="text-align: center; vertical-align: middle;">21/05/22</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">React Native 2nd Workshop</td>
    </tr>
    <tr>
        <td style="text-align: center; vertical-align: middle;">
          Mission Control 1
        </td>
         <td style="text-align: center; vertical-align: middle;">21/05/22</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">SupaBase 2nd Workshop</td>
    </tr>
    <tr>
        <td style="text-align: center; vertical-align: middle;">
          Mission Control 1
        </td>
         <td style="text-align: center; vertical-align: middle;">21/05/22</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">Catch up on Git Workshop</td>
    </tr>
    <tr>
        <td style="text-align: center; vertical-align: middle;">
          Mission Control 2
        </td>
         <td style="text-align: center; vertical-align: middle;">28/05/22</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">UI/UX 1st Workshop</td>
    </tr>
    <tr>
        <td style="text-align: center; vertical-align: middle;">
          Learning of React Native (React, CSS, HTML, JSX)
        </td>
         <td style="text-align: center; vertical-align: middle;">14/05/22-30/05/22</td>
        <td style="text-align: center; vertical-align: middle;">12hrs</td>
        <td style="text-align: center; vertical-align: middle;">12hrs</td>
         <td style="text-align: center; vertical-align: middle;">Time spent on docs, YouTube guides etc</td>
    </tr>
     <tr>
        <td style="text-align: center; vertical-align: middle;">
          SignUp/Login Screen (UI)
        </td>
        <td style="text-align: center; vertical-align: middle;">23/05/22-26/05/22</td>
        <td style="text-align: center; vertical-align: middle;">6hrs</td>
        <td style="text-align: center; vertical-align: middle;">4hrs</td>
         <td style="text-align: center; vertical-align: middle;">UI for login/signup screen</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;"> FireBase Authentication </td>
        <td style="text-align: center; vertical-align: middle;">23/05/22-29/05/22</td>
        <td style="text-align: center; vertical-align: middle;">4hrs</td>
        <td style="text-align: center; vertical-align: middle;">8hrs</td>
         <td style="text-align: center; vertical-align: middle;">firebase Auth for login/signup screen</td>
     </tr>
     <tr>
        <td style="text-align: center; vertical-align: middle;">
          Mock Up of Application with Navigation
          <ul> Feeds Page</ul>
          <ul> Profile Page</ul>
          <ul> Map Page</ul>
          <ul> Settings Page</ul>
          <ul> Restaurants Page</ul>
          <ul> Roulette Page</ul>
        </td>
        <td style="text-align: center; vertical-align: middle;">28/05/22-30/05/22</td>
        <td style="text-align: center; vertical-align: middle;">2hrs</td>
        <td style="text-align: center; vertical-align: middle;">4hrs</td>
         <td style="text-align: center; vertical-align: middle;">Various screens basic UI</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Learning of firebase cloud firestore and storage</td>
        <td style="text-align: center; vertical-align: middle;">01/06/22-27/06/22</td>
        <td style="text-align: center; vertical-align: middle;">12</td>
         <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">Time spent on docs, YouTube guides etc</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Learning of google places API</td>
        <td style="text-align: center; vertical-align: middle;">01/06/22-27/06/22</td>
        <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">12</td>
         <td style="text-align: center; vertical-align: middle;">Time spent on docs, YouTube guides etc</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Add reviews screen and its functionality</td>
        <td style="text-align: center; vertical-align: middle;">01/06/22-02/06/22</td>
        <td style="text-align: center; vertical-align: middle;">10</td>
         <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">Adding of reviews to firebase and displaying on feeds screen</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Feeds screen and its functionality</td>
        <td style="text-align: center; vertical-align: middle;">01/06/22-03/06/22</td>
        <td style="text-align: center; vertical-align: middle;">5</td>
         <td style="text-align: center; vertical-align: middle;">1</td>
         <td style="text-align: center; vertical-align: middle;">Scroll feed and see other's reviews</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Maps screen and its functionality</td>
        <td style="text-align: center; vertical-align: middle;">01/06/22-16/06/22</td>
        <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">16</td>
         <td style="text-align: center; vertical-align: middle;">Map to see nearby restaurants with real time gps tracking and a get directions functionality</td>
     </tr>
      <tr>
      <td style="text-align: center; vertical-align: middle;">Direction screen and its functionality</td>
        <td style="text-align: center; vertical-align: middle;">01/06/22-27/06/22</td>
        <td style="text-align: center; vertical-align: middle;">0</td>
         <td style="text-align: center; vertical-align: middle;">4</td>
         <td style="text-align: center; vertical-align: middle;"Real time gps tracking and a get directions functionality</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Profile screen and its functionality</td>
        <td style="text-align: center; vertical-align: middle;">05/06/22-08/06/22</td>
        <td style="text-align: center; vertical-align: middle;">9</td>
         <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">Edit own profile and see own posts</td>
     </tr>
      <tr>
      <td style="text-align: center; vertical-align: middle;">Restaurant screen and input screen</td>
        <td style="text-align: center; vertical-align: middle;">07/06/22-27/06/22</td>
        <td style="text-align: center; vertical-align: middle;">1</td>
         <td style="text-align: center; vertical-align: middle;">10</td>
         <td style="text-align: center; vertical-align: middle;">Search up restaurants and get restaurant details</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Followers-based system</td>
        <td style="text-align: center; vertical-align: middle;">15/06/22-23/06/22</td>
        <td style="text-align: center; vertical-align: middle;">8</td>
         <td style="text-align: center; vertical-align: middle;">0</td>
         <td style="text-align: center; vertical-align: middle;">Emulate a social app with actual followers and following</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Search users screen</td>
        <td style="text-align: center; vertical-align: middle;">22/06/22-23/06/22</td>
        <td style="text-align: center; vertical-align: middle;">4</td>
         <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">Look up users to add followers</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Sync firebase with google</td>
        <td style="text-align: center; vertical-align: middle;">26/06/22-27/06/22</td>
        <td style="text-align: center; vertical-align: middle;">8</td>
         <td style="text-align: center; vertical-align: middle;">3</td>
         <td style="text-align: center; vertical-align: middle;">Sync firebase data with google to potray restaurant screen</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Design A1 poster</td>
        <td style="text-align: center; vertical-align: middle;">26/06/22-27/06/22</td>
        <td style="text-align: center; vertical-align: middle;">1</td>
         <td style="text-align: center; vertical-align: middle;">5</td>
         <td style="text-align: center; vertical-align: middle;">Redesign a new poster for milestone 2</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Map Page: Fix Bugs and Improve UI of Maps</td>
        <td style="text-align: center; vertical-align: middle;">26/06/22-04/07/22</td>
        <td style="text-align: center; vertical-align: middle;">1</td>
         <td style="text-align: center; vertical-align: middle;">6</td>
         <td style="text-align: center; vertical-align: middle;">Improve UI by setting boundaries
         Implement description to restaurant page navigation</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Add Review Screen: Implement Tags Feature</td>
        <td style="text-align: center; vertical-align: middle;">26/06/22-04/07/22</td>
        <td style="text-align: center; vertical-align: middle;">5</td>
         <td style="text-align: center; vertical-align: middle;">3</td>
         <td style="text-align: center; vertical-align: middle;"></td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Restaurant Page: Link tags to restaurant</td>
        <td style="text-align: center; vertical-align: middle;">05/07/22-11/07/22</td>
        <td style="text-align: center; vertical-align: middle;">3</td>
         <td style="text-align: center; vertical-align: middle;">0</td>
         <td style="text-align: center; vertical-align: middle;"></td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Roulette Feature: Link tags to users</td>
        <td style="text-align: center; vertical-align: middle;">05/07/22-11/07/22</td>
        <td style="text-align: center; vertical-align: middle;">3</td>
         <td style="text-align: center; vertical-align: middle;">1</td>
         <td style="text-align: center; vertical-align: middle;"></td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Roulette Feature: Implement Algorithm</td>
        <td style="text-align: center; vertical-align: middle;">12/07/22-18/07/22</td>
        <td style="text-align: center; vertical-align: middle;">12</td>
         <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">Create algorithm page and implement algorithm</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Bookmark Page: Create CSS and details for bookmark Page</td>
        <td style="text-align: center; vertical-align: middle;">12/07/22-18/07/22</td>
        <td style="text-align: center; vertical-align: middle;">0</td>
         <td style="text-align: center; vertical-align: middle;">4</td>
         <td style="text-align: center; vertical-align: middle;">Made flatlist for bookmark, implemented navigation from bookmark, and added the swipe to delete bookmark feature</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Input Screen: Implement search by filter functionality</td>
        <td style="text-align: center; vertical-align: middle;">12/07/22-18/07/22</td>
        <td style="text-align: center; vertical-align: middle;">6</td>
         <td style="text-align: center; vertical-align: middle;">0</td>
         <td style="text-align: center; vertical-align: middle;">Filter by ratings, price level, and tags</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Improve UI of Restaurant Screen</td>
        <td style="text-align: center; vertical-align: middle;">12/07/22-18/07/22</td>
        <td style="text-align: center; vertical-align: middle;">0</td>
         <td style="text-align: center; vertical-align: middle;">5</td>
         <td style="text-align: center; vertical-align: middle;">Improve on the looks of Restaurant Screen</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Improve on README for MS3</td>
        <td style="text-align: center; vertical-align: middle;">12/07/22-25/07/22</td>
        <td style="text-align: center; vertical-align: middle;">6</td>
         <td style="text-align: center; vertical-align: middle;">16</td>
         <td style="text-align: center; vertical-align: middle;">Drastically changed the direction of README to better align with the feedback from MS2</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">System Testing: Testing of application and fixing of bugs (if any)</td>
        <td style="text-align: center; vertical-align: middle;">18/07/22-21/06/22</td>
        <td style="text-align: center; vertical-align: middle;">6</td>
         <td style="text-align: center; vertical-align: middle;">6</td>
         <td style="text-align: center; vertical-align: middle;"></td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">User Testing: Design questionaire and distribute application to friends for feedback</td>
        <td style="text-align: center; vertical-align: middle;">18/07/22-25/07/22</td>
        <td style="text-align: center; vertical-align: middle;">4</td>
         <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">Obtained valuable feedback for us to fix any urgent issues, and consider the rest as possible future improvements</td>
     </tr>
      <tr>
      <td style="text-align: center; vertical-align: middle;">Improve on app based on user testing and fixing of bugs</td>
        <td style="text-align: center; vertical-align: middle;">23/07/22-25/07/22</td>
        <td style="text-align: center; vertical-align: middle;">3</td>
         <td style="text-align: center; vertical-align: middle;">3</td>
         <td style="text-align: center; vertical-align: middle;">Time taken by us to fix urgent issues related to user testing</td>
     </tr>
      <tr>
      <td style="text-align: center; vertical-align: middle;">Final update of README for MS3</td>
        <td style="text-align: center; vertical-align: middle;">23/07/22-25/07/22</td>
        <td style="text-align: center; vertical-align: middle;">1</td>
         <td style="text-align: center; vertical-align: middle;">4</td>
         <td style="text-align: center; vertical-align: middle;">Improved the standard of MS3 with compiliations of everything project-related (eg how the app runs, tech stack used, the testing we did...)</td>
     </tr>
      <tr>
      <td style="text-align: center; vertical-align: middle;">Make video for MS3 and final product advertisement</td>
        <td style="text-align: center; vertical-align: middle;">23/07/22-25/07/22</td>
        <td style="text-align: center; vertical-align: middle;">4</td>
         <td style="text-align: center; vertical-align: middle;">2</td>
         <td style="text-align: center; vertical-align: middle;">Created a concise app-walkthrough video for advertisement uses</td>
     </tr>
     <tr>
      <td style="text-align: center; vertical-align: middle;">Total Hours</td>
        <td style="text-align: center; vertical-align: middle;">NIL</td>
        <td style="text-align: center; vertical-align: middle;">152</td>
        <td style="text-align: center; vertical-align: middle;">153</td>
         <td style="text-align: center; vertical-align: middle;">NIL</td>
     </tr>
  </tbody>
</table>
