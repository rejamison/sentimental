# sentimental

## Installing the Software
1.  Update the Pi
    ````bash
    sudo apt-get update
    sudo apt-get upgrade
    ````

1.  Install Required Packages
    ````bash
    sudo apt-get install sox libsox-fmt-all
    sudo apt-get install libmagic-dev libatlas-base-dev
    ````

1.  Install NVM
    ````bash
    wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.4/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
    ````

1.  Install Node
    ````bash
    nvm install node
    ````

1.  Configure Sound

    1.  Figure out your sound card's ID:
        ````bash
        arecord -l
        ````

    1.  Note the card number and create an asound.rc file in the user home path:

        ````bash
        vi ~/asound.rc
        ````

        With the content:
        
        ````
        pcm.!default {
            type hw
            card 1
        }
        
        ctl.!defult {
            type hw
            card 1
        }
        ````

1.  Install the Sentimental Project
    ````bash
    git clone git@github.com:rejamison/sentimental.git
    cd sentimental
    npm install
    ````

1.  Run the Project
    ````bash
    node index.js
    ````