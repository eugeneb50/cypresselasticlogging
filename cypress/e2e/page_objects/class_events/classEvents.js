class ClassEvents {
	constructor() {
		this.Events = new Events()
	}
}

class Events {
	get getEventsTable() {
		return cy.get('div.ClassEventListTable div.Table-body')
	}
	get getEventRows() {
		return this.getEventsTable.find('div.Table-row-item')
	}
	get getReportButton() {
		return cy.get('div.ClassEventListTableHeader button[aria-label="Generate report"]')
	}
	get getReportCreatedModal() {
		return cy.get('div.ReportCreatedModal')
	}
	get getGoToReportButton() {
		return this.getReportCreatedModal.find('button[aria-label="Go to report page"]')
	}

	extractTableData() {
		const tableData = []
		this.getEventRows.as('eventRows')

		return cy
			.get('@eventRows')
			.each((row, rowIndex) => {
				tableData[rowIndex] = []
				cy.wrap(row, { log: false })
					.find('div.Table-cell', { log: false })
					.not('.action', { log: false })
					.each((column, columnIndex) => {
						cy.wrap(column, { log: false }).should($column => {
							tableData[rowIndex][columnIndex] = $column.text().trim()
						})
					})
			})
			.then(() => {
				return tableData
			})
	}

	clickGenerateReport() {
		return cy.clickAndAssertCalls(this.getReportButton, '**/accounts/*/reports/', 'POST', 200)
	}

	goToReport() {
		this.getGoToReportButton.click()
	}
}

export default ClassEvents
