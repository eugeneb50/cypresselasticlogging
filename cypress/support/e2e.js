// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import 'cypress-localstorage-commands'
import 'cypress-axe'
import './commands'
//import "cypress-mochawesome-reporter/register";
//import addContext from "mochawesome/addContext";
//import cypress/grep

require('cypress-terminal-report/src/installLogsCollector')({
	xhr: {
		printHeaderData: false,
		printRequestData: false,
	},
})

// Import commands.js using ES2015 syntax:
require('cypress-plugin-tab')

const registerCypressGrep = require('@cypress/grep')
registerCypressGrep()

// Alternatively you can use CommonJS syntax:
// require('./commands')
