import tags from '/cypress/fixtures/tags.json'

// Define and export the function to get test tags
export function getSpecTags() {
	const specName = Cypress.spec.name.replace('.cy.js', '')
	const testTags = ['@automation', Cypress.env('runEnv')]

	// Process the tags JSON to find relevant tags
	for (const category in tags) {
		const subcategories = tags[category]
		for (const subcategory in subcategories) {
			const tagsForSpec = subcategories[subcategory]
			if (tagsForSpec.includes(specName)) {
				testTags.push(subcategory)
			}
		}
	}

	return testTags
}
