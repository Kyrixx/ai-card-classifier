# AI Card Classifer
## Description
This project is a web application that allows users to record a video using their webcam and upload it to a server. 
The server processes the video to extract a frame, which is given to an AI.
The AI matches the frame with a TCG card and returns attributes of the given card.

## Technologies Used
* JavaScript
* npm
* HTML5
* CSS3

## Installation
Clone the repository:  
```
git clone https://github.com/yourusername/your-repo-name.git
```
Navigate to the project directory:  
```
cd ai-card-classifier/packages/server
# or
cd ai-card-classifier/packages/client-vanilla
```
Install the dependencies:
```
npm install
```

## Usage
Start the server: `npm run start:server`

Start the client: `npm run start:client`

Open your browser and navigate to http://localhost:8080.  
Navigate to the "Content" page.

A call to http://localhost:3000/trigger will trigger the AI to process the video and return the card attributes.

## Configuration
Create a `.env` file in the `packages/server` directory as a copy of `packages/server/.env.dist` file.
