// ***********************************************
//	environment = test environment = experimental, stage, production
//	portal = portal code
// ***********************************************
Cypress.Commands.add('setBaseURL', (environment = Cypress.env('environment'), portal = Cypress.env('portal')) => {
	cy.fixture('testEnvs').then(testEnvs => {
		const baseURL = `https://${portal}.${testEnvs[environment]}/`
		// let baseURL = `https://${portal}.${testEnvs[environment]}/${Cypress.env('lang')}/`
		return { environment, portal, baseURL }
	})
})

// ***********************************************
//	urlData = passed when chained after .setBaseURL()
// ***********************************************
Cypress.Commands.add('visitBaseUrl', { prevSubject: 'optional' }, (urlData, path = '') => {
	let url
	if (urlData) {
		url = urlData.baseURL
	} else {
		url = Cypress.env('baseURL')
	}
	cy.visit(url + path)
})

// ***********************************************
//	urlData = passed when chained after .setBaseURL()
//	type = user type = admin, student
//	index = index number for user credentials
// ***********************************************
Cypress.Commands.add('setUser', { prevSubject: 'optional' }, (urlData, type, index = 0) => {
	// Allows only type "admin" or "student". By default is "admin"
	type =
		type === 'admintools' ? 'admintools' : type === 'admin' ? 'admin' : type === 'student' ? 'student' : undefined
	cy.fixture('users').then(users => {
		const userData =
			type === 'admintools'
				? users.credentials['admintools'][index]
				: urlData
					? users.credentials[urlData.portal][type][index]
					: users.credentials[Cypress.env('portal')][type][index]
		if (urlData) {
			return { urlData, userData }
		} else {
			urlData = {
				environment: Cypress.env('environment'),
				portal: Cypress.env('portal'),
				baseURL: Cypress.env('baseURL'),
			}
			return { urlData, userData }
		}
	})
})

// ***********************************************
//	urlData = passed when chained after .setBaseURL()
//	type = user type = admin, student
//	index = index number for user credentials
// ***********************************************
Cypress.Commands.add('setUserExplicit', { prevSubject: 'optional' }, (urlData, username, password) => {
	const userData = { user: username, pwd: password }
	if (urlData) {
		return { urlData, userData }
	} else {
		urlData = {
			environment: Cypress.env('environment'),
			portal: Cypress.env('portal'),
			baseURL: Cypress.env('baseURL'),
		}
		return { urlData, userData }
	}
})

// ***********************************************
//	loginData = passed when chained after .setUser()
//	path = Specific Page path
// ***********************************************
Cypress.Commands.add(
	'loginLMS',
	{ prevSubject: 'optional' },
	(loginData, path = 'admin2/auth', lang = Cypress.env('lang')) => {
		let url, username, password
		if (loginData) {
			url = loginData.urlData.baseURL
			username = loginData.userData.user
			password = loginData.userData.pwd
		} else {
			url = Cypress.env('baseURL')
			username = Cypress.env('userData')['user']
			password = Cypress.env('userData')['pwd']
		}
		cy.visit(url + path)
		cy.get('.auth__title').should('be.visible')
		cy.intercept('**/v2/auth').as('loginAdmin')
		// cy.intercept('**v2/accounts/*/statistics/graphics/login').as('loginStats')
		cy.get('#username').should('be.visible').type(username).should('have.value', username)
		cy.get('input[autocomplete="new-password"]')
			.type(password, { log: false })
			.should('have.value', password, { log: false })
		cy.get('button[type="submit"]').click()
		cy.wait('@loginAdmin').then(interception => {
			// cy.wait('@loginStats')
			cy.wrap(interception.response.body).then(body => {
				cy.log(body)
				const token = body.response.token
				cy.log(token)
				Cypress.env('authToken', token)
				cy.log(Cypress.env('authToken'))
				cy.wrap(body.code)
					.should('eq', 200)
					.then(() => {
						cy.setLocalStorage('userOptionsStorage', `{"lang":"${lang}"}`).then(() => {
							cy.saveLocalStorage().then(() => {
								return body.response
							})
						})
					})
			})
		})
	},
)

