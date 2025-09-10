class Reports {
	constructor() {
		this.Tabs = new Tabs()
		this.ReportsList = new ReportsList()
		this.GenerateReports = new GenerateReports()
		this.ReportResults = new ReportResults()
		this.EditReportTemplate = new EditReportTemplate()
	}
}

class EditReportTemplate {
	get getTab() {
		return cy.get('[data-role="mockupTabs"]')
	}

	clickTabName(tabname) {
		this.getTab.contains(tabname).click()
	}
}

class Tabs {
	get getTabsHeader() {
		return cy.get('div#optionsTabs')
	}
	get getReportsTab() {
		return this.getTabsHeader.find('a[data-tab="list"]')
	}
	get getGenerateReportTab() {
		return this.getTabsHeader.find('a[data-tab="generate"]')
	}
	get getNewTemplateTab() {
		return this.getTabsHeader.find('a[data-tab="new_mockup"]')
	}
	get getGoBackButton() {
		return this.getTabsHeader.find('a#goBack')
	}

	clickReportsTab() {
		this.getReportsTab.click()
	}

	clickGenerateReportsTab() {
		return cy.clickAndAssertCallsWait(
			this.getGenerateReportTab,
			'**/mockups?_start=0&_limit=20**',
			'GET',
			200,
			16000,
		)
	}

	clickNewTemplateTab() {
		this.getNewTemplateTab.click()
	}

	clickGoBack() {
		return cy.clickAndAssertCalls(this.getGoBackButton, '**/reports?_start=*&_limit=*&lang=**', 'GET', 200)
	}
}

class ReportsList {
	get getReportsTable() {
		return cy.get('table.table_com.reports', { timeout: 16000 })
	}

	openReportByID(reportID) {
		return cy.clickAndAssertCalls(
			this.getReportsTable.find(`tr[data-id="${reportID}"] a[data-link="true"]`, { timeout: 60000 }),
			'**/reports/*/data?_start=*&_limit=*&lang=*',
			'GET',
			200,
		)
	}

	openReportListPos(num) {
		this.getReportsTable.find('tr a[data-link="true"]').eq(num).click()
	}
}

class ReportResults {
	get getReportData() {
		return cy.get('div#reports div[data-ctrl="@presenters/ReportData"]')
	}
	get getReportDataTable() {
		return this.getReportData.find('div.report-data')
	}
	get getReportDataTableBody() {
		return this.getReportDataTable.find('tbody')
	}
	get getReportTable() {
		return cy.get('#reports')
	}
	get getTab() {
		return cy.get('.tabs-header')
	}

	selectTab(tabName) {
		this.getTab.contains(tabName).click()
	}

	clickActionsByName(name) {
		this.getReportTable.find('.compact').contains(name).eq(0).parents('tr').find('.icon-action-dot').click()
		// cy.get('#reports').find('li > a').filter(':visible').eq(1).click({force:true})
	}

	assertDataRowByIndex(rowData, index = 0) {
		this.getReportDataTableBody.children().eq(index).as('dataRow')
		if (rowData) {
			Object.entries(rowData).forEach(entry => {
				if (
					entry[0].indexOf('_') === 0 ||
					entry[1] === '' ||
					typeof entry[1] === 'boolean' ||
					typeof entry[1] === 'object'
				) {
					// Removes from response data key-value pairs beggining with _ (not shown on report) as well as empty values or values types not shown in report
					delete rowData[entry[0]]
				} else if (typeof entry[1] === 'number') {
					// Converts numbers to string
					rowData[entry[0]] = entry[1].toString()
				} else if (entry[1].includes('\u00a0')) {
					// Trims strings up to their first non-breaking space character if it includes one
					rowData[entry[0]] = entry[1].slice(0, entry[1].indexOf('\u00a0'))
				}
			})

			cy.wrap(Object.values(rowData)).each(rowValue => {
				cy.get('@dataRow').contains('td', rowValue.trim()).should('have.length', 1)
			})
		} else {
			cy.log('Report Data is Empty.')
		}
	}

