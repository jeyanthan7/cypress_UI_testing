describe("Form test", () => {
    it("Can fill the form", () => {
      cy.visit("/");
      cy.get("form");
  
      cy.get('input[name="q"]').type("India");
      cy.get("form").submit();
    });
  });