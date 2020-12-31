/// <reference types="cypress" />
const Locators = require("../fixtures/Locators.json")
const Login = require("../fixtures/stubLogin.json")
const AllProf = require("../fixtures/stubAllProfessors.json")
import { authLogin } from '../pageObjects/login'

var token
var pageData
var stringE = "PKN785P0m8znnJEBSIR28vJcLUdXEZ7PP5VaQo9o00hJEc@UyKJINyNRN1OGZg4C4j0f7ndnOGBKbOH2cuoaib08LR3gokbYBQEWLl5eWkp68PRwJ3pKKIAzrVcNQXroAYQieZkcSzHVfJBq7ljo07etzx8OMQcRpRPe8xYGdkBXKQo03GVA4uGo47WDH0cH43hsgY0mAOMvKSZCIcb2hNhuqM2eerVFmRAB"
var message = 'Please fill out this field.'

describe("Testing Create Professor Page", () => {
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
    it("Visit Create Professor", () => {
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Professors.CreateProfessor).click()
        cy.url().should("contains", "create-professor")
        cy.contains('Add images').should('be.visible')
    })
    it('Create Proffesor', () => {
        cy.request(
            {
                method: 'POST',
                url: 'https://gradebook-api.vivifyideas.com/api/professors',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: {
                    "url": [0],
                    "firstName": "Vuktest",
                    "lastName": "Vojtest",
                    "diary_id": ""
                }
            }).its('body').then((rensponseBody) => {
                pageData = rensponseBody
                cy.expect(pageData.success).to.eq(true)
                cy.expect(pageData.message).to.eq("Images Saved!!")
            })
        cy.intercept('POST', 'https://gradebook-api.vivifyideas.com/api/professors', {
            fixture: 'stubCreateProfessor.json'
        })
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/professors', {
            fixture: 'stubAllProfessors.json'
        })
    })
    it('Create Prof no data', () => {
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.CreateProfessor).click()
        cy.get(Locators.CreateP.FN).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
        cy.get(Locators.CreateP.LN)
        cy.contains('Add images').should('be.visible')
        cy.get(Locators.CreateP.Submit).click()
    })
    it('Create Prof no FN', () => {
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.CreateProfessor).click()
        cy.get(Locators.CreateP.FN).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
        cy.get(Locators.CreateP.LN).type('Vojtest')
        cy.contains('Add images').should('be.visible')
        cy.get(Locators.CreateP.Submit).click()
    })
    it('Create Prof no LN', () => {
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.CreateProfessor).click()
        cy.get(Locators.CreateP.FN).type('Vojtest')
        cy.get(Locators.CreateP.LN).then(($input) => {
            expect($input[0].validationMessage).to.eq(message)
        })
        cy.contains('Add images').should('be.visible')
        cy.get(Locators.CreateP.Submit).click()
    })
    it('Create Prof no image', () => {
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.CreateProfessor).click()
        cy.get(Locators.CreateP.FN).type(stringE)
        cy.get(Locators.CreateP.LN).type(stringE)
        cy.contains('Add images').should('be.visible')
        cy.get(Locators.CreateP.Submit).click()
        cy.contains('The given data was invalid').should('be.visible')
    })
    it('Test maxlenght', () => {
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Header.CreateProfessor).click()
        cy.get(Locators.CreateP.FN).type(stringE)
        cy.get(Locators.CreateP.LN).type(stringE)
        cy.contains('Add images').should('be.visible')
        cy.get(Locators.CreateP.Add).type(stringE)
        cy.get(Locators.CreateP.URL).type(stringE)
        cy.log('[!!!Test failed succesefuly!!!](http://example.com)')
        cy.url().should("contains", "professor")
    })
    it('Test forcing no data', () => {
        cy.request(
            {
                method: 'POST',
                url: 'https://gradebook-api.vivifyideas.com/api/professors',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: {
                    "url": [],
                    "firstName": "",
                    "lastName": "",
                    "diary_id": ""
                }
            }).its('body').then((rensponseBody) => {
                cy.expect(rensponseBody).to.deep.contains("Laravel")
            })
    })
})