	// !!!!!!THIS NEEDS TO BE UPDATED, PLEASE USE assertDataRowByIndex() ABOVE!!!!!!!
	assertAllDataRows(rowsData) {
		this.getReportDataTableBody.children().as('dataRows')
		cy.get('@dataRows').each((row, rowIndex) => {
			cy.wrap(Object.values(rowsData[rowIndex])).each(val => {
				// eslint-disable-next-line eqeqeq
				if (val != '' && typeof val !== 'boolean') {
					const trimmedValue =
						typeof val === 'string' ? val.substring(0, 15) : val.toString().substring(0, 15)
					cy.wrap(row).children().contains(trimmedValue).should('have.length', 1)
				}
			})
		})
	}

	compareTableDataWithWarning(tableData) {
		const errorData = []
		return this.getReportDataTableBody
			.children({ log: false })
			.each((row, rowIndex) => {
				cy.wrap(row, { log: false })
					.children({ log: false })
					.each((column, columnIndex) => {
						cy.wrap(column, { log: false }).then($col => {
							const expectedValue = tableData[rowIndex][columnIndex]
							const actualValue = $col.text().trim()
							if (actualValue === expectedValue) {
								expect(actualValue).to.eq(expectedValue)
							} else {
								errorData.push({
									expected: expectedValue,
									actual: actualValue,
								})
							}
						})
					})
			})
			.then(() => {
				if (errorData.length > 0) {
					Cypress.log({
						name: 'warning',
						message: 'Warning: Text content does NOT match.',
						consoleProps: () => {
							return {
								'Error data': errorData,
							}
						},
					})
					return errorData
				} else {
					return null
				}
			})
	}
}

class GenerateReports {
	get getMockupsTable() {
		return cy.get('div[data-model="models/ReportMockups"] div[data-role="tbody"]')
	}
	get getMockupItems() {
		return this.getMockupsTable.find('div.item')
	}
	get getRunReportButtons() {
		return this.getMockupItems.get('span[data-action="onReport"]')
	}
	get getRunReportMenu() {
		return this.getMockupItems.get('div.menu')
	}
	get getNewReportModal() {
		return cy.get('div.is_open[data-role="NewReportModal"]')
	}
	get getNewReportOptionsContainer() {
		return this.getNewReportModal.find('div[data-role="reportOptions"]')
	}
	get getCoursesFormatSelect() {
		return this.getNewReportModal.find('div[data-role="courseFormat"] select')
	}
	get getCoursesLanguageSelect() {
		return this.getNewReportModal.find('div[data-role="courseLang"] select')
	}
	get getAllCoursesBlock() {
		return this.getNewReportModal.find('div[data-role="isAllCourses"]')
	}
	get getAllCoursesBlockInputs() {
		return this.getAllCoursesBlock.find('input[type="radio"]')
	}
	get getCreateReportButton() {
		return this.getNewReportModal.find('span[data-action="onReportCreate"]')
	}
	get getGroupSelect() {
		return this.getNewReportModal.find('div[data-role="groups"] select')
	}
	get getTimeZoneSelect() {
		return this.getNewReportModal.find('div[data-role="account_time_zone"] select')
	}
	get getStartDateField() {
		return this.getNewReportModal.find('div[data-form="dateFrom"] input')
	}
	get getEndDateField() {
		return this.getNewReportModal.find('div[data-form="dateTo"] input')
	}
	get getByMonthCheckbox() {
		return this.getNewReportModal.find('input#byMonth')
	}
	get getByCourseCheckbox() {
		return this.getNewReportModal.find('input#byCourse')
	}
	get getDisabledUsersCheckbox() {
		return this.getNewReportModal.find('input[name="exclude_disabled_users"]')
	}
	get getNotStartedCheckbox() {
		return this.getNewReportOptionsContainer.find('input[name="is_not_started"]')
	}
	get getCourseListSelect() {
		return this.getNewReportModal.find('div[data-role="courseListsEnum"] select')
	}
	get getAddCourseListButton() {
		return this.getNewReportModal.find('span[data-action="onAddCourseList"]')
	}
	get getCourseListTable() {
		return this.getNewReportModal.find('table[data-role="courseListsTable"] tbody')
	}
	get getCourseSelect() {
		return this.getNewReportModal.find('div[data-role="coursesEnum"] select')
	}
	get getAddCourseButton() {
		return this.getNewReportModal.find('span[data-action="onAddCourse"]')
	}
	get getCourseTable() {
		return this.getNewReportModal.find('table[data-role="courseOfList"] tbody')
	}
	get getQuizCourseSelect() {
		return this.getNewReportModal.find('div[data-form="quiz_course_id"] select')
	}
	get getQuizLanguageSelect() {
		return this.getNewReportModal.find('div[data-form="quiz_lang"] select')
	}
	get getQuizSelect() {
		return this.getNewReportModal.find('div[data-form="lesson_data_id"] select')
	}
	get getQuestionBankSelect() {
		return this.getNewReportModal.find('div[data-form="question_category_id"] select')
	}
	get getInstructorClassCourseSelect() {
		return this.getNewReportModal.find('div[data-form="instructor_course_report_course"] select')
	}
	get getInstructorSelect() {
		return this.getNewReportModal.find('div[data-form="instructor_course_report_instructor"] select')
	}
	get getSubscriptionSelect() {
		return this.getNewReportModal.find('div[data-form="subscription_id"] select')
	}
	get getLicenseStartDateField() {
		return this.getNewReportModal.find('div[data-form="license_date_from"] input')
	}
	get getLicenseEndDateField() {
		return this.getNewReportModal.find('div[data-form="license_date_to"] input')
	}
	get getReportCreatedModal() {
		return cy.get('div.is_open[data-role="ReportCreatedModal"]')
	}
	get getGoToReportLink() {
		return this.getReportCreatedModal.find('span[data-action="onGotoReport"]')
	}
	get getEditReportbyName() {
		return cy.get('.name[data-link="true"]')
	}

