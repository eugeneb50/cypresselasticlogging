// ***********************************************
// ***********************************************
Cypress.Commands.add('makeAPICall', (url, method, headers, form, body, status) => {
	return cy.fixture('testEnvs').then(testEnvs => {
		if (Cypress.env('portal') === 'automation-sa') {
			url = url.replace('knowledgecity.com', 'riyadbankacademy.com')
		} else {
			url = url.replace('knowledgecity.com', testEnvs[Cypress.env('environment')])
		}

		return cy
			.request({
				url: url,
				method,
				headers,
				form,
				body,
				log: false,
			})
			.then(response => {
				if (status) {
					expect(response.status).to.eq(status)
				}
				return response
			})
	})
})

// ***********************************************
// ***********************************************
// eslint-disable-next-line default-param-last
Cypress.Commands.add('makeFormAPICall', (url, method = 'POST', headers, formData, status) => {
	return cy.fixture('testEnvs').then(testEnvs => {
		if (Cypress.env('portal') === 'automation-sa') {
			url = url.replace('knowledgecity.com', 'riyadbankacademy.com')
		} else {
			url = url.replace('knowledgecity.com', testEnvs[Cypress.env('environment')])
		}
		return cy.window().then(win => {
			return new Promise((resolve, reject) => {
				win.fetch(url, {
					method: method,
					body: formData,
					headers: headers,
				})
					.then(response => {
						if (status && response.status !== status) {
							cy.log(`Expected HTTP status ${status}, got ${response.status}`)
							throw new Error(`Expected HTTP status ${status}, got ${response.status}`)
						} else {
							return response.json()
						}
					})
					.then(json => {
						resolve({ statusCode: status, body: json })
					})
					.catch(err => {
						cy.log(`Error in fetch request to ${url}: ${err.message}`)
						reject(err)
					})
			})
		})
	})
})

// ***********************************************
// ***********************************************
// eslint-disable-next-line default-param-last
Cypress.Commands.add('clickAndAssertCalls', (component, urls, type = 'GET', statusCode) => {
	const aliases = []
	let bodies = []
	let response

	urls = typeof urls === 'string' ? [urls] : urls
	urls.forEach((url, index) => {
		const alias = `intercept_${index}_${Date.now()}`
		aliases.push(alias)
		cy.intercept(type, url).as(alias)
	})

	//component.click()
	component.click({ force: true })

	return cy
		.wait(aliases.map(alias => `@${alias}`))
		.then(interceptions => {
			if (interceptions.length === 1 || interceptions.length === undefined) {
				if (statusCode) {
					cy.wrap(interceptions).its('response.statusCode').should('eq', statusCode)
				}
				response = interceptions
				bodies = interceptions.response.body
			} else {
				if (statusCode) {
					interceptions.forEach((interception, index) => {
						cy.wrap(interception).its('response.statusCode').should('eq', statusCode)
					})
				}
				response = interceptions
				bodies = interceptions.map(interception => interception.response.body)
			}
		})
		.then(() => {
			return bodies
		})
})

