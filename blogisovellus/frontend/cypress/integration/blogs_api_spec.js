describe('Blogs initialize', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    cy.visit('http://localhost:3000')
  })

  it('front page can be opened', function () {
    cy.contains('Parhaat nettisivut')
  })

  it('register form can be opened', function () {
    cy.contains('Rekisteröidy')
      .click()
    cy.contains('Nimi')
  })

  it('user can be registered', function () {
    cy.contains('Rekisteröidy')
      .click()
    cy.get('#reg-name-input')
      .type('Katti Matikainen')
    cy.get('#reg-username-input')
      .type('kattimatikainen')
    cy.get('#reg-password-input')
      .type('katti')
    cy.get('#reg-submit')
      .click()
    cy.contains('Onnistui')
  })

})

describe('Blogs in use', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Katti Matikainen',
      username: 'kattimatikainen',
      password: 'katti'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('login form can be opened', function () {
    cy.contains('Kirjaudu sisään')
      .click()
    cy.contains('Käyttäjätunnus')
  })

  it('user can log in', function () {
    cy.contains('Kirjaudu sisään')
      .click()
    cy.get('#username')
      .type('kattimatikainen')
    cy.get('#password')
      .type('katti')
    cy.get('#Kirjaudu')
      .click()
    cy.contains('Katti Matikainen')
    cy.contains('Kirjaudu ulos')
      .click()
  })

  // it('developer does not fuck things up', function () {
  //   const blog = {
  //     title: 'Cypress tried to do this',
  //     author: 'C',
  //     url: 'c.net'
  //   }

  //   //const ticket = cy.request('GET', 'http://localhost:3003/api/login').auth('kattimatikainen', 'katti', false, 'bearer 123456789')
  //   const options = {
  //     method: 'POST',
  //     url: 'http://localhost:3003/api/blogs/',
  //     auth: { username: 'kattimatikainen', password: 'katti' },
  //     body: blog
  //   }
  //   cy.request(options)
  // })

  describe('when logged in', function () {
    beforeEach(function () {
      cy.contains('Kirjaudu sisään')
        .click()
      cy.get('#username')
        .type('kattimatikainen')
      cy.get('#password')
        .type('katti')
      cy.get('#Kirjaudu')
        .click()
      cy.contains('Katti Matikainen')
    })

    it('a new blog can be created', function () {
      cy.contains('Lisää sivu')
        .click()
      cy.get('#title-input')
        .type('Cypress teki tämän.')
      cy.get('#author-input')
        .type('C')
      cy.get('#url-input')
        .type('c.net')
      cy.get('#blog-submit')
        .click()
      cy.contains('Cypress teki tämän.')
    })

    describe('when there is a blog', function () {
      beforeEach(function () {
        cy.contains('Lisää sivu')
          .click()
        cy.get('#title-input')
          .type('Cypress teki tämän.')
        cy.get('#author-input')
          .type('C')
        cy.get('#url-input')
          .type('c.net')
        cy.get('#blog-submit')
          .click()
        cy.wait(5500)
      })

      it('blog can be liked', function () {
        cy.get('[data-cy=vote-button]')
          .click()
        cy.get('[data-cy=blog-likes]')
          .contains('1')
      })

      it('blog can be removed', function () {
        cy.get('[data-cy=remove]')
          .click()
      })

      it('individual blog view can be opened', function () {
        cy.get('[data-cy=title-link]')
          .click()
        cy.get('[data-cy=add-comment]')
          .should('be.visible')
      })

      it('list of all users can be opened with correct information', function () {
        cy.get('[data-cy=users-link]')
          .click()
        cy.get('[data-cy=username]')
          .should('contain', 'kattimatikainen')
        cy.get('[data-cy=blogs-added]')
          .should('contain', 'lisännyt 1 sivun')
      })
    })
  })
})