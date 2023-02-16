# About
This is an API for the project YouPipe(https://github.com/WarlockJa/youpipe) written with NextJS 18. It processes requests to MongoDB allowed by CORS list of origins and JWT authorization data of the requests.

# Install procedure

1) clone this repository and run "npm install" to install dependencies
2) rename file "env_template" into ".env" file and replace its content with your data
  MONGODB_URI='MongoDB connect line example: mongodb+srv://<YOUR_MONGOB_CONNECT_DATA>.mongodb.net/<YOURPROJECT>?retryWrites=true&w=majority '
  DB requirements: 
  a) You need to be registered on "https://www.mongodb.com/"
  b) Created cluster in MongoDB
  c) Created DB 'youpipe'
  d) Created DB collections: 'comments', 'users', 'videos'. Their structure can be found in this project catalogue 'model'.
  
  PORT='Local port number for development mode'
  
  To generate JWT tokens type 'node' and enter. In node command line type "require('crypto').randomBytes(64).toString('hex')" for each token
  ACCESS_TOKEN_SECRET='Generated JWT Access Token'
  REFRESH_TOKEN_SECRET='Generated JWT Refresh Token'
  
  For proper CORS interaction make sure that both client and the API have matching http/https addresses
  For development mode you can remove CORS allowed origin protection in 'config/corsOptions.js'
  ALLOWED_ORIGIN_FRONT_END='Allowed origing URL exmaple https://youpipe.warlockja.ru'
  ALLOWED_ORIGIN_DEV='local development address'
  
3) launch application with 'npm run dev'