// ***********************************************
//	loginData = passed when chained after .setUser()
//	path = Specific Page path
// ***********************************************
Cypress.Commands.add('loginPortal', { prevSubject: 'optional' }, (loginData, path = '', lang = Cypress.env('lang')) => {
	let url, username, password
	if (loginData) {
		url = loginData.urlData.baseURL
		username = loginData.userData.user
		password = loginData.userData.pwd
	} else {
		url = Cypress.env('baseURL')
		username = Cypress.env('userData')['user']
		password = Cypress.env('userData')['pwd']
	}

	cy.intercept('**/portals/0*/?_extend=config,catceid').as('portalConfig')
	cy.visit(url + lang + path)
	cy.wait('@portalConfig').then(portalConfig => {
		cy.clearCookies()
		if (portalConfig.response.body.response.login.ssoPopUp === true) {
			cy.wait(1000)
			if (portalConfig.response.body.response.login.default === 'ActiveDirectory') {
				cy.get('div#mContainer div#loginPopUp').should('be.visible')
				cy.get(
					'div#mContainer div#loginPopUp form#activedirloginform div.loginoptions a[data-handler="onSwitchType"]',
				)
					.should('be.visible')
					.click()
			}
		} else {
			cy.get('#loginlink').should('be.visible').click({ force: true })
		}
		cy.intercept('**/auth').as('userLogin')
		cy.get('div#loginPopUp').should('be.visible')
		cy.get('#loginform-username')
			.should('be.visible')
			.focus()
			.type(username, { delay: 50 })
			.should('have.value', username)
		cy.get('#loginform-password')
			.should('be.visible')
			.focus()
			.type(password, { delay: 50 })
			.should('have.value', password)
		cy.get('#mContainer #loginform input[name="submit"]').click()
		cy.wait('@userLogin').then(interception => {
			cy.wrap(interception.response.body).then(body => {
				cy.wrap(body.code)
					.should('eq', 200)
					.then(() => {
						cy.saveLocalStorage().then(() => {
							return body.response
						})
					})
			})
		})
	})
})

// ***********************************************
//	loginData = passed when chained after .setUser()
//	path = Specific Page path
// ***********************************************
Cypress.Commands.add(
	'loginAPI',
	{ prevSubject: 'optional' },
	(loginData, path = '', lang = Cypress.env('lang'), env = Cypress.env('environment')) => {
		cy.fixture('testEnvs').then(testEnvs => {
			let url, username, password
			if (loginData) {
				url = loginData.urlData.baseURL
				username = loginData.userData.user
				password = loginData.userData.pwd
			} else {
				url = Cypress.env('baseURL')
				username = Cypress.env('userData')['user']
				password = Cypress.env('userData')['pwd']
			}

			const requestOptions = [
				`https://api.${testEnvs[env]}/v2/auth/`,
				'POST',
				null,
				true,
				{
					username: username,
					password: password,
					usertype: 'accountAdmin',
				},
				200,
			]

			cy.makeAPICall(...requestOptions).then(interception => {
				cy.wrap(interception.body).then(body => {
					const token = body.response.token
					Cypress.env('authToken', token)
					cy.wrap(body.code)
						.should('eq', 200)
						.then(() => {
							cy.setLocalStorage('userOptionsStorage', `{"lang":"${lang}"}`).then(() => {
								cy.saveLocalStorage().then(() => {
									return body.response
								})
							})
						})
				})
			})
		})
	},
)

