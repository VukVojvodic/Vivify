/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />
const Locators = require("../fixtures/Locators.json")
const faker = require('faker')

var string225 = "PKN785P0m8znnJEBSIR28vJcLUdXEZ7PP5VaQo9o00hJEcUyKJINyNRN1OGZg4C4j0f7ndnOGBKbOH2cuoaib08LR3gokbYBQEWLl5eWkp68PRwJ3pKKIAzrVcNQXroAYQieZkcSzHVfJBq7ljo07etzx8OMQcRpRPe8xYGdkBXKQo03GVA4uGo47WDH0cH43hsgY0mAOMvKSZCIcb2hNhuqM2eerVFmRAB"
var stringE = "PKN785P0m8znnJEBSIR28vJcLUdXEZ7PP5VaQo9o00hJEc@UyKJINyNRN1OGZg4C4j0f7ndnOGBKbOH2cuoaib08LR3gokbYBQEWLl5eWkp68PRwJ3pKKIAzrVcNQXroAYQieZkcSzHVfJBq7ljo07etzx8OMQcRpRPe8xYGdkBXKQo03GVA4uGo47WDH0cH43hsgY0mAOMvKSZCIcb2hNhuqM2eerVFmRAB"
var token

let userData = {
    randomPass: faker.internet.password(),
    randomEmail: faker.internet.email()
}
var message = 'Please fill out this field.'

describe("Testing Login Page", () => {
    beforeEach("Visit gradebook", () => {
        cy.visit('/')
        cy.url().should("contains", "gradebook.vivifyideas")
        cy.contains('Login').should('be.visible')
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
    it('Stubed login', () => {
        cy.get(Locators.Login.Email).type('vuk.vojvodic021@gmail.com')
        cy.get(Locators.Login.Password).type('12345678')
        cy.get(Locators.Login.Button).click()
        token = cy.getLocalStorage('token')
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login',
            { fixture: 'stubLogin.json', token }
        )
    })
    it('Intercepted login', () => {
        cy.get(Locators.Login.Email).type('vuk.vojvodic021@gmail.com')
        cy.get(Locators.Login.Password).type('12345678')
        cy.get(Locators.Login.Button).click()
        cy.intercept('https://gradebook-api.vivifyideas.com/api/login', (req) => {
            req.reply((res) => {
                expect(res.body.user.id).to.eq(1080)
            })
        }
        )
    })
    it('login no data', () => {
        cy.get(Locators.Login.Button).click()
        cy.get(Locators.Login.Email).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
    })
    it('Login widouth Email', () => {
        cy.get(Locators.Login.Password).type(userData.randomPass)
        cy.get(Locators.Login.Button).click()
        cy.get(Locators.Login.Email).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
    })
    it('Login widouth password', () => {
        cy.get(Locators.Login.Email).type(userData.randomEmail)
        cy.get(Locators.Login.Button).click()
        cy.get(Locators.Login.Password).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
    })
    it('Login wrong password', () => {
        cy.request({
            method: 'POST',
            url: 'https://gradebook-api.vivifyideas.com/api/login',
            failOnStatusCode: false,
            body:
            {
                email: 'vuk.vojvodic021@gmail.com',
                password: 'test1234',
            }
        }).then((response) => {
            expect(response.status).to.equal(401)
            expect(response.body.error).to.equal("invalid_credentials")
            expect(response.statusText).to.equal("Unauthorized")
        })
    })
    it('Login wrong Email', () => {
        cy.request({
            method: 'POST',
            url: 'https://gradebook-api.vivifyideas.com/api/login',
            failOnStatusCode: false,
            body:
            {
                email: 'testVuk1234@test.com',
                password: '12345678',
            }
        }).then((response) => {
            expect(response.status).to.equal(401)
            expect(response.body.error).to.equal("invalid_credentials")
            expect(response.statusText).to.equal("Unauthorized")
        })
    })
})