	assertFinishedLoading() {
		this.getMockupsTable.should('not.have.class', 'is_loading')
	}

	assertReportMockupLoaded() {
		this.getRunReportMenu.should('be.visible')
	}

	clickEditReportbyName(reportname) {
		return cy.clickAndAssertCalls(
			this.getEditReportbyName.contains(reportname),
			'**/mockups/*/charts?**',
			'GET',
			200,
		)
	}

	runReportByType(type) {
		cy.wait(2000)
		this.getRunReportButtons.filter(`[data-type="${type}"]`).scrollIntoView().click()
		//this.getRunReportButtons.filter(`[data-type="${type}"]`).click({ force: true })
		this.getNewReportModal.should('be.visible')
		this.getNewReportOptionsContainer.should('not.have.class', 'preload')
	}

	runReportByDataType(type) {
		this.getRunReportButtons.filter(`[data-type="${type}"]`).scrollIntoView().click()
		this.getNewReportModal.should('be.visible')
		this.getNewReportOptionsContainer.should('not.have.class', 'preload')
	}

	selectGroupByID(groupID) {
		this.getGroupSelect.select(groupID, { force: true }).invoke('val').should('eq', groupID)
	}

	selectGroupByName(groupName) {
		this.getGroupSelect
			.find('option')
			.contains(groupName)
			.invoke('index')
			.then(index => {
				this.getGroupSelect.select(index, { force: true })
			})
	}

	selectCourseListByName(courseListName) {
		this.getCourseListSelect.select(courseListName, { force: true })
		this.getAddCourseListButton.click()
		this.getCourseListTable.contains(courseListName).should('have.length', 1)
	}

	selectCourseByName(courseName) {
		this.getCourseSelect.select(courseName, { force: true })
		this.getAddCourseButton.click()
		this.getCourseTable.contains(courseName).should('have.length', 1)
	}

	setTimeZone(timeZone) {
		this.getTimeZoneSelect.select(timeZone, { force: true }).invoke('val').should('eq', timeZone)
	}

	setStartDate(date) {
		this.getStartDateField.focused().tab().clear({ force: true }).type(date).should('have.value', date)
		cy.get('#datepickers-container').invoke('hide')
	}

	setEndDate(date) {
		this.getEndDateField.focused().tab().clear({ force: true }).type(date).should('have.value', date)
		cy.get('#datepickers-container').invoke('hide')
	}

	setByMonth() {
		this.getByMonthCheckbox.check({ force: true }).should('be.checked')
	}

	setByCourse() {
		this.getByCourseCheckbox.check({ force: true }).should('be.checked')
	}

	setExcludeDisabledUsers() {
		this.getDisabledUsersCheckbox.check({ force: true }).should('be.checked')
	}

	setCoursesFormat(format) {
		this.getCoursesFormatSelect.select(format, { force: true }).invoke('val').should('eq', format)
	}

