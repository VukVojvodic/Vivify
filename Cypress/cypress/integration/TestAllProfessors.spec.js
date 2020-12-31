/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />
const Locators = require("../fixtures/Locators.json")
const Login = require("../fixtures/stubLogin.json")
const AllProf = require("../fixtures/stubAllProfessors.json")
import { authLogin } from '../pageObjects/login'

var token
var pageData
var data
var prof = AllProf[8]
var search = 'gandra'

describe("Testing All Professors Page", () => {
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
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Professors.AllProfessors).click()
        cy.url().should("contains", "professors")
        cy.contains('Gradebooks').should('be.visible')

    })
    it('Visit All Proffesors page', () => {
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Professors.AllProfessors).click()
        cy.url().should("contains", "professors")
        cy.get(Locators.SignOut.Logoff).click()
    })
    it('Testing All Proffesors page', () => {
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/professors',
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).its('body').then((rensponseBody) => {
                pageData = rensponseBody
                cy.expect(pageData).to.deep.include(prof)
            })
        cy.get(Locators.SignOut.Logoff).click()
    })
    it('Stub All Professors', () => {
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/professors',
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/professors', {
            fixture: 'stubAllProfessors.json'
        }).as('users')
        cy.get(Locators.SignOut.Logoff).click()
        authLogin.login("vuk.vojvodic021@gmail.com", '12345678')
        cy.get(Locators.Header.Professors).click()
        cy.get(Locators.Professors.AllProfessors).click()        
        cy.wait('@users').its('response.body').should('have.length', 11)
        cy.get(Locators.SignOut.Logoff).click()
    })
    it('Test filter', () => {
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/professors',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: `${search}`
            })
        cy.get("input[class='form-control']").type("gandra")
        cy.get('table').contains('td', 'gandra').as("YES0")
        cy.waitFor("@YES0").then(
            data = "Postoji gandra",
            cy.expect(data).to.contains("Postoji gandra")
        )
        cy.get(Locators.SignOut.Logoff).click()
    })
})