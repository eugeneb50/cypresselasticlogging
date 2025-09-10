class LMSComponents {
	constructor() {
		this.AlertWindow = new AlertWindow()
		this.ConfirmWindow = new ConfirmWindow()
		this.SearchField = new SearchField()
		this.Pagination = new Pagination()
		this.Sidebar = new Sidebar()
		this.SidebarLegacy = new SidebarLegacy()
		this.DialogModal = new DialogModal()
		this.LangSelector = new LangSelector()
		this.Settings = new Settings()
		this.ReactNav = new ReactNav()
		this.PasswordResetForm = new PasswordResetForm()
		this.LMSHeader = new LMSHeader()
	}
}

class AlertWindow {
	get getAlertWindow() {
		return cy.get('div#alertWindow.is_open')
	}
	get getAlertBody() {
		return this.getAlertWindow.find('.modal-body')
	}
	get getCloseButton() {
		return this.getAlertWindow.find('span[data-action="onClose"]')
	}

	assertMessage(message) {
		this.getAlertBody.should('have.text', message)
	}
	close() {
		this.getCloseButton.should('be.visible').click()
	}

	clickIfAlertWindow() {
		cy.get('body').then(body => {
			if (body.find('div#alertWindow.is_open').length === 0) {
				cy.wait(3000)
				cy.get('body').then(body => {
					if (body.find('div#alertWindow.is_open').length > 0) {
						this.close()
					}
				})
			} else {
				this.close()
			}
		})
	}
}

class Settings {
	get getSettingDD() {
		return cy.get('.PortalSettingsMenu')
	}
	get getMenu() {
		return cy.get('.menu-list')
	}
	get getMenuList() {
		return cy.get('.DropDownButton-options')
	}
	get getSideTabs() {
		return cy.get('.Tabs-TabsNavigation')
	}

	clickSettings(num) {
		this.getSettingDD.find('.settings-icon').click()
		this.getMenuList.find('a').eq(num).click()
	}

	clickMenuByEq(num) {
		this.getMenu.find('.item').eq(num).click()
	}

	// clickMenuByEq(num ,url , method = 'POST', statusCode = 200) {
	// 	return cy.clickAndAssertCalls(this.getMenu.find('.item').click(num), url, method, statusCode)
	// }

	clickMenuListByEq(num, url, method = 'GET', statusCode = 200) {
		return cy.clickAndAssertCalls(
			this.getSideTabs.find('.Tabs-TabsNavigation-wrapper-item').eq(num).click(),
			url,
			method,
			statusCode,
		)
	}

	clickMenuListByEqNoInter(num) {
		this.getSideTabs.find('.Tabs-TabsNavigation-wrapper-item').eq(num).click()
	}
}

class ReactNav {
	get getOrangeButton() {
		return cy.get('.Button-primary-orange')
	}
	get getTextInput() {
		return cy.get('.Input:nth-child(2)')
	}
	get getDefaultTextInput() {
		return cy.get('.Input-textfield-default')
	}
	get getModalDefaultButton() {
		return cy.get('.Button-default')
	}
	get getModalSecondButton() {
		return cy.get('.Button:nth-child(2)')
	}
	get getUserActions() {
		return cy.get('.UsersHeader-actions')
	}
	get getTabsNavigation() {
		return cy.get('.Tabs-TabsNavigation')
	}
	get getLPTable() {
		return cy.get('.SelectLearningPathsTable')
	}
	get getSettingsRadioBtn() {
		return cy.get('.RadioGroup-button-unchecked')
	}
	get getRemoveModalBtn() {
		return cy.get('.Button-primary-destructive')
	}
	get getBackButton() {
		return cy.get('div.BackButtonPageTop button')
	}
	get getButtonPrimary() {
		return cy.get('.ant-btn-primary')
	}

	clickNavigationTab(num, url, type, resp) {
		return cy.clickAndAssertCalls(this.getTabsNavigation.find('.Tabs-TabsNavigation-item').eq(num), url, type, resp)
	}

	clickNavigationTabNoIntercept(num) {
		this.getTabsNavigation.find('.Tabs-TabsNavigation-item').eq(num).click()
	}

