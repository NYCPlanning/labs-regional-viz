[![CircleCI](https://circleci.com/gh/NYCPlanning/labs-regional-viz/tree/develop.svg?style=svg)](https://circleci.com/gh/NYCPlanning/labs-regional-viz/tree/develop)

# NYC Regional Visualization

An interactive mapping experience that highlights regional planning data and trends.

## How we work

[NYC Planning Labs](https://planninglabs.nyc) takes on a single project at a time, working closely with our customers from concept to delivery in a matter of weeks.  We conduct regular maintenance between larger projects.  

Take a look at our [sprint planning board](https://waffle.io/NYCPlanning/labs-regional-viz) to get an idea of our current priorities for this project.

## How you can help

In the spirit of free software, everyone is encouraged to help improve this project.  Here are some ways you can contribute.

- Comment on or clarify [issues](https://github.com/NYCPlanning/labs-regional-viz/issues)
- Report [bugs](https://github.com/NYCPlanning/labs-regional-viz/labels/bug)
- Suggest new features
- Write or edit documentation
- Write code (no patch is too small)
  - Fix typos
  - Add comments
  - Clean up code
  - Add new features

**[Read more about contributing.](CONTRIBUTING.md)**

## Requirements

You will need the following things properly installed on your computer.

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (with npm) **version listed in .nvmrc**
- [Ember CLI](https://ember-cli.com/)
- [Bower](https://bower.io/) (`bower install` is required for the remarkable and highlightsjs dependencies)
- [Google Chrome](https://google.com/chrome/)

## Local development

- Clone this repo: `git clone git@github.com:NYCPlanning/labs-regional-viz.git`
- `cd labs-regional-viz`
- Install Dependencies: `npm install` (or `yarn`)
- Start the server: `ember serve`
  - Visit your app at [http://localhost:4200](http://localhost:4200).
  - Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Testing and checks

- **ESLint** - We use ESLint with Airbnb's rules for JavaScript projects
  - Add an ESLint plugin to your text editor to highlight broken rules while you code
  - You can also run `eslint` at the command line with the `--fix` flag to automatically fix some errors.

- **Testing**
  - run `ember test --serve`
  - Before creating a Pull Request, make sure your branch is updated with the latest `develop` and passes all tests

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

- `ember build` (development)
- `ember build --environment production` (production)

## Deployment

- Create a Dokku remote: `git remote add dokku dokku@{dokkudomain}:regional-viz`
- Deploy to Dokku: `git push dokku master`


## Contact us

You can find us on Twitter at [@nycplanninglabs](https://twitter.com/nycplanninglabs), or comment on issues, and we'll follow up as soon as we can. If you'd like to send an email, use [labs_dl@planning.nyc.gov](mailto:labs_dl@planning.nyc.gov)
