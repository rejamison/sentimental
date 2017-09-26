sentimental
---

````bash
# update linux
sudo apt-get update
sudo apt-get upgrade

# install required libraries
sudo apt-get install sox libsox-fmt-all
sudo apt-get install libmagic-dev libatlas-base-dev

# install NVM
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# install Node
nvm install node

# install the sentimental project
git clone git@github.com:rejamison/sentimental.git
cd sentimental
npm install

# run the project
node index.js
````