	clickOrangeButton() {
		this.getOrangeButton.find('.center-icon').click()
	}

	clickOrangeButtonIntercept(url, type, resp) {
		return cy.clickAndAssertMultCalls(this.getOrangeButton.find('.center-icon'), [[url, type, resp]])
	}

	clickModalButton() {
		this.getModalDefaultButton.find('.center-icon').eq(1).click()
	}

	clickModalButtonIntercept(url, type, resp) {
		return cy.clickAndAssertCalls(this.getModalSecondButton.find('.center-icon'), url, type, resp)
	}

	clickModalFooterButton(num) {
		this.getModalFooter.find('.center-icon').eq(num).click().wait(50)
	}

	clickSettingsDropdownRight(num) {
		this.getSettingsRight.find('.Input-button').eq(num).click().wait(50)
	}

	clickSettingsDropdownLeft() {
		this.getSettingsLeft.find('.Input-button').click().wait(50)
	}

	clickDropdownOption(num) {
		this.getSettings.find(`.Option:nth-child(${num}) .center-icon`).click().wait(50)
	}

	toggleSettingRadioBtn() {
		this.getSettingsRadioBtn.click().wait(50)
	}

	clickConfirmRemoveModalBtn(url, type, code) {
		return cy.clickAndAssertCalls(this.getRemoveModalBtn, url, type, code)
	}

	goBack() {
		this.getBackButton.click()
	}

	typeDefaultText(text) {
		this.getDefaultTextInput.click().clear().type(text)
	}

	clickPrimaryBtnByEq(eq, url, type, code) {
		return cy.clickAndAssertCalls(this.getButtonPrimary.eq(eq), url, type, code)
	}
}

class ConfirmWindow {
	get getConfirmWindow() {
		return cy.get('div#confirmWindow.is_open')
	}
	get getCancelButton() {
		return this.getConfirmWindow.find('span[data-action="onClose"]')
	}
	get getConfirmButton() {
		return this.getConfirmWindow.find('span[data-action="onConfirm"]')
	}
	get getRemoveButton() {
		return this.getConfirmWindow.find('span[data-action="onConfirm"]')
	}

	cancel() {
		this.getCancelButton.click()
	}
	confirm(url) {
		return cy.clickAndAssertCalls(this.getConfirmButton, url, 'POST', 200)
	}
}

class SearchField {
	get getSearchInput() {
		return cy.get('input[name="s"]')
	}
	get getSearchButton() {
		return cy.get('span[data-role="search"]')
	}

	typeSearch(searchValue) {
		this.getSearchInput.focus().clear().type(searchValue).should('have.value', searchValue)
	}

	clickSearchButton() {
		this.getSearchButton.click()
	}

	typeAndClickSearchApi(searchValue, url) {
		this.typeSearch(searchValue)
		return cy.clickAndAssertCalls(this.getSearchButton, url, 'GET', 200)
	}

	typeAndClickSearch(searchValue) {
		this.typeSearch(searchValue)
		this.clickSearchButton()
	}

	clearSearchField() {
		this.getSearchInput.focus().clear()
	}
}

