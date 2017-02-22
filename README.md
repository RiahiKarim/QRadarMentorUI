# QRadar Mentor

## Build & development

I.Run the database
==================


II.Run the API
=============



III.Run the client
==================
1. Install the NodeJS dependencies: npm install .

2. Install the Bower dependencies: bower install .

3.Change the bachEnd.url constant in modules.module.js to target your entry point of the api.

4. Run `grunt serve` for preview and run a live reload server on http://localhost:9000 .

### Contribute
This project is under free license. If you want to contribute to the project you can simply fork this repo and make a Pull Request. To build a minified version, you can simply run the grunt task `grunt build`. The minified/uglified files are created in the `dist` folder.

### Documentation
This project project uses a form of [jsdoc](http://usejsdoc.org/) for all of its documentation.

This means that all the docs are stored inline in the source code and so are kept in sync as the code changes.

It also means that since the documentation is generated from the source code, the last version of the documentation can be provided and found in the [docs](https://github.com/RiahiKarim/QRadarMentorUI/tree/master/docs) folder by running the grunt task `grunt ngdocs`.

### Copyright and license
Code and documentation released under [the MIT license](https://github.com/RiahiKarim/QRadarMentorUI/blob/master/LICENCE).
