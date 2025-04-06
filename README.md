# AI Card Classifer
## Description
This project is a web application that allows users to record a video using their webcam and upload it to a server. 
The server processes the video to extract a frame, which is given to an AI.
The AI matches the frame with a TCG card and returns attributes of the given card.

## Technologies Used
* TypeScript
* JavaScript
* npm
* Angular
* HTML5
* CSS3

## Installation
Clone the repository:  
```
git clone https://github.com/kyrixx/ai-card-classifier.git
```
Navigate to the project directory:  
```
cd ai-card-classifier/packages/server
# or
cd ai-card-classifier/packages/client
```
Install the dependencies:
```
npm install
```

## Configuration
Create a `.env` file in the `packages/server` directory as a copy of `packages/server/.env.dist` file.
Add SSL certificates to the `./certs` directory, and configure them in the `.env` file.

## Usage
### Server
Check if all the assets are installed:
```
npm run check
```
Start the server: `npm run start`

### Client
Start the client with hmr: `npm run start`
Start the client statically: `npm run start:caddy`

Open your browser and navigate to https://localhost:4200 or https://localhost:8081.