class Pagination {
	// react
	get getPagination() {
		return cy.get('div.kc-pagination')
	}
	get getNextPage() {
		return this.getPagination.find('li.ant-pagination-next')
	}
	get getPreviousPage() {
		return this.getPagination.find('li.ant-pagination-prev')
	}
	get getNextFive() {
		return this.getPagination.find('[data-icon="double-right"]')
	}
	get getPreviousFive() {
		return this.getPagination.find('[data-icon="double-left"]')
	}
	get getTotalItems() {
		return cy.get('.kc-pagination-total')
	}
	get getPaginationSize() {
		return this.getPagination.find('div.kc-pagination__size')
	}
	get getPaginationSizeSelector() {
		return this.getPaginationSize.find('div.ant-select')
	}
	get getPaginationSizeOptions() {
		return this.getPaginationSize.find('div.rc-virtual-list-holder-inner')
	}
	get getPaginationGoToPage() {
		return this.getPagination.find('.ant-pagination-options input')
	}
	// legacy
	get getPaginationFooter1() {
		return cy.get('div[data-role="tfoot"]')
	}
	get getPaginationFooter2() {
		return cy.get('tfoot')
	}
	get getPaginationLimit() {
		return this.getPaginationFooter1.find('div[data-filter="pagination.limit"]')
	}
	get getPaginationLimit2() {
		return this.getPaginationFooter2.find('div[data-filter="pagination.limit"]')
	}
	get getPaginationLimitOptions() {
		return cy.get('span.select2-container.select2-container--default.select2-container--open')
	}
	get getExportPageLink() {
		return this.getPaginationFooter2.find('a[data-action="onGenerateReport"]')
	}
	get getExportPageModal() {
		return cy.get('div.is_open[data-role="exportListNotification"]')
	}
	get getGoToReportLink() {
		return this.getExportPageModal.find('a[data-mui="LMSCsv-export-here"]')
	}
	get getCloseButton() {
		return this.getExportPageModal.find('span[data-action="onClose"]')
	}
	get getPaginationSelector() {
		return this.getPaginationLimit2.find('select.select2-hidden-accessible')
	}
	get getDropdownSearch() {
		return cy.get('input.select2-search__field')
	}
	get getDropdownOption() {
		return cy.get('li.select2-results__option')
	}

	clickNextPage(url, method = 'GET', statusCode = 200) {
		if (url) {
			cy.clickAndAssertCalls(this.getNextPage, url, method, statusCode, { force: true })
		} else {
			this.getNextPage.click({ force: true })
		}
	}

	clickNextFive(url, method = 'GET', statusCode = 200) {
		this.getPagination.find('.ant-pagination-item-ellipsis').invoke('hide')
		if (url) {
			cy.clickAndAssertCalls(this.getNextFive, url, method, statusCode, { force: true })
		} else {
			this.getPreviousPage.click({ force: true })
		}
	}

	clickPreviousPage(url, method = 'GET', statusCode = 200) {
		if (url) {
			cy.clickAndAssertCalls(this.getPreviousPage, url, method, statusCode)
		} else {
			this.getPreviousPage.click({ force: true })
		}
	}

	clickPreviousFive(url, method = 'GET', statusCode = 200) {
		this.getPagination.find('.ant-pagination-item-ellipsis').invoke('hide')
		if (url) {
			cy.clickAndAssertCalls(this.getPreviousFive, url, method, statusCode)
		} else {
			this.getPreviousPage.click({ force: true })
		}
	}

	setLimit(limit) {
		this.getPaginationSizeSelector.scrollIntoView()
		this.getPaginationSizeSelector.click()
		return cy.clickAndAssertCalls(
			this.getPaginationSizeOptions.should('be.visible').contains(limit),
			`**_limit=*${limit}**`,
			'GET',
			200,
		)
	}

	clickPaginationLegacy() {
		this.getPaginationLimit2.should('be.visible').click()
	}

	setLimitLegacy(limit) {
		this.getPaginationLimit2.click()
		cy.clickAndAssertMultCalls(this.getDropdownOption.contains(limit), [['**/courses/owners/*limit*', 'GET', 200]])
	}

	goToPage(text) {
		this.getPaginationGoToPage.type(text).focused().tab()
	}

	setPaginationLimit(limit) {
		const paginationLimitAlias = `paginationLimit_${limit}_${Date.now()}`
		cy.intercept('GET', `**_limit=${limit}**`).as(paginationLimitAlias)
		this.getPaginationLimit.scrollIntoView()
		this.getPaginationLimit.click()
		this.getPaginationLimitOptions.should('be.visible').contains(limit).click()
		cy.wait(`@${paginationLimitAlias}`).its('response.statusCode').should('eq', 200)
	}

	clickExportPage() {
		return cy.clickAndAssertCalls(this.getExportPageLink, ['**/accounts/*/reports/'], 'POST', 200)
	}

	goToReport() {
		this.getGoToReportLink.should('be.visible').click()
	}

	closeReportWindow() {
		this.getCloseButton.should('be.visible').click()
	}
}

