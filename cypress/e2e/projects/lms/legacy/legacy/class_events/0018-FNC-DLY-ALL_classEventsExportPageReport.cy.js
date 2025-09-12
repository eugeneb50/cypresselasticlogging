// Import page object models for LMS components, class events, and reports to interact with UI elements
import LMSComponents from '/cypress/e2e/page_objects/lms/lmsComponents.js'
import ClassEvents from '/cypress/e2e/page_objects/lms/class_events/classEvents.js'
import Reports from '/cypress/e2e/page_objects/lms/reports/reports.js'
import { qase } from 'cypress-qase-reporter/mocha'

// Define tags for test categorization and filtering
const tags = ['@automation', '@lms', 'class_events', '@functionality', '@export', '@reports', Cypress.env('runEnv')]

// Suppress uncaught exceptions to prevent test failures due to application errors
Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})

// Test suite for validating the Class Events page export functionality in the LMS
describe('LMS - Class Events - Functionality - Page Export', () => {
	// Initialize page object instances for sidebar, events, reports list, and report results
	const sidebar = new LMSComponents().Sidebar
	const events = new ClassEvents().Events
	const reportsList = new Reports().ReportsList
	const reportResults = new Reports().ReportResults

	// Set up test environment before each test
	beforeEach(() => {
		// Establish a session for admin user to avoid repeated logins
		cy.session('admin_session', () => {
			// Set base URL and log in as admin user
			cy.setBaseURL().setUser('admin', 0).loginLMS()
		})
		// Navigate to the LMS admin dashboard
		cy.setBaseURL().then(urlData => {
			cy.visit(`${urlData.baseURL}admin2/index`)
		})
	})

	// Send test results to Elastic after each test, including error data if present
	afterEach(() => {
		// Check if logLevel alias exists to determine the test outcome
		if (cy.state('aliases')?.logLevel) {
			cy.get('@logLevel').then(logLevel => {
				// If errorData alias exists, include it in the test results
				if (cy.state('aliases')?.errorData) {
					cy.get('@errorData').then(errorData => {
						cy.sendTestResults(logLevel, tags, undefined, errorData)
					})
				} else {
					// Send test results without error data if none exists
					cy.sendTestResults(logLevel, tags)
				}
			})
		} else {
			// Default to 'error' log level if no logLevel alias is set
			cy.sendTestResults('error', tags)
		}
	})

	// Qase test case ID 18: Verify the export functionality of the Class Events page
	qase(
		18,
		it('LMS - Class Events - Functionality - Exports Class Events Page', () => {
			// Verify that the sidebar is fully loaded before proceeding
			sidebar.assertSidebarLoading()
			// Navigate to the Class Events section
			sidebar.clickClassEvents()
			// Extract table data from the Class Events page for comparison
			events.extractTableData().then(tableData => {
				// Wait for the page to fully load
				cy.waitUntilLoaded()
				// Trigger the report generation and capture the response
				events.clickGenerateReport().then(intercept => {
					// Navigate to the reports section
					events.goToReport()
					// Open the generated report using the intercepted report ID
					reportsList.openReportByID(intercept.response.guid).then(() => {
						// Compare the exported report data with the original table data
						reportResults.compareTableDataWithWarning(tableData).then(errorData => {
							// If discrepancies are found, set warning log level and store error data
							if (errorData) {
								cy.wrap('warning').as('logLevel')
								cy.wrap(errorData).as('errorData')
							} else {
								// If no discrepancies, set notice log level
								cy.wrap('notice').as('logLevel')
							}
						})
					})
				})
			})
		}),
	)
})