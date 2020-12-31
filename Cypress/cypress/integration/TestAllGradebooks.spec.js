/// <reference types="cypress" />
/// <reference types="cypress-localstorage-commands" />
const Login = require("../fixtures/stubLogin.json")
import { authLogin } from '../pageObjects/login'
const Locators = require("../fixtures/Locators.json")

var token
var pageData
var data
var search = 'Vukov'

describe("Testing All Gradebooks Page", () => {
    beforeEach("Visit All Gradebooks", () => {
        cy.visit('/')
        cy.url().should("contains", "gradebook.vivifyideas")
        authLogin.login("vuk.vojvodic021@gmail.com", '12345678')
        cy.contains('Gradebooks').should('be.visible')
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
    it('Pagination has 10 items', () => {
        cy.contains('All Gradebooks Page').should('be.visible')
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries?page=1',
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).its('body').then((rensponeBody) => {
                pageData = rensponeBody
                data = rensponeBody.data
                cy.expect(pageData.current_page).to.eq(1)
                cy.expect(data).to.have.length(10)
            })
    })
    it('Testing pagination(2nd page?)', () => {
        cy.get(Locators.Gradebooks.Next).click()
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/search?search_term=&page=2',
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).its('body').then((rensponeBody) => {
                pageData = rensponeBody
                cy.expect(pageData.current_page).to.eq(2)
                cy.expect(pageData.from).to.eq(11)
                cy.expect(pageData.to).to.eq(20)
            })
    })
    it('Test filter', () => {
        cy.get(Locators.Gradebooks.Filter).type(search)
        cy.get(Locators.Gradebooks.Search).click()
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/search?search_term=' + search + '&page=1',
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).its('body').then((rensponeceBody) => {
                var body = rensponeceBody;
                cy.expect(body.data[0].title).to.eq("Vukov Gradebook")
                cy.expect(body.data[0].professor.user.firstName).to.eq("Vuk")
                cy.expect(body.data[0].professor.user.lastName).to.eq("Vojvodic")
            })

    })
})