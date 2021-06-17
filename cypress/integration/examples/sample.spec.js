describe("Form test", () => {
  it("1.first - cypress test case", () => {
    cy.visit("https://example.cypress.io");
    //cy.get("form");
    //cy.get('input[name="q"]').type("India");
    //cy.get("form").submit();
    cy.contains('type').click()
    cy.url()
    .should('include','commands/actions')

  });
  it("2.second google page", () => {
    cy.visit("https://www.google.com");
    cy.get("form");
    cy.get('input[name="q"]').type("India");
    cy.get("form").submit();


  });

});

// /// <reference types="Cypress" />

// describe('My First Test', () => {
//     it('clicking "type" navigates to a new url', () => {
//       cy.visit('https://example.cypress.io')
  
//       cy.contains('type').click()
  
//       // Should be on a new URL which includes '/commands/actions'
//       cy.url().should('include', '/commands/actions')
//     })
//   })