// ***********************************************
// ***********************************************
// eslint-disable-next-line default-param-last
Cypress.Commands.add('clickAndAssertCallsWait', (component, urls, type = 'GET', statusCode, tm) => {
	const aliases = []
	let bodies = []
	let response

	urls = typeof urls === 'string' ? [urls] : urls
	urls.forEach((url, index) => {
		const alias = `intercept_${index}_${Date.now()}`
		aliases.push(alias)
		cy.intercept(type, url).as(alias)
	})

	//component.click()
	component.click({ force: true })

	return cy
		.wait(
			aliases.map(alias => `@${alias}`),
			{ timeout: tm },
		)
		.then(interceptions => {
			if (interceptions.length === 1 || interceptions.length === undefined) {
				if (statusCode) {
					cy.wrap(interceptions).its('response.statusCode').should('eq', statusCode)
				}
				response = interceptions
				bodies = interceptions.response.body
			} else {
				if (statusCode) {
					interceptions.forEach((interception, index) => {
						cy.wrap(interception).its('response.statusCode').should('eq', statusCode)
					})
				}
				response = interceptions
				bodies = interceptions.map(interception => interception.response.body)
			}
		})
		.then(() => {
			return bodies
		})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('clickAndAssertMultCalls', (component, parameters) => {
	const aliases = []
	let bodies = []

	parameters.forEach((par, index) => {
		const url = par[0],
			type = par[1],
			statusCode = par[2]
		const alias = `intercept_${index}_${Date.now()}`
		aliases.push(alias)
		cy.intercept(type, url).as(alias)
	})

	component.click()

	aliases.forEach((alias, index) => {
		return cy
			.wait(`@${alias}`)
			.then(interceptions => {
				if (interceptions.length === 1 || interceptions.length === undefined) {
					if (parameters[index][2]) {
						cy.wrap(interceptions).its('response.statusCode').should('eq', parameters[index][2])
					}
					bodies = interceptions.response.body
				} else {
					if (parameters[index][2]) {
						interceptions.forEach((interception, index) => {
							cy.wrap(interception).its('response.statusCode').should('eq', parameters[index][2])
						})
					}
					bodies = interceptions.map(interception => interception.response.body)
				}
			})
			.then(() => {
				return bodies
			})
	})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('clickAndAssertMultCallsWithPayload', (component, parameters) => {
	const aliases = []
	const results = [] // Array to store the details of each call

	// Setup intercepts and aliases
	parameters.forEach((par, index) => {
		const url = par[0],
			type = par[1],
			statusCode = par[2]
		const alias = `intercept_${index}_${Date.now()}`
		aliases.push(alias)
		cy.intercept(type, url).as(alias)
	})

	// Perform the click action
	component.click()

	// Use reduce to sequentially process each alias
	// Initial promise to start the chain
	const allDone = aliases.reduce((promiseChain, alias, index) => {
		return promiseChain.then(() => {
			return cy.wait(`@${alias}`).then(interception => {
				// Construct and push an object with details from the interception
				results.push({
					alias,
					statusCode: interception.response.statusCode,
					response: interception.response.body,
					requestPayload: interception.request.body, // Accessing request payload
				})
				// Check status code if provided
				if (parameters[index][2]) {
					expect(interception.response.statusCode).to.eq(parameters[index][2])
				}
			})
		})
	}, cy.wrap(null)) // Start with a wrapped null to have a Cypress chainable

	// After all intercepts are processed, return the results array
	return allDone.then(() => results)
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('clickAndAssertMultCallsForced', (component, parameters) => {
	const aliases = []
	let bodies = []

	parameters.forEach((par, index) => {
		const url = par[0],
			type = par[1],
			statusCode = par[2]
		const alias = `intercept_${index}_${Date.now()}`
		aliases.push(alias)
		cy.intercept(type, url).as(alias)
	})

	component.click({ force: true })

	aliases.forEach((alias, index) => {
		return cy
			.wait(`@${alias}`)
			.then(interceptions => {
				if (interceptions.length === 1 || interceptions.length === undefined) {
					if (parameters[index][2]) {
						cy.wrap(interceptions).its('response.statusCode').should('eq', parameters[index][2])
					}
					bodies = interceptions.response.body
				} else {
					if (parameters[index][2]) {
						interceptions.forEach((interception, index) => {
							cy.wrap(interception).its('response.statusCode').should('eq', parameters[index][2])
						})
					}
					bodies = interceptions.map(interception => interception.response.body)
				}
			})
			.then(() => {
				return bodies
			})
	})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('clickAndAssertMultCallsBodiesForced', (component, parameters) => {
	const aliases = [],
		bodies = []

	parameters.forEach((par, index) => {
		const url = par[0],
			type = par[1],
			statusCode = par[2]
		const alias = `intercept_${index}_${Date.now()}`
		aliases.push(alias)
		cy.intercept(type, url).as(alias)
	})

	component.click({ force: true })

	aliases.forEach((alias, index) => {
		cy.wait(`@${alias}`).then(interception => {
			if (parameters[index][2]) {
				expect(interception.response.statusCode).to.eq(parameters[index][2])
			}
			// Add each body to the bodies array
			bodies.push(interception.response.body)
		})
	})

	// Use cy.then() to ensure all waits are completed and bodies are collected
	cy.then(() => {
		// Now 'bodies' contains the responses from all interceptions
		return bodies
	})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('sendElasticLog', (level = 'info', subject = 'QA_Log_', data = {}, tags = [], extra = {}) => {
	cy.fixture('users').then(users => {
		const myHeaders = new Headers()
		myHeaders.append('Content-Type', 'application/json')
		myHeaders.append('Authorization', users.tokens.elasticSend)
		const raw = {
			level: level,
			subject: subject,
			data: data,
			tags: tags,
			extra: {},
		}
		const envData = {
			environment: Cypress.env('environment'),
			portal: Cypress.env('portal'),
			lang: Cypress.env('lang'),
		}
		raw.extra = Object.assign(envData, extra)
		const requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: JSON.stringify(raw),
			redirect: 'follow',
		}
		fetch('https://logger.kcexp.pro?api=add_log', requestOptions)
			.then(response => response.text())
			// eslint-disable-next-line no-console
			.then(result => console.log(result))
			// eslint-disable-next-line no-console
			.catch(error => console.log('error', error))
	})
})

// ***********************************************
// ***********************************************
//search for elastic log
Cypress.Commands.add('searchElasticLog', (subject = 'QA_Log', tag = 'qa', alias = 'myalias') => {
	cy.fixture('users').then(users => {
		cy.request({
			method: 'GET',
			url: 'https://elastic.kcdev.pro:443/kc-logs-exp-api*/_search',
			headers: { Authorization: `Basic ${users.tokens.elasticSearch}`, 'Content-Type': 'application/json' },
			body: {
				sort: [{ '@timestamp': 'desc' }],
				size: 1,
				query: {
					bool: {
						must: [{ wildcard: { subject: subject } }, { term: { tags: tag } }],
					},
				},
			},
		})
			.its('body')
			.as(alias)
	})
})

// ***********************************************
// ***********************************************
Cypress.Commands.add(
	'sendTestResults',
	(level = 'info', tags = ['empty'], subject = `QA_Log_${Cypress.spec.fileName}`, testData = {}) => {
		const logs = JSON.parse(Cypress.TerminalReport.getLogs('json')).map(log => {
			return { type: log[0], message: log[1], status: log[2] }
		})
		const logData = Object.keys(testData).length === 0 ? { logs } : { logs, testData }
		const extra = {
			fileName: Cypress.spec.fileName,
			testTitle: Cypress.currentTest.title,
			testDescribe: Cypress.currentTest.titlePath[0],
		}
		cy.sendElasticLog(level, subject, logData, tags, extra)
	},
)

// ***********************************************
// Qase simple api call
// ***********************************************
Cypress.Commands.add('makeQaseCallSimple', (endpoint, project, method, data, status) => {
	cy.fixture('users').then(users => {
		cy.request({
			method: method,
			url: `https://api.qase.io/v1/${endpoint}/${project}/${data}`,
			headers: {
				Token: users.tokens.qaseAPI,
			},
		}).then(response => {
			// if (status) {
			//     expect(response.status).to.eq(status);
			// }
			return response
		})
	})
})
