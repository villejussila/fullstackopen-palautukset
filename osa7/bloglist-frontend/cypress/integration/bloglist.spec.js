describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Ville Jussila',
      username: 'villej',
      password: 'salasana',
    }
    const user2 = {
      name: 'test',
      username: 'test',
      password: 'test',
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.request('POST', 'http://localhost:3003/api/users/', user2)
    cy.visit('http://localhost:3000')
  })
  it('Login form is shown', function () {
    cy.contains('Login to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('villej')
      cy.get('#password').type('salasana')
      cy.get('#login-button').click()

      cy.contains('Ville Jussila logged in')
    })

    it('fails with wrong credentials and shows red error message', function () {
      cy.get('#username').type('wrong')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.contains('invalid username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')

      cy.get('html').should('not.contain', 'Ville Jussila logged in')
    })
    describe('When logged in', function () {
      beforeEach(function () {
        cy.login({ username: 'villej', password: 'salasana' })
      })
      it('A blog can be created', function () {
        cy.contains('create new blog').click()

        cy.get('#title').type('cypress is cool')
        cy.get('#author').type('Cyp Ress')
        cy.get('#url').type('https://cypress.io')

        cy.get('#submit-button').click()

        cy.contains('cypress is cool Cyp Ress')
      })
      describe('and a blog exists', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'cypress made this',
            author: 'cypress',
            url: 'https://cypress.io',
          })
        })
        it('it can be liked', function () {
          cy.contains('cypress made this').contains('view').click()
          cy.contains('cypress made this')
            .parent()
            .find('.likeButton')
            .as('theButton')
          cy.get('@theButton').click()
          cy.get('@theButton').parent().should('contain', 'likes 1')
        })
        it('it can be deleted by the user who made it', function () {
          cy.contains('cypress made this').contains('view').click()
          cy.contains('cypress made this')
            .parent()
            .get('.removeButton')
            .as('removeButton')
          cy.get('@removeButton').click()
          cy.get('html').should('not.contain', 'cypress made this')
        })
        it('it can not be deleted by another user', function () {
          cy.login({ username: 'test', password: 'test' })
          cy.contains('test logged in')
          cy.contains('cypress made this').contains('view').click()
          cy.contains('cypress made this').should('not.contain', 'remove')
        })
      })
      describe('multiple blogs exist', function () {
        beforeEach(function () {
          cy.createBlog({
            title: 'not popular',
            author: 'cypress',
            url: 'url.com',
            likes: 1,
          })
          cy.createBlog({
            title: 'most likes',
            author: 'cypress',
            url: 'url.com',
            likes: 9,
          })
          cy.createBlog({
            title: 'another blog',
            author: 'cypress',
            url: 'url.com',
            likes: 8,
          })
        })
        it('blogs are sorted by most likes in descending order', function () {
          cy.get('.blog-item').then((blogs) => {
            let first = blogs[0]
            let second = blogs[1]
            let third = blogs[2]
            cy.get(first).should('contain', 'most likes')
            cy.get(second).should('contain', 'another blog')
            cy.get(third).should('contain', 'not popular')
          })
        })
        it('blog order is updated when a blog gets more likes than previous blog', function () {
          cy.get('.blog-item:first').should('contain', 'most likes')
          cy.contains('another blog').contains('view').click()
          cy.contains('another blog').get('.likeButton').as('likeButton')
          cy.get('@likeButton').click()
          cy.wait(500)
          cy.get('@likeButton').click()
          cy.wait(500)
          cy.get('.blog-item:first').should('contain', 'another blog')
        })
      })
    })
  })
})
