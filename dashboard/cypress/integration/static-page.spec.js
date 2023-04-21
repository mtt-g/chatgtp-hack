describe('Static page', () => {
    it('should load the page and test links', () => {
      cy.visit('path/to/static-page.html')
      
      // test links
      cy.get('a').click()
      cy.url().should('include', '/path-to-link-target.html')
    })
  })