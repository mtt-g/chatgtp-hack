describe('template spec', () => {
  it('passes', () => {
    cy.visit('dashboard/index.html')
  })
})

describe('Pac-Man Link', () => {
  it('should locate a link on the page', () => {
    // Visit the webpage
    cy.visit('dashboard/index.html')
    
    // Locate the link by its text content
    cy.get('a[href="../pacman/pacman.html"]')
  })
})

describe('Tetris Link', () => {
  it('should locate a link on the page', () => {
    // Visit the webpage
    cy.visit('dashboard/index.html')
    
    // Locate the link by its text content
    cy.get('a[href="../tetris/tetris.html"]')
  })
})

describe('Pong Link', () => {
  it('should locate a link on the page', () => {
    // Visit the webpage
    cy.visit('dashboard/index.html')
    
    // Locate the link by its text content
    cy.get('a[href="../pong/pong.html"]')
  })
})

describe('PYCR Link', () => {
  it('should locate a link on the page', () => {
    // Visit the webpage
    cy.visit('dashboard/index.html')
    
    // Locate the link by its text content
    cy.get('a[href="../play_your_cards_right/playyourcardsright.html"]')
  })
})

describe('Click the links. Ensure HTTP 2xx response', () => {
  it('should click all links on the page and verify HTTP 200 response', () => {
    // Visit the webpage
    cy.visit('dashboard/index.html')
    
    // Get all links on the page
    cy.get('a').each(($a) => {
      // Click the link and verify HTTP 200 response
      cy.request($a.prop('href')).its('status').should('equal', 200)
    })
  })
})