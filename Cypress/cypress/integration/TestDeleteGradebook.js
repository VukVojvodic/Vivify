/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />
const Locators = require("../fixtures/Locators.json")
const Login = require("../fixtures/stubLogin2.json")
import { authLogin } from '../pageObjects/login'

var token = Login.token
var pageData
var professor_id = Login.user.id
var gradebookID

describe("Testing My Gradebooks Page", () => {
    beforeEach("Login", () => {
        cy.visit('/')
        cy.url().should("contains", "gradebook.vivifyideas")
        authLogin.login("vuktest@gmail", '12345678')
        cy.request({
            method: 'POST',
            url: 'https://gradebook-api.vivifyideas.com/api/login',
            body:
            {
                email: 'vuktest@gmail',
                password: '12345678',
            }
        }).its('body').then((response) => {
            token = response.token
            professor_id = response.user.id
            const target = (response)
            return target
        })
    })
    it('Delete Gradebook', () => {
        cy.request(
            {
                method: 'POST',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: {
                    "professor_id": professor_id,
                    "title": "VukDelete Gradebook"
                }
            }).its('body').then((rensponseBody) => {
                pageData = rensponseBody
                gradebookID = rensponseBody.id
                cy.expect(pageData.professor_id).to.eq(professor_id)
            })
        cy.wait(400)
        cy.contains('My Gradebook').click()
        cy.wait(400)
        cy.get(Locators.Header.Gradebooks).click()
        cy.contains('My Gradebook').click()
        cy.get(Locators.MyGradebook.Delete).contains('Delete Gradebook').click()
        cy.wait(500)
        cy.contains('My Gradebook').click()
        cy.wait(400)
        cy.contains('VukDelete Gradebook').should('not.exist')
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
})
