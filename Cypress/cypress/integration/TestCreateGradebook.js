/// <reference types="cypress" />
const Locators = require("../fixtures/Locators.json")
const Login = require("../fixtures/stubLogin.json")
import { authLogin } from '../pageObjects/login'

var token
var pageData
var stringE = "PKN785P0m8znnJEBSIR28vJcLUdXEZ7PP5VaQo9o00hJEc@UyKJINyNRN1OGZg4C4j0f7ndnOGBKbOH2cuoaib08LR3gokbYBQEWLl5eWkp68PRwJ3pKKIAzrVcNQXroAYQieZkcSzHVfJBq7ljo07etzx8OMQcRpRPe8xYGdkBXKQo03GVA4uGo47WDH0cH43hsgY0mAOMvKSZCIcb2hNhuqM2eerVFmRAB"
var message = 'Please fill out this field.'

describe("Testing Create Gradebook Page", () => {
    beforeEach("Login", () => {
        cy.visit('/')
        cy.url().should("contains", "gradebook.vivifyideas")
        authLogin.login("vuk.vojvodic021@gmail.com", '12345678')
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
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/login',
            { fixture: 'stubLogin.json' }
        )
    })
    it("Visit Create Gradebook", () => {
        cy.get(Locators.Header.CreateGradebook).click()
        cy.url().should("contains", "create-gradebook")
        cy.contains('Create Gradebook Page').should('be.visible')
        cy.get(Locators.SignOut.Logoff).click()
    })
    it('Create Gradebook', () => {
        cy.request(
            {
                method: 'POST',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: {
                    "professor_id": 1038,
                    "title": "Vukov Gradebook"
                }
            }).its('body').then((rensponseBody) => {
                pageData = rensponseBody
                cy.expect(pageData.professor_id).to.eq(1038)
            })
        cy.url().should("contains", "gradebooks")
        cy.get(Locators.SignOut.Logoff).click()
    })
    it('Create GB no data', () => {
        cy.get(Locators.Header.CreateGradebook).click()
        cy.contains('Create Gradebook Page').should('be.visible')
        cy.get(Locators.CreateGB.Title).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
        cy.get(Locators.CreateGB.Button).click()
        cy.get(Locators.SignOut.Logoff).click()
    })
    it('Create GB no Name', () => {
        cy.get(Locators.Header.CreateGradebook).click()
        cy.contains('Create Gradebook Page').should('be.visible')
        cy.get(Locators.CreateGB.Title).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
        cy.get('select').select('Professor Vuk Vojvodic')
        cy.get(Locators.CreateGB.Button).click()
        cy.contains('The given data was invalid.').should('be.visible')
        cy.get(Locators.SignOut.Logoff).click()
    })
    it('Create GB no Prof', () => {
        cy.get(Locators.Header.CreateGradebook).click()
        cy.contains('Create Gradebook Page').should('be.visible')
        cy.get(Locators.CreateGB.Title).type('Vojtest')
        cy.get(Locators.CreateGB.Button).click()
        cy.contains('The given data was invalid.').should('be.visible')
        cy.get(Locators.SignOut.Logoff).click()
    })
})