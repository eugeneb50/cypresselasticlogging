import { lmsDropdownTags, lmsCheckboxTags } from '../../common_tags/selectorTags.js'

Cypress.Commands.add('getDropdownSearchInput', { prevSubject: 'optional' }, subject => {
	if (subject) {
		return cy.wrap(subject).find(`${lmsDropdownTags.dropdownSearchClass} input`)
	} else {
		return cy.get(`${lmsDropdownTags.dropdownSearchClass} input`)
	}
})

Cypress.Commands.add('getDropdownOptions', { prevSubject: 'optional' }, subject => {
	if (subject) {
		return cy.wrap(subject).find(lmsDropdownTags.dropdownOption)
	} else {
		return cy.get(lmsDropdownTags.dropdownOption)
	}
})

Cypress.Commands.add('getButtonInElement', { prevSubject: 'optional' }, subject => {
	return cy.wrap(subject).find('button')
})

Cypress.Commands.add('getInputInElement', { prevSubject: 'optional' }, subject => {
	return cy.wrap(subject).find('input')
})

Cypress.Commands.add('getDropdownInElement', { prevSubject: 'optional' }, subject => {
	return cy.wrap(subject).find(lmsDropdownTags.dropdown)
})

Cypress.Commands.add('getDropdownButton', { prevSubject: 'optional' }, subject => {
	if (subject) {
		return cy.wrap(subject).find(lmsDropdownTags.dropdownButtonClass)
	} else {
		return cy.get(lmsDropdownTags.dropdownButtonClass)
	}
})

Cypress.Commands.add('getDropdownButtonOptions', { prevSubject: 'optional' }, subject => {
	if (subject) {
		return cy.wrap(subject).find(lmsDropdownTags.dropdownButtonOptionClass)
	} else {
		return cy.get(lmsDropdownTags.dropdownButtonOptionClass)
	}
})

Cypress.Commands.add('getCheckbox', { prevSubject: 'optional' }, subject => {
	if (subject) {
		return cy.wrap(subject).find(lmsCheckboxTags.checkboxClass)
	} else {
		return cy.get(lmsCheckboxTags.checkboxClass)
	}
})

Cypress.Commands.add('getUncheckedCheckbox', { prevSubject: 'optional' }, subject => {
	if (subject) {
		return cy.wrap(subject).find(lmsCheckboxTags.uncheckedCheckboxClass)
	} else {
		return cy.get(lmsCheckboxTags.uncheckedCheckboxClass)
	}
})

Cypress.Commands.add('getCheckedCheckbox', { prevSubject: 'optional' }, subject => {
	if (subject) {
		return cy.wrap(subject).find(lmsCheckboxTags.checkedCheckboxClass)
	} else {
		return cy.get(lmsCheckboxTags.checkedCheckboxClass)
	}
})

Cypress.Commands.add('uncheckCheckbox', { prevSubject: 'optional' }, subject => {
	const chain = subject ? cy.wrap(subject) : cy.get(lmsCheckboxTags.checkboxClass)

	return chain.then($checkbox => {
		if ($checkbox.find(lmsCheckboxTags.uncheckedCheckboxClass).length > 0) {
			return cy
				.wrap($checkbox)
				.find(lmsCheckboxTags.uncheckedCheckboxClass)
				.click()
				.click()
				.invoke('attr', 'class')
				.should('contain', lmsCheckboxTags.uncheckedCheckboxClass.replace('.', ''))
		} else {
			return cy
				.wrap($checkbox)
				.find(lmsCheckboxTags.checkedCheckboxClass)
				.click()
				.invoke('attr', 'class')
				.should('contain', lmsCheckboxTags.uncheckedCheckboxClass.replace('.', ''))
		}
	})
})

Cypress.Commands.add('checkCheckbox', { prevSubject: 'optional' }, subject => {
	const chain = subject ? cy.wrap(subject) : cy.get(lmsCheckboxTags.checkboxClass)

	return chain.then($checkbox => {
		if ($checkbox.find(lmsCheckboxTags.uncheckedCheckboxClass).length > 0) {
			return cy
				.wrap($checkbox)
				.find(lmsCheckboxTags.uncheckedCheckboxClass)
				.click()
				.invoke('attr', 'class')
				.should('contain', lmsCheckboxTags.checkedCheckboxClass.replace('.', ''))
		} else {
			return cy
				.wrap($checkbox)
				.find(lmsCheckboxTags.checkedCheckboxClass)
				.click()
				.click()
				.invoke('attr', 'class')
				.should('contain', lmsCheckboxTags.checkedCheckboxClass.replace('.', ''))
		}
	})
})

Cypress.Commands.add('getIFrameBody', attribute => {
	return cy.get(`iframe${attribute}`).its('0.contentDocument.body').should('not.be.empty').then(cy.wrap)
})

Cypress.Commands.add('typeAsUser', { prevSubject: 'optional' }, (subject, text) => {
	return cy.wrap(subject).focus().clear().type(text, { delay: 100 }).should('have.value', text)
})
