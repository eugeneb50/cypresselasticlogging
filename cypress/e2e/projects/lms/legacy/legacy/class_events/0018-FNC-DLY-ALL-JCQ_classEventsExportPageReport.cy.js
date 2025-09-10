import LMSComponents from '/cypress/e2e/page_objects/lms/lmsComponents.js'
import ClassEvents from '/cypress/e2e/page_objects/lms/class_events/classEvents.js'
import Reports from '/cypress/e2e/page_objects/lms/reports/reports.js'
import { qase } from 'cypress-qase-reporter/mocha'

const tags = ['@automation', '@lms', 'class_events', '@functionality', '@export', '@reports', Cypress.env('runEnv')]

Cypress.on('uncaught:exception', (err, runnable) => {
	return false
})

describe('LMS - Class Events - Functionality - Page Export', () => {
	const sidebar = new LMSComponents().Sidebar
	const events = new ClassEvents().Events
	const reportsList = new Reports().ReportsList
	const reportResults = new Reports().ReportResults

	beforeEach(() => {
		cy.session('admin_session', () => {
			cy.setBaseURL().setUser('admin', 0).loginLMS()
		})
		cy.setBaseURL().then(urlData => {
			cy.visit(`${urlData.baseURL}admin2/index`)
		})
	})

	afterEach(() => {
		if (cy.state('aliases')?.logLevel) {
			cy.get('@logLevel').then(logLevel => {
				if (cy.state('aliases')?.errorData) {
					cy.get('@errorData').then(errorData => {
						cy.sendTestResults(logLevel, tags, undefined, errorData)
					})
				} else {
					cy.sendTestResults(logLevel, tags)
				}
			})
		} else {
			cy.sendTestResults('error', tags)
		}
	})

	qase(
		18,
		it('LMS - Class Events - Functionality - Exports Class Events Page', () => {
			sidebar.assertSidebarLoading()
			sidebar.clickClassEvents()
			events.extractTableData().then(tableData => {
				cy.get('.is_loading').should('not.exist')
				events.clickGenerateReport().then(intercept => {
					events.goToReport()
					reportsList.openReportByID(intercept.response.guid).then(() => {
						reportResults.compareTableDataWithWarning(tableData).then(errorData => {
							if (errorData) {
								cy.wrap('warning').as('logLevel')
								cy.wrap(errorData).as('errorData')
							} else {
								cy.wrap('notice').as('logLevel')
							}
						})
					})
				})
			})
		}),
	)
})
