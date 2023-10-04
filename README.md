# Video to MP4
A web application that uses Handbrake CLI to reduce the size of videos and export them into mp4's. Application is mobile friendly.

## Features
- SQLite as the database to keep track of the videos.
- Socket.io to create a websocket to share the progress of the Handbrake conversion to the front-end.
- Express.js for the back-end and EJS for the front-end.
- Unique Video filename generation to prevent duplicates and to obfuscate names.
- Can be self hosted on any server with Node.js installed.

## Instructions
- Go to Handbrakes website and download the appropriate CLI for your OS. https://handbrake.fr/downloads2.php
- Move that file into /lib if you are not setting it up as an Environment Variable.
- Copy the .env.sample to a file named .env and fill the following fields:
  - PORT can be any port number of your choosing that's available.
  - ENVIRONMENT has to be either DEV or PROD
  - DB_NAME is the name of the database that you want the program to create.
  - ENV_VAR can be set to true or false and tells the program whether or not HandBrakeCLI needs to be called as a program from the /lib folder or if it called as an Environment Variable.
  - RANDOM_NAME_SIZE is the amount of bytes that are used to determine that are used in the randomBytes() function.
- Run npm install and start the program.

## Future Features
- ~~Add a library page to allow browsing of videos.~~ ✅
- ~~Clean up the server messages to be less detailed and more focused on the percentage of completion done from Handbrake.~~ ✅
- Implement a progress bar for the Handbrake conversion instead of just text.
- Implement user accounts to associate videos with users.