// ***********************************************
//	loginData = passed when chained after .setUser()
//	path = Specific Page path
// ***********************************************
Cypress.Commands.add(
	'loginAPILMS',
	{ prevSubject: 'optional' },
	(
		loginData,
		path = '',
		portal = loginData.urlData.portal || Cypress.env('portal'),
		lang = Cypress.env('lang'),
		env = Cypress.env('environment'),
	) => {
		return cy.fixture('testEnvs').then(testEnvs => {
			return cy.fixture(`portals/${portal}/${Cypress.env('environment')}`).then(portalData => {
				let url, username, password
				const portal_id = portalData.portal_id

				// Fetch login credentials
				if (loginData) {
					url = loginData.urlData.baseURL
					username = loginData.userData.user
					password = loginData.userData.pwd
				} else {
					url = Cypress.env('baseURL')
					username = Cypress.env('userData')['user']
					password = Cypress.env('userData')['pwd']
				}

				// Visit the target URL and verify the context
				return cy.visit(url).then(() => {
					cy.url().should('include', url) // Ensure the URL is fully loaded

					// Create FormData for the API call
					const formData = new FormData()
					formData.append('usertype', 'accountAdmin')
					formData.append('portal_id', portal_id)
					formData.append('_extend', 'user,student_info,admin_options,account_setting')
					formData.append('username', username)
					formData.append('password', password)

					// Perform the API call and handle response
					return cy
						.makeFormAPICall(`https://api.${testEnvs[env]}/v2/auth/`, 'POST', {}, formData, 200)
						.then(response => {
							if (response && response.body && response.body.response) {
								const token = response.body.response.token
								Cypress.env('authToken', token)

								// Combine user data
								const userData = {
									...response.body.response,
									...response.body.response.user,
								}

								delete userData.user
								// delete userData._user_type

								// Store combined user data in localStorage
								cy.window()
									.then(win => {
										win.localStorage.setItem('userOptionsStorage', `{"lang":"${lang}"}`)
										win.localStorage.setItem('user_data', JSON.stringify(userData))
									})
									.then(() => {
										cy.saveLocalStorage()
									})

								// Optionally, navigate to the final path if provided
								if (path) {
									cy.visit(`${url}${path}`)
									cy.log(`Navigated to final URL: ${url}${path}`)
								}

								// Return the response using cy.wrap to make it accessible outside
								return cy.wrap(response)
							} else {
								cy.log('API response was undefined or missing expected data')
								throw new Error('Failed to receive valid response from /v2/auth/ API')
							}
						})
				})
			})
		})
	},
)

// ***********************************************
//	loginData = passed when chained after .setUser()
//	path = Specific Page path
// ***********************************************
Cypress.Commands.add(
	'loginPortal2',
	{ prevSubject: 'optional' },
	(loginData, path = '/signin', lang = Cypress.env('lang')) => {
		let url, username, password
		if (loginData) {
			url = loginData.urlData.baseURL
			username = loginData.userData.user
			password = loginData.userData.pwd
		} else {
			url = Cypress.env('baseURL')
			username = Cypress.env('userData')['user']
			password = Cypress.env('userData')['pwd']
		}

		cy.visit(url + lang + path)
		cy.clearCookies()
		cy.intercept('**/auth').as('userLogin')
		// cy.get('.user-menu-wrap ').should('be.visible').click()
		cy.get('.page-signin').should('be.visible')
		//cy.get('.auth-option .kc-btn-block').should('be.visible').click({ force: true })
		cy.get('[type="text"]').eq(0).should('be.visible').type(username).should('have.value', username)
		cy.get('[type="password"]').should('be.visible').type(password).should('have.value', password)
		cy.get('div.signin-form').find('form').find('div').eq(2).find('ki-button-2').shadow().find('button').click()
		cy.wait('@userLogin').then(interception => {
			cy.wrap(interception.response.body).then(body => {
				cy.wrap(body.code)
					.should('eq', 200)
					.then(() => {
						cy.saveLocalStorage().then(() => {
							return body.response
						})
					})
			})
		})
	},
)

// ***********************************************
//	loginData = passed when chained after .setUser()
//	path = Specific Page path
// ***********************************************
Cypress.Commands.add('loadPortal', { prevSubject: 'optional' }, urlData => {
	const url = urlData ? urlData.baseURL : Cypress.env('baseURL')
	cy.visit(url)
})

