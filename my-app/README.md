# ProductiveYou Front-End
Code Institute PP05 Front-End

## Project Overview

This is ProductiveYou, my take on a productivity app for teams and workplaces. The aim is to give users the ability to sign up, assign teams and collaborate on task management. Users can choose a team to complete each task and set its priority, as well as assigning each task to a category, helping keep tasks organized.

This project works hand in hand with another project I’ve made [ProductiveYou API] which works as the back-end for this, creating a working database and allowing users to login and register, as well as opening up full crud functionality so they can create, read, update and edit tasks and categories.

## Design Process

During the design process I drew up some wireframes of how I expected pages to look, this game me a base for the front end UI. 

The site has a minimalistic design with a black background, White cards and the text alternates between white and black depending on the background. Cards are styled as bootstrap components and the buttons are also bootstraps default styling.

### Features

**Dynamic nav bar** - The project utilizes a dynamic navigation bar that updates once the user has logged in, see images below. This prevents a user being able to add tasks, categories or manipulate the site in any way without being registered. 

When the user isnt logged in the navbar only displays links to a **Sign in** and **Register** page as seen below.

[insert logged out nav bar image here]

When a user is logged in, the navbar displays links to the pages Tasks, Categories, Teams, the users profile, and the log out button. The users profile image and username appear in the navbar.

[insert logged in navbar]

**Responsive User Interface** - This project has a responsive UI that adapts to different screen sizes depending on what type of device the user is viewing the app on.

**Profile Page** - The profile page allows the user to update their name, give a bio and upload a profile photo, it also allows users to directly see what teams they are a part of.

**Real-time updates** - 

**Alerts**

## Security Practices

This project is linked to my ProductiveYou API that I built with Django using the REST framework and Allauth which is a python library that handles registration and the ability to login and out. When a user registers an account with this project the Django backend automatically creates a user profile. 

The site is designed in a way that only authenticated users can create, edit or delete anything on the site, this also prevents users from seeing tasks unless they are logged in.

## Component Usage

The app is broken down to a number of components to improve the speed and functionality. These components are:

- NavBar
- SignIn
- SignUp
- TaskPage
    - Task List
    - TaskForm
- CategoriesPage
    - categoryEdit
- ProfilePage
    - EditProfile
    - 

## Deployment Process

## Code Standards and Practices

### Front-end Code Standards

- Modular Component Use

The JSX Code practices for a react project are as follows:

- 

## Testing and Version Control

### Manual Testing

During testing of this project I run **npm start** which brings up the development server and a live preview of the site. I go through every page as I complete it and if there are error they are either notified in the terminal or through an error message on the preview. 

For pages that send or receive data through the API I use the chrome developer tools to see the terminal which will give more detailed information if there is an issue with a get or push request. then commit my changes and try to fix the error, with each step committing so that, if needed, I can go back through previous versions.

### Version Control

During the development of this React project I have continually used GitHub and Git for version control. With every project, there are huge benefits to using version control such as Git, examples of these are as follows:

- Collaboration - Git allows multiple developers to work on the same project simultaneously without the risk of overwriting each overs changed. This allows each developer to work on separate branches and it can be merged together when they have finished.
- Keeping track of history - When using Git there are a number of commit message conventions that I try to follow as closely as possible. These help keep changes clear and easy for other developers to see.

When using version control it is also important to follow the best practices, which I have attempted to do with this project, these are:

- Small or Incremental changes - committing frequently with small and logical changes helps keep track of details rather than large commits which can break everything.
- 

## Agile Project Management

### User Stories

A list of all the user stories and how they map to the project goals

For this project I’ve created a list of user stories and posted them as issues in the project repository that I have to work towards and fix. these user stories are as follows:

1. As a **Site User** I can **register an account** so that I can **keep track of ongoing tasks**
- Users are able to register an account
- users can log in and out of the app
- User login information is kept safe and secure

1. As a **Site User** I can **see my login status** so that I can **tell if I’m still logged in**
- Users can log in with their registered account
- Users can see their login status in the navigation bar of the app

1. As a **Site User** I can **set a due date for a task** so that I can **see if a task is overdue**
- Users are able to assign due dates to tasks
- Users can view the task due dates from the main screen
- Users are notified if their tasks are overdue

1. As a **Site User** I can **Add Teams** So that I can **Assign tasks to other users**
- Users are able to create and edit teams
- Users are able to assign specific tasks to teams

1. As a **Site User** I can **easily navigate the app** so that I can **always keep track of what page I’m on**
- A navbar is clearly positioned on the top of the app
- The active page is always highlighted in the navbar

1. As a **Site User** I can **Upload files** so that I can **provide more detail for tasks**
- Users can upload files to tasks
- users can view uploaded files on the on-going tasks page.

1. As a **Site User** I can **view existing tasks** so that I can **mark them as completed**
- Tasks have a completed button
- Tasks are visible and editable after they are created
- Users can view, edit and delete tasks.

### Agile Practices

## Front-End Libraries

This project is built using **React.js** a JavaScript library made for front end UI/UX development. On top of React.js I’m also using the following libraries:

- Bootstrap - a front end library for styling
- React-Bootstrap - a front end library
- React Router DOM