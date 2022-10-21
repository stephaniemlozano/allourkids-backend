#!/bin/bash

#give permission for everything in the aws-node-crud-api directory
sudo chmod -R 777 /home/ubuntu/allourkids-backend

#navigate into our working directory where we have all our github files
cd /home/ubuntu/allourkids-backend

#add npm and node to path
export NVM_DIR="$HOME/.nvm"	
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # loads nvm	
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # loads nvm bash_completion (node is in path now)

#install node modules
nvm install 16
nvm use 16
node -v
npm install

#start our node app in the background
pm2 start index.js