class Sidebar {
	get getSideBar() {
		return cy.get('aside.sidebar')
	}
	get getSidebarMenuItems() {
		return cy.get('.ant-menu-item')
	}
	get getQuickActions() {
		return this.getSideBar.find('span.plus-icon').parent('div[role="menuitem"]')
	}
	get getQuickActionsMenu() {
		return this.getQuickActions.siblings('ul[data-menu-list="true"]')
	}
	get getQuickActionsCreateUser() {
		return this.getQuickActionsMenu.find('li').eq(0).find('a')
	}
	get getQuickActionsAddGroup() {
		return this.getQuickActionsMenu.find('li').eq(2).find('a')
	}
	get getQuickActionsReports() {
		return this.getQuickActionsMenu.find('li').eq(3).find('a')
	}
	get getCourses() {
		return this.getSideBar.find('span.folder-icon').parents('li[role="menuitem"]').find('a')
	}
	get getCourseListManager() {
		return this.getSideBar.find('span.new-file-icon').parents('li[role="menuitem"]').find('a')
	}
	get getLMSAdmins() {
		return this.getSideBar.find('span.admins-icon').parents('li[role="menuitem"]').find('a')
	}
	get getCategoryManager() {
		return this.getSideBar.find('span.portal-icon').parents('div[role="menuitem"]')
	}
	get getCategoryManagerList() {
		return this.getCategoryManager.siblings('ul').find('li').eq(0)
	}
	get getCategoryManagerFeatured() {
		return this.getCategoryManager.siblings('ul').find('li').eq(1)
	}
	get getLicenseManager() {
		return this.getSideBar.find('span.license-icon').parents('li[role="menuitem"]').find('a')
	}
	get getReports() {
		return this.getSideBar.find('span.bar-chart-icon').parents('li[role="menuitem"]').find('a')
	}
	get getCurriculum() {
		return this.getSideBar.find('span.book-icon').parents('li[role="menuitem"]').find('a')
	}
	get getUserList() {
		return this.getSideBar.find('span.user-list-icon').parents('li[role="menuitem"]').find('a')
	}
	get getCourseFeedback() {
		return this.getSideBar.find('span.like-icon').parents('li[role="menuitem"]').find('a')
	}
	get getClassEvents() {
		return this.getSideBar.find('span.calendar-icon').parents('li[role="menuitem"]').find('a')
	}
	get getAccessRequests() {
		return this.getSideBar.find('span.pad-lock-icon').parents('li[role="menuitem"]').find('a')
	}
	get getActivityLog() {
		return this.getSideBar.find('span.clock-icon').parents('li[role="menuitem"]').find('a')
	}
	get getLMSAdmins() {
		return this.getSideBar.find('span.admins-icon').parents('li[role="menuitem"]').find('a')
	}
	get getImportUsers() {
		return this.getSideBar.find('span.import-icon').parents('li[role="menuitem"]').find('a')
	}
	get getUserGroups() {
		return this.getSideBar.find('span.user-group-icon').parents('li[role="menuitem"]').find('a')
	}
	get getMarketplace() {
		return this.getSideBar.find('span.marketplace-icon').parents('li[role="menuitem"]').find('a')
	}
	get getTNA() {
		return this.getSideBar.find('span.settings-icon').parents('li[role="menuitem"]').find('a')
	}
	get getQuestionBank() {
		return this.getSideBar.find('span.base-icon').parents('li[role="menuitem"]').find('a')
	}
	get getLearningPath() {
		return this.getSideBar.find('span.list-icon').parents('li[role="menuitem"]').find('a')
	}
	get getCertificateTemp() {
		return this.getSideBar.find('span.certificate-icon').parents('li[role="menuitem"]').find('a')
	}
	get getNotifications() {
		return this.getSideBar.find('span.reminder-icon').parents('li[role="menuitem"]').find('a')
	}
	get getLegacySidebar() {
		return cy.get('.sidebar')
	}

	clickQuickActions() {
		this.getQuickActions.click()
	}

	quickActionCreateUser() {
		return cy.clickAndAssertMultCallsBodiesForced(this.getQuickActionsCreateUser, [
			['**/accounts?_extend=settings*', 'GET', 200],
			['**/accounts/*/groups*', 'GET', 200],
		])
	}

	quickActionAddGroup() {
		return cy.clickAndAssertCalls(this.getQuickActionsAddGroup, ['**/accounts/*/groups*'], 'GET', 200)
	}

