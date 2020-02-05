# restfull_api
Implementing restfull api.

### To start app or test it
Check out `start.local.app.sh.dist` and `start.test.sh.dist`

##### DB:
Mongo\
To run it - better do it in docker\
You can find example in src/db/mongodb_docker

##### bcrypt package
To this package work on Windows I was forced to install some additional soft.\
Java JDK (Not JRE. Why? I have no time to figure out, but it's weird.)\
And windows-build-tools. So run in terminal (admin mode):\
npm i -g --production windows-build-tools

`App is deployed on heroku:`
[click](https://olehbondaruk-movies-api.herokuapp.com/)
