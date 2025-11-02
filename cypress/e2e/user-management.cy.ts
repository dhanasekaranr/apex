describe('User Management Table', () => {
  it('should display at least 5 user records after navigating via menu', () => {
    // 1. Visit the app
    cy.visit('/');

    // 2. Click the menu item for Pilot Enablement (more robust selector)
    cy.contains('Pilot Enablement')
      .scrollIntoView()
      .should('be.visible')
      .click();

    // 3. Wait for the User Management header to appear (using .dashboard-title)
    cy.get('h1').contains('User Management').should('be.visible');

    // 4. Assert that the user table has at least 5 rows (adjust selector as needed)
    cy.get('table tbody tr').should('have.length.at.least', 5);
  });
});
