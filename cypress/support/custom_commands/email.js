// ***********************************************
// ***********************************************
Cypress.Commands.add('getLastEmailBySubject', (subject, maxAttempts = 4, delayTime = 5000, attempts = 0) => {
	// const maxAttempts = 4;

	return cy.fixture('users').then(usersData => {
		attempts++
		cy.wait(5000)

		return cy
			.task('getLastEmailWithSubject', {
				user: 'automation@knowledgecity.pro',
				pass: usersData.tokens.imapPassword,
				subject: subject,
			})
			.then(emailBuffer => {
				if (emailBuffer.type !== 'Buffer') {
					if (attempts < maxAttempts) {
						// Wait for 5 seconds and retry
						cy.wait(delayTime)
						return cy.getLastEmailBySubject(subject, maxAttempts, delayTime, attempts)
					} else {
						throw new Error(`Maximum attempts reached: ${attempts}`)
					}
				} else {
					return emailBuffer
				}
			})
	})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('deleteLastEmailBySubject', (subject, maxAttempts = 4, attempts = 0) => {
	// const maxAttempts = 4;

	return cy.fixture('users').then(usersData => {
		attempts++
		return cy
			.task('deleteLastEmailWithSubject', {
				user: 'automation@knowledgecity.pro',
				pass: usersData.tokens.imapPassword,
				subject: subject,
			})
			.then(message => {
				if (!message) {
					if (attempts < maxAttempts) {
						// Wait for 5 seconds and retry
						cy.wait(5000)
						return deleteLastEmailBySubject(maxAttempts)
					} else {
						throw new Error(`Maximum attempts reached: ${attempts}`)
					}
				} else {
					cy.log(message)
				}
			})
	})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('deleteAllEmails', (maxAttempts = 4, attempts = 0) => {
	// const maxAttempts = 4;

	return cy.fixture('users').then(usersData => {
		attempts++
		return cy
			.task('deleteAllEmails', {
				user: 'automation@knowledgecity.pro',
				pass: usersData.tokens.imapPassword,
			})
			.then(result => {
				if (!result.success) {
					if (attempts < maxAttempts) {
						// Wait for 5 seconds and retry
						cy.wait(5000)
						// Retry deleting all emails
						return cy.deleteAllEmails(maxAttempts, attempts)
					} else {
						throw new Error(`Maximum attempts reached: ${attempts}`)
					}
				} else {
					return cy.log('All emails have been deleted successfully.')
				}
			})
	})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('moveAllEmailsToTrash', (maxAttempts = 4, attempts = 0) => {
	// const maxAttempts = 4;

	return cy.fixture('users').then(usersData => {
		attempts++
		return cy
			.task('moveAllEmailsToTrash', {
				user: 'automation@knowledgecity.pro',
				pass: usersData.tokens.imapPassword,
			})
			.then(result => {
				if (!result.success) {
					if (attempts < maxAttempts) {
						// Wait for 5 seconds and retry
						cy.wait(5000)
						// Retry deleting all emails
						return cy.moveAllEmailsToTrash(maxAttempts, attempts)
					} else {
						throw new Error(`Maximum attempts reached: ${attempts}`)
					}
				} else {
					return cy.log('All emails have been deleted successfully.')
				}
			})
	})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('getAllEmailsInInbox', (maxAttempts = 4, attempts = 0) => {
	// const maxAttempts = 4;
	const retryDelay = 5000

	return cy.fixture('users').then(usersData => {
		attempts++

		return cy
			.task('getAllEmailsInInbox', {
				user: 'automation@knowledgecity.pro',
				pass: usersData.tokens.imapPassword,
			})
			.then(emails => {
				if (!emails || emails.length === 0) {
					if (attempts < maxAttempts) {
						// Wait for retryDelay milliseconds and retry
						return cy.wait(retryDelay).then(() => {
							return cy.getAllEmailsInInbox(maxAttempts, attempts)
						})
					} else {
						throw new Error(`Maximum attempts reached: ${attempts}`)
					}
				} else {
					return emails
				}
			})
	})
})