// ***********************************************
//	loginData = passed when chained after .setUser()
//	path = Specific Page path
// ***********************************************
Cypress.Commands.add(
	'loginJumpCloud',
	{ prevSubject: 'optional' },
	(loginData, path = '/login', lang = Cypress.env('lang')) => {
		let url, username, password
		if (loginData) {
			url = Cypress.env('jumpURL')
			username = loginData.userData.user
			password = loginData.userData.pwd
		} else {
			url = Cypress.env('jumpURL')
			username = Cypress.env('userData')['user']
			password = Cypress.env('userData')['pwd']
		}
		cy.visit(url + path)
		cy.get('[name="email"]').should('be.visible').type(username)
		cy.get('[type="submit"]').click()
		cy.wait(200)
		cy.get('[name="password"]').type(password, { log: false })
		cy.get('[type="submit"]').click()
		cy.get('.layout__cardColumnFull').should('be.visible', { timeout: 12000 })
	},
)

// ***********************************************
//	loginData = passed when chained after .setUser()
//	path = Specific Page path
// ***********************************************
Cypress.Commands.add(
	'loginAdmintoolsAPI',
	{ prevSubject: 'optional' },
	(loginData, env = Cypress.env('environment')) => {
		cy.wrap(null).then(() => {
			return cy.deleteAllEmails()
		})

		cy.fixture('testEnvs').then(testEnvs => {
			const username = loginData.userData.user
			const password = loginData.userData.pwd

			const requestOptions1 = [
				`https://api.${testEnvs[env]}/v2/auth/`,
				'POST',
				null,
				true,
				{ username: username, password: password, usertype: 'root' },
				200,
			]

			cy.makeAPICall(...requestOptions1).then(interception1 => {
				const requestOptions2 = [
					`https://api.${testEnvs[env]}/v2/auth/mfa/methods?mfa_session_token=${interception1.body.response.mfa_session_token}`,
					'GET',
					null,
					true,
					{},
					200,
				]

				cy.makeAPICall(...requestOptions2).then(interception2 => {
					const requestOptions3 = [
						`https://api.${testEnvs[env]}/v2/auth/mfa/attempt`,
						'POST',
						null,
						true,
						{
							method_id: interception2.body.response.methods[0].method_id,
							mfa_session_token: interception1.body.response.mfa_session_token,
						},
						200,
					]

					cy.makeAPICall(...requestOptions3).then(interception3 => {
						cy.getLastEmailBySubject('Confirmation code').then(emailBuffer => {
							cy.task('parseEmail', emailBuffer).then(email => {
								cy.document().then(doc => {
									doc.write(email.html)
									doc.close()
								})

								cy.get('table.kc-email-content td.kc-email-body__main td.h2').then($code => {
									const requestOptions4 = [
										`https://api.${testEnvs[env]}/v2/auth/mfa/confirmation`,
										'POST',
										null,
										true,
										{
											security_code: $code.get(0).innerText,
											attempt_id: interception3.body.response.attempt_id,
											mfa_session_token: interception1.body.response.mfa_session_token,
										},
										200,
									]

									cy.makeAPICall(...requestOptions4).then(interception4 => {
										cy.setCookie('userGroups', 'superAdmin', {
											domain: `admintools.${testEnvs[env]}`,
										})
										cy.setCookie('userToken', interception4.body.response.token, {
											domain: `admintools.${testEnvs[env]}`,
										})
										cy.setCookie('token', interception4.body.response.token, {
											domain: `admintools-v2.${testEnvs[env]}`,
										})
										cy.setCookie('userType', 'root', { domain: `admintools.${testEnvs[env]}` })

										Cypress.env('authTokenAdmintools', interception4.body.response.token)
									})
								})
							})
						})
					})
				})
			})
		})
	},
)

// ***********************************************
// ***********************************************
Cypress.Commands.add('getLocalStorage', key => {
	return cy.window().then(win => win.localStorage.getItem(key))
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('setLocalStorage', (key, value) => {
	return cy.window().then(win => win.localStorage.setItem(key, value))
})

// ***********************************************
// ***********************************************
Cypress.Commands.add('clearLocalStorageAcrossDomains', domains => {
	domains.forEach(domain => {
		cy.visit(domain) // Visit the domain to initialize the context
		cy.clearLocalStorage() // Clear localStorage for the current domain
	})
})