	assertSidebarLoading() {
		cy.get('.simplebar-content', { timeout: 16000 }).should('be.visible')
		cy.wait(50)
		cy.get('.Loader-orange').should('not.exist')
	}

	clickCourses() {
		return cy.clickAndAssertCallsWait(this.getCourses, '**/courses/owners/*?**', 'GET', 200, 16000)
	}

	clickCourseListManager() {
		return cy.clickAndAssertCalls(this.getCourseListManager, '**/accounts/*/course_lists*', 'GET', 200)
	}

	clickCurriculum() {
		return cy.clickAndAssertMultCallsForced(this.getCurriculum, [['**/accounts/*/curriculum**', 'GET', 200]])
	}

	clickCategoryManager() {
		this.getCategoryManager.click()
	}

	clickCategoryManagerList() {
		return cy.clickAndAssertMultCalls(this.getCategoryManagerList, [['**/portals/*/categories/*', 'GET', 200]])
	}

	clickCategoryManagerFeatured() {
		this.getCategoryManagerFeatured.click()
	}

	clickLicenseManager() {
		return cy.clickAndAssertCalls(this.getLicenseManager, '**/accounts/*/subscriptions?**', 'GET', 200)
	}

	clickReports() {
		return cy.clickAndAssertCallsWait(this.getReports, '**/reports?_start=0&_limit=20**', 'GET', 200, 16000)
	}

	clickReportsStorage() {
		// Step 1: Save the entire `localStorage` state
		const initialLocalStorage = {}
		cy.window().then(win => {
			Object.keys(win.localStorage).forEach(key => {
				initialLocalStorage[key] = win.localStorage.getItem(key)
			})
		})

		// Step 2: Run the click and intercept command with the existing setup
		return cy
			.clickAndAssertCallsWait(this.getReports, '**/reports?_start=0&_limit=20**', 'GET', 200, 16000)
			.then(bodies => {
				// Step 3: Restore the `localStorage` state after the navigation completes
				cy.window().then(win => {
					Object.keys(initialLocalStorage).forEach(key => {
						win.localStorage.setItem(key, initialLocalStorage[key])
					})
				})

				// Step 4: Return the response bodies as before
				return bodies
			})
	}

	clickUserList() {
		return cy.clickAndAssertMultCalls(this.getUserList, [['**/accounts/*/students**', 'GET', 200]])
	}

	clickCourseFeedback() {
		return cy.clickAndAssertCalls(this.getCourseFeedback, '**/portals/*/courseFeedback/**', 'GET', 200)
	}

	clickClassEvents() {
		return cy.clickAndAssertCalls(
			this.getClassEvents,
			'**/accounts/*/courses/events?search=&_limit=*&lang=*&_order=*',
			'GET',
			200,
		)
	}

	clickActivityLog() {
		return cy.clickAndAssertCalls(this.getActivityLog, '**/activity_log?account_id=**', 'GET', 200)
	}

	clickAccessRequests() {
		this.getAccessRequests.scrollIntoView()
		return cy.clickAndAssertCalls(this.getAccessRequests, '**/accounts/*/access_requests?**', 'GET', 200)
	}

	clickImportUsers() {
		return cy.clickAndAssertCalls(this.getImportUsers, '**/accounts/*/users/import?**', 'GET', 200)
	}

	clickUsersGroups() {
		return cy.clickAndAssertMultCalls(this.getUserGroups, [['**/accounts/*/group**', 'GET', 200]])
	}

	clickUsersGroupsReact() {
		return cy.clickAndAssertCalls(this.getUserGroups, '**/accounts/*/group**', 'GET', 200)
	}

	clickMarketplace() {
		return cy.clickAndAssertCalls(
			this.getMarketplace,
			['**/accounts/*/marketplace/courses?**', '**/accounts/*/marketplace/cart/state'],
			'GET',
			200,
		)
	}

	clickTNA() {
		return cy.clickAndAssertCalls(this.getTNA, '**/accounts/*/tna?**', 'GET', 200)
	}

