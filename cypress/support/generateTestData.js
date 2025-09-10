const xlsx = require('xlsx')
const fs = require('fs')
const path = require('path')

const workbook = xlsx.readFile('cypress/fixtures/intuition_courses.xlsx')
const sheetName = workbook.SheetNames[0]
const sheet = workbook.Sheets[sheetName]
const data = xlsx.utils.sheet_to_json(sheet)

// Simplify data if necessary, e.g., extract only URLs
const simplifiedData = data.map(row => ({
	url: row['url'], // Replace with your actual URL column name
}))

// Write the data to a file
const outputPath = path.join(__dirname, 'cypress/fixtures/intuition_courses.json')
fs.writeFileSync(outputPath, JSON.stringify(simplifiedData, null, 2))
