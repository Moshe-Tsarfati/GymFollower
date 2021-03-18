# GymFollower
This project is an app for the gym lovers. Created by OOP and pure HTML, CSS (SCSS), JS. 

# Table of contents

 - [Introduction and app features](#introduction-and-app-features)
 - [Instructions](#instructions)
 - [Technologies](#technologies)

# Introduction and app features

Gym Follower is a full solution app created to help you track your progress at the gym and do gym-related calculations easier.
The main feature are:

 1. Create new workouts and weekly training programs
 2. Search for workouts and track your performance (Gym log)
 3. Edit and delete workouts
 4. Set timers to manage rests between sets
 5. Convert and calculate results with different tools
 6. Add General notes and workout notes 

# Instructions

 Although the app is very intuitive here are some instructions on how to use it.
**First open the app** by downloading the project files then inside the "dist" folder open the index.html **OR**  follow this link [GymFollower](https://www.moshecv.com/gymFollower/index.html).

## 1. Create new workout:

In the top of the Home page you'll see "Create New Workout" section, to create new workout fill the form with proper values according to each placeholder. You can add/subtract exercises with the blue buttons. when finished click the green "Add Workout" button.

## 2. Search for workouts and log sets:
**Search Workout:**
Home page -> Filter Workouts (on the screen bottom) -> Type the name of the workout you created then click enter to see it's log . If the search value matches multiple workouts you'll get all the results.

**Log Sets:**
In the workout window you'll see all the exercises and sets as created in clause 1 ("Create new workout"). Now you can log set by typing the weight (or resistance band) and the amount of reps performed. 
**To log the set press `Enter` when on reps input or click the check button next to it.**
## 3. Save the workout log
In the workout window below the workout name you'll see the "workout tools bar". click the **save log** button to save all the current workout stats including: sets, reps, weights and workout notes.  
## 4. Auto generated warm-ups and total workout volume
**Auto Generated warm-ups:**
GymFollower helps you to create a typical standard warm-up easily.
Log the **first set** by typing the weight and the reps. Then when the mouse cursor is on the **reps** input (input focus) click `Enter`, The standard warm up will be generated automatically.
NOTE: Only works when both weight and reps  input are filled. 

**Auto Generated Total volume:**
On the bottom of the workout window the current total workout volume is auto-calculated.

## 5. Create weekly training programs
Navbar -> My Plan -> Training Schedule Tab-> Add Program .
1. Fill the desired workout for each day (auto-completion is suggested)
2. In days you don't want to workout set "rest day" in the checkbox on the right .
3. Write Some notes if necessary.
## 6. Set Your current training program
Navbar -> My Plan ->  Training Schedule Tab -> Click on program name to make it your current one.

**Why should you set your current program?**
When you set your current program the workout of today is automatically opened when you launch the app.
**Note:** Make sure you only have one "current program" at any given time.
## 7. Edit or Delete existing workout
**Edit workouts:**
Navbar -> My Plan -> My Workouts Tab -> Click the Edit button in the row of the workout you want to edit,
All the workout data is converted into inputs. you can add/subtract exercises and change all the workout data. After you are satisfied with the changes click the "Done" button.
**Note:** Changed will apply after the page reloads.

**Delete workouts:**
Navbar -> My Plan -> My Workouts Tab -> Click the "Delete" red button in the row of the workout you want to Delete. Confirm deletion.
**Note:** Changed will apply after the page reloads.

## 8. Using timers 
**Add timer:**
Navbar -> Timers ->  Add Timer -> Fill the form in the pop-up window with proper values and click "Add Timer".

**Use timer:**
Navbar -> Timers -> Go to the timer you want and click on the desired action button (play, pause, reset).

**Delete timers:** 
Navbar -> Timers -> Delete Timer -> Click on timers you want to delete then click "Done" in the menu below.

## 9. Using Tools
Navbar -> Tools

In the Tools section you have different calculators which helps you to do common "gym calculations" like:

 - Convert Lbs to Kg (LBS to Kg Calculator).
 - To find how much weight you should load on each side of the barbell to get a certain weight total (Barbell Setup Calculator).
 - Body Weight Exercise Calculator.
 - Find out what how much weight is currently loaded on your barbell (Total Weight Calculator).
 - **NOTE:** Some of the calculation parameters can be auto-filled according to your setting. (see 10. Settings)
## 10. Settings
Navbar -> Settings

Before using the app it's recommended to change the settings to your Liking. In the  settings you can change **timers** behavior and set **your current weight** (YW) and the **weight of the barbell you're using** (BW) these can help you to use the "Tools" more efficiently.

# Technologies
This Project is based on:

 - Html
 - Scss
 - Css
 - JavaScript 
 
 **More useful information:**
 - The project is mainly based on object oriented programming (OOP)
 - All the user's data is saved via Local Storage
 - The app is adapted and tested on google chrome only. I'm aware of that and since programming is not my main focus updates are expected in the future.

 



 

