# QRadar Mentor
QRadar Mentor is a web based platform that facilitate the configuration of a QRadar solution (IBM Security Solution).
The first capability of the tool is to Configure a QRadar Solution either through the guide which is a dynamic form or through the graphic editor. The final goal is to provide a single way to configure QRadar solutions around the globe, regardless of the solution size, deployment model, complexity, etc...
#### [Try the DEMO](http://qradarmentor.mybluemix.net/)

## Build & Development
### Setup

Fork and clone the repo. 
```shell
$ git clone https://github.com/RiahiKarim/QRadarMentorUI.git
```

`cd` into it and install npm dependencies:

```shell
$ cd QRadarMentorUI
$ npm install
```

Install grunt-cli:

```shell
$ npm install -g grunt-cli
```
Install bower dependencies:

```shell
$ bower install
```
(Choose angular#1.5.5)

This next step will be the only one you will use from now-on:

```shell
$ grunt serve
```

This will rebuild the site in dev mode (scripts are not minified etc.) and will start the application. You can access the site on `localhost:9000`.

####Note : 
The commands above will run locally only the front-end part of QRadar Mentor and consume a backend API deployed in the IBM Cloud Bluemix.
To build and start your own Backend API follow the instructons in this [repo](https://github.com/RiahiKarim/QRadarMentor.API), then you need to update the backEnd.url constant in [modules.module.js](https://github.com/RiahiKarim/QRadarMentorUI/blob/master/app/modules/app.module.js) to target the entry point of your backend API.
```javascript
...
}).constant("backEnd", {
   "url": "Your Backend API endpoint"
})
...
```

### Contribute
This project is under free license. If you want to contribute to the project you can simply fork this repo and make a Pull Request. To build a minified version, you can simply run the grunt task `grunt build`. The minified/uglified files are created in the [dist](https://github.com/RiahiKarim/QRadarMentorUI/tree/master/dist) folder.

### Documentation
This project project uses a form of [jsdoc](http://usejsdoc.org/) for all of its documentation.

This means that all the docs are stored inline in the source code and so are kept in sync as the code changes.

It also means that since the documentation is generated from the source code, the last version of the documentation can be provided and found in the [docs](https://github.com/RiahiKarim/QRadarMentorUI/tree/master/docs) folder by running the grunt task `grunt ngdocs`.

### Copyright and license
Code and documentation released under [the MIT license](https://github.com/RiahiKarim/QRadarMentorUI/blob/master/LICENCE).
