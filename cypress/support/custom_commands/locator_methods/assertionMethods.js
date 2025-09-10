import { lmsDropdownTags, lmsCheckboxTags } from '../../common_tags/selectorTags.js'
import { tableTags } from '../../common_tags/tableTags.js'

Cypress.Commands.add('assertVisibility', element => {
	cy.get(element).should('be.visible')
})

Cypress.Commands.add('waitUntilLoaded', () => {
	cy.get('.is_loading').should('not.exist')
})

Cypress.Commands.add('waitUntilTableLoaded', { prevSubject: 'optional' }, subject => {
	if (subject) {
		return cy.wrap(subject).find(tableTags.tableLoadingClass).should('not.be.visible')
	} else {
		return cy.get(tableTags.tableLoadingClass).should('not.be.visible')
	}
})