	clickQuestionBank() {
		return cy.clickAndAssertCalls(
			this.getQuestionBank,
			'**/accounts/*/repository/questions/categories?**',
			'GET',
			200,
		)
	}

	clickLearningPath() {
		return cy.clickAndAssertCalls(this.getLearningPath, '**/accounts/*/learning_paths?**', 'GET', 200)
	}

	clickCertificateTemplates() {
		return cy.clickAndAssertCalls(this.getCertificateTemp, '**/accounts/*/certificates/templates', 'GET', 200)
	}

	clickNotifications() {
		return cy.clickAndAssertMultCalls(this.getNotifications, [['**/accounts/*/reminder?**', 'GET', 200]])
	}

	clickLMSAdmins() {
		return cy.clickAndAssertMultCallsForced(this.getLMSAdmins, [['**/accounts/*/admins*', 'GET', 200]])
	}

	clickLegacySidebarEq(num, url, type, code) {
		return cy.clickAndAssertCalls(this.getLegacySidebar.find('li').eq(num), url, type, code)
	}
}

class SidebarLegacy {
	get getSideBar() {
		return cy.get('div[data-role="Sidebar"]')
	}
	get getQuickActions() {
		return this.getSideBar.find('span[data-role="quick_actions"]')
	}
	get getQuickActionsToggle() {
		return this.getQuickActions.find('span[data-role="open-btn"]')
	}
	get getQuickActionsMenu() {
		return this.getQuickActions.find('div[data-role="link_collection"]')
	}
	get getQuickActionsCreateUser() {
		return this.getQuickActionsMenu.find('a[data-path="students"]')
	}
	get getQuickActionsReports() {
		return this.getQuickActionsMenu.find('b[data-mui-default="Reports"]').parent()
	}
	get getCourses() {
		return this.getSideBar.find('.icon-new-courses')
	}
	get getCourseListManager() {
		return this.getSideBar.find('b[data-mui-default="Course List Manager"]').parent()
	}
	get getReports() {
		return this.getSideBar.find('b[data-mui-default="Reports"]').parent()
	}
	get getCategoryManager() {
		return this.getSideBar.find('a[data-groups="portal_manager"]')
	}
	get getCurriculum() {
		return cy.get('.icon-new-curriculum')
	}
	get getLMSAdmins() {
		return this.getSideBar.find('b[data-mui-default="LMS Admins"]').parent()
	}
	get getSidebarScroll() {
		return this.getSideBar.find('ul[data-role="menu"]')
	}
	get getUserList() {
		return this.getSideBar.find('b[data-mui-default="User List"]').parent()
	}
	get getImportUser() {
		return this.getSideBar.find('b[data-mui-default="Import Users"]').parent()
	}
	get getAccessRequests() {
		return this.getSideBar.find('b[data-mui="L2Default-users-approval"]').parent()
	}
	get getLearningProcess() {
		return this.getSideBar.find('b[data-mui="L2Default-learning_process"]').parent()
	}
	get getUserGroups() {
		return this.getSideBar.find('.icon-new-group')
	}
	get getLicenseManager() {
		return this.getSideBar.find('b[data-mui-default="License Manager"]')
	}

	clickQuickActions() {
		this.getQuickActionsToggle.should('be.visible').click()
	}

	quickActionCreateUser() {
		return cy.clickAndAssertCalls(
			this.getQuickActionsCreateUser,
			['**/groups?_start=0&_extend=show_tree*', '**/accounts?_extend=settings%2Cauto_complete*'],
			'GET',
			200,
		)
	}

	quickActionReports() {
		return cy.clickAndAssertCalls(this.getQuickActionsReports, '**/reports?*', 'GET', 200)
	}

	clickCourses() {
		this.getCourses.click({ force: true })
	}

	clickCourseListManager() {
		return cy.clickAndAssertCalls(this.getCourseListManager, '**/accounts/*/course_lists?*', 'GET', 200)
	}

	clickReports() {
		return cy.clickAndAssertCalls(this.getReports, '**/reports?*', 'GET', 200)
	}

	scrollSidebar() {
		this.getSidebarScroll.scrollTo('bottom')
	}

	clickCategoryManager() {
		return cy.clickAndAssertMultCallsForced(this.getCategoryManager, [['**/portals/*/categories/*', 'GET', 200]])
	}

