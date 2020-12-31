/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />
const Locators = require("../fixtures/Locators.json")
const faker = require('faker')
var string225 = "PKN785P0m8znnJEBSIR28vJcLUdXEZ7PP5VaQo9o00hJEcUyKJINyNRN1OGZg4C4j0f7ndnOGBKbOH2cuoaib08LR3gokbYBQEWLl5eWkp68PRwJ3pKKIAzrVcNQXroAYQieZkcSzHVfJBq7ljo07etzx8OMQcRpRPe8xYGdkBXKQo03GVA4uGo47WDH0cH43hsgY0mAOMvKSZCIcb2hNhuqM2eerVFmRAB"
var stringE = "PKN785P0m8znnJEBSIR28vJcLUdXEZ7PP5VaQo9o00hJEc@UyKJINyNRN1OGZg4C4j0f7ndnOGBKbOH2cuoaib08LR3gokbYBQEWLl5eWkp68PRwJ3pKKIAzrVcNQXroAYQieZkcSzHVfJBq7ljo07etzx8OMQcRpRPe8xYGdkBXKQo03GVA4uGo47WDH0cH43hsgY0mAOMvKSZCIcb2hNhuqM2eerVFmRAB"
var token

let userData = {
    randomFN: faker.name.firstName(),
    randomLN: faker.name.lastName(),
    randomPass: faker.internet.password(),
    randomEmail: faker.internet.email()
}
var message = 'Please fill out this field.';
var messageE = 'Please enter an email address.';

describe("Testing Register Page", () => {
    beforeEach("Visit gradebook", () => {
        cy.visit('/')
        cy.url().should("contains", "gradebook.vivifyideas")
        cy.get(Locators.Header.Register).click()
        cy.contains('Sign in').should('be.visible')
        cy.request({
            method: 'POST',
            url: 'https://gradebook-api.vivifyideas.com/api/login',
            body:
            {
                email: 'vuk.vojvodic021@gmail.com',
                password: '12345678',
            }
        }).its('body').then((response) => {
            token = response.token
            window.localStorage.setItem('token', token)
        })
    })


    it('Stubed Register', () => {
        cy.get(Locators.Register.FN).type('test12')
        cy.get(Locators.Register.LN).type('test34')
        cy.get(Locators.Register.PW).type('test1234')
        cy.get(Locators.Register.PWC).type('test1234')
        cy.get(Locators.Register.EML).type('test1234@test.com')
        cy.get(Locators.Register.Button).click()
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/register',
            { fixture: 'stubRegister.json' }
        )
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login',
            { fixture: 'stubLogin.json'}
        )
    })
    it('Register widouth First Name', () => {
        cy.get(Locators.Register.LN).type(userData.randomLN)
        cy.get(Locators.Register.PW).type(userData.randomPass)
        cy.get(Locators.Register.PWC).type(userData.randomPass)
        cy.get(Locators.Register.EML).type(userData.randomEmail)
        cy.get(Locators.Register.Button).click()
        cy.get(Locators.Register.FN).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
    })
    it('Register widouth Last Name', () => {
        cy.get(Locators.Register.FN).type(userData.randomFN)
        cy.get(Locators.Register.PW).type(userData.randomPass)
        cy.get(Locators.Register.PWC).type(userData.randomPass)
        cy.get(Locators.Register.EML).type(userData.randomEmail)
        cy.get(Locators.Register.Button).click()
        cy.get(Locators.Register.LN).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
    })
    it('Register widouth Password', () => {
        cy.get(Locators.Register.FN).type(userData.randomFN)
        cy.get(Locators.Register.LN).type(userData.randomLN)
        cy.get(Locators.Register.EML).type(userData.randomEmail)
        cy.get(Locators.Register.PW).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
        cy.get(Locators.Register.Button).click()
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/register',
            { fixture: 'stubRegister.json' }
        )
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login',
            { fixture: 'stubLogin.json' }
        )
        cy.log('[Deliberatly trown error because othervise,](http://example.com)') 
        cy.log('[User will be created widouth Password.](http://example.com)')
        cy.log('[This bug will be fixed in next version.](http://example.com)')
        
    })
    it('Register widouth Email', () => {
        cy.get(Locators.Register.FN).type(userData.randomFN)
        cy.get(Locators.Register.LN).type(userData.randomLN)
        cy.get(Locators.Register.PW).type(userData.randomPass)
        cy.get(Locators.Register.PWC).type(userData.randomPass)
        cy.get(Locators.Register.Button).click()
        cy.get(Locators.Register.EML).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
    })
    it('Testing Input Maxlenght', () => {
        cy.log('[Very slow test](http://example.com)')
        cy.get(Locators.Register.FN).type(string225)
        cy.get(Locators.Register.LN).type(string225)
        cy.get(Locators.Register.PW).type(string225)
        cy.get(Locators.Register.PWC).type(string225)
        cy.get(Locators.Register.EML).type(stringE)
        cy.get(Locators.Register.Button).click()
        cy.log('[Deliberatly trown error because othervise,](http://example.com)') 
        cy.log('[User will be created with more than 225 letters.](http://example.com)')
        cy.log('[This bug will be fixed in next version.](http://example.com)')
        cy.get(Locators.Register.EML).then(($input) => {
            expect($input[0].validationMessage).to.not.eq(messageE)
        })
    })
})