	setCoursesLanguage(language) {
		this.getCoursesLanguageSelect.select(language, { force: true }).invoke('val').should('eq', language)
	}

	setCoursesBlockOption(value) {
		this.getAllCoursesBlockInputs.check(value, { force: true }).should('be.checked')
	}

	setQuizCourseByName(courseName) {
		this.getQuizCourseSelect.select(courseName, { force: true })
	}

	setQuizCourseLanguage(language) {
		this.getQuizLanguageSelect.select(language, { force: true }).invoke('val').should('eq', language)
	}

	setQuizByName(quizName) {
		this.getQuizSelect
			.find('option')
			.contains(quizName)
			.invoke('index')
			.then(index => {
				this.getQuizSelect.select(index, { force: true })
			})
	}

	setQuestionBankCategory(category) {
		this.getQuestionBankSelect
			.find('option')
			.contains(category)
			.invoke('index')
			.then(index => {
				this.getQuestionBankSelect.select(index, { force: true })
			})
	}

	setInstructorClassCourseByName(courseName) {
		this.getInstructorClassCourseSelect
			.find('option')
			.contains(courseName)
			.invoke('index')
			.then(index => {
				this.getInstructorClassCourseSelect.select(index, { force: true })
			})
	}

	setInstructor(instructor) {
		this.getInstructorSelect
			.find('option')
			.contains(instructor)
			.invoke('index')
			.then(index => {
				this.getInstructorSelect.select(index, { force: true })
			})
	}

	setSubscriptionByName(subscriptionName) {
		this.getSubscriptionSelect
			.find('option')
			.contains(subscriptionName)
			.invoke('index')
			.then(index => {
				this.getSubscriptionSelect.select(index, { force: true })
			})
	}

	setLicenseStartDate(date) {
		this.getLicenseStartDateField.focus().clear().type(date).should('have.value', date)
	}

	setLicenseEndDate(date) {
		this.getLicenseEndDateField.focus().clear().type(date).should('have.value', date)
	}

	setIncludeNotStarted() {
		this.getNotStartedCheckbox.check().should('be.checked')
	}

	createReport() {
		this.getCreateReportButton.scrollIntoView()
		return cy.clickAndAssertMultCallsForced(this.getCreateReportButton, [['**/mockups/report', 'POST', 200]])
	}

	goToReport() {
		return cy.clickAndAssertCalls(this.getGoToReportLink, '**/reports?_start=0&_limit=20**', 'GET', 200)
	}

	// Why do we use a different modal for classes reports???
	get getClassesReportModal() {
		return cy.get('div.is_open[data-role="ClassesReportModal"]')
	}
	get getClassesReportOptionsContainer() {
		return this.getClassesReportModal.find('div[data-role="ClassesReportOptions"]')
	}
	get getClassesCreateReportButton() {
		return this.getClassesReportModal.find('span[data-action="onReportCreate"]')
	}
	get getClassCourseSelect() {
		return this.getClassesReportModal.find('div[data-role="coursesEnum"] select')
	}
	get getAddClassCourseButton() {
		return this.getClassesReportModal.find('span[data-action="onAddCourseForClass"]')
	}
	get getClassCourseTable() {
		return this.getClassesReportModal.find('table[data-role="courseOfList"] tbody')
	}
	// Remove the above options once we get rid of classes modal
	// REMOVE THESE METHODS ONCE WE GET RID OF CLASSES MODAL
	runReportByTypeClass() {
		cy.wait(1000)
		this.getRunReportButtons.filter('[data-type="classes_attendance"]').scrollIntoView().click()
		this.getClassesReportModal.should('be.visible')
		this.getClassesReportOptionsContainer.should('not.have.class', 'preload')
	}
	createClassesReport() {
		return cy.clickAndAssertCalls(this.getClassesCreateReportButton, '**/mockups/report', 'POST', 200)
	}

	selectClassCourseByName(courseName) {
		this.getClassCourseSelect
			.find('option')
			.contains(courseName)
			.invoke('index')
			.then(index => {
				this.getClassCourseSelect.select(index, { force: true })
				this.getAddClassCourseButton.click()
				this.getClassCourseTable.contains(courseName).should('have.length', 1)
			})
	}
	// REMOVE THESE METHODS ONCE WE GET RID OF CLASSES MODAL
}

export default Reports