	clickCurriculum() {
		return cy.clickAndAssertMultCallsForced(this.getCurriculum, [['**/accounts/*/curriculum**', 'GET', 200]])
	}

	clickLMSAdmins() {
		return cy.clickAndAssertCalls(this.getLMSAdmins, '**/users/admins?_start=0&_limit=20', 'GET', 200)
	}

	clickUserList() {
		return cy.clickAndAssertCalls(this.getUserList, '**/accounts/*/students**', 'GET', 200)
	}

	clickImportUsers() {
		return cy.clickAndAssertCalls(this.getImportUser, '**/accounts/*/courses/lists?**', 'GET', 200)
	}

	clickAccessRequests() {
		return cy.clickAndAssertCalls(this.getAccessRequests, '**/accounts/*/forms/0request_access**', 'GET', 200)
	}

	clickUsersGroups() {
		return cy.clickAndAssertCalls(this.getUserGroups, '**/accounts/*/groups?**', 'GET', 200)
	}

	clickLearningProcess() {
		return cy.clickAndAssertCalls(this.getLearningProcess, '**/accounts/*/learning_paths**', 'GET', 200)
	}

	clickLicenseManager() {
		return cy.clickAndAssertCalls(this.getLicenseManager, '**/accounts/*/subscriptions?**', 'GET', 200)
	}
}

class DialogModal {
	get getDialogModal() {
		return cy.get('div[role="dialog"]')
	}
	get getModalBody() {
		return this.getDialogModal.find('div.ant-modal-body')
	}
	get getOpenReportLink() {
		return this.getModalBody.find('p a')
	}
	get getRemoveButton() {
		return this.getModalBody.find('button[type="submit"]')
	}

	goToReport() {
		this.getOpenReportLink.should('be.visible', { log: false }).click()
	}

	clickRemoveBtn() {
		this.getRemoveButton.should('be.visible').click()
	}
}

class LMSHeader {
	get getHeaderActions() {
		return cy.get('.Header-actions')
	}

	get getAccountSettingsMenu() {
		return this.getHeaderActions.find('.AccountSettingsMenu')
	}
	get getLogoutButton() {
		return this.getAccountSettingsMenu.find('.DropDownButton-options button.DropDownButton-option')
	}

	clickLogoutLMS() {
		this.getAccountSettingsMenu.click()
		return cy.clickAndAssertMultCalls(this.getLogoutButton, [['**v2/auth', 'POST', 200]])
	}
}

class LangSelector {
	get getLangSelectorLegacy() {
		return cy.get('[id="langMenu"]')
	}
	get getLangLegacy() {
		return this.getLangSelectorLegacy.find('li')
	}
	get getLangSelector() {
		return cy.get('div.portal_langs')
	}
	get getLang() {
		return this.getLangSelector.find('li')
	}
	get currentlang() {
		return cy.get('.portal_langs .dropdown_btn__label').invoke('text')
	}

	selectLang(lang) {
		this.getLangSelector.click()
		this.getLang.eq(lang).click({ force: true })
	}

	selectLangLegacy(lang) {
		this.getLangSelectorLegacy.click()
		this.getLangLegacy.eq(lang).click({ force: true })
		cy.wait(3000)
	}
}

class PasswordResetForm {
	get getResetPswrdForm() {
		return cy.get('div.ResetPassword')
	}
	get getNewPswrdInput() {
		return this.getResetPswrdForm.find('input#new_password')
	}
	get getConfirmPswrdInput() {
		return this.getResetPswrdForm.find('input#new_password_confirm')
	}
	get getSaveChngsBtn() {
		return this.getResetPswrdForm.find('button[aria-label="Save changes"]')
	}

	resetPassword(newPassword) {
		this.getResetPswrdForm.should('be.visible')
		this.getNewPswrdInput.focus().clear().type(newPassword).should('have.value', newPassword)
		this.getConfirmPswrdInput.focus().clear().type(newPassword).should('have.value', newPassword)
		cy.clickAndAssertMultCalls(this.getSaveChngsBtn, [['**/users/*/password', 'POST', 200]])
	}
}

export default LMSComponents
