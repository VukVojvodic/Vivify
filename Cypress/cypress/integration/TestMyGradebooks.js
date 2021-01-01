/// <reference types="cypress" />
const Locators = require("../fixtures/Locators.json")
const Login = require("../fixtures/stubLogin.json")
const Mygb = require("../fixtures/stubMyGradebook.json")
import { authLogin } from '../pageObjects/login'

var token
var pageData
var myGB_id = Mygb.id
var prof_id = Mygb.professor_id
var stringE = "PKN785P0m8znnJEBSIR28vJcLUdXEZ7PP5VaQo9o00hJEc@UyKJINyNRN1OGZg4C4j0f7ndnOGBKbOH2cuoaib08LR3gokbYBQEWLl5eWkp68PRwJ3pKKIAzrVcNQXroAYQieZkcSzHVfJBq7ljo07etzx8OMQcRpRPe8xYGdkBXKQo03GVA4uGo47WDH0cH43hsgY0mAOMvKSZCIcb2hNhuqM2eerVFmRAB"
var message = 'Please fill out this field.'

describe("Testing My Gradebooks Page", () => {
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
    it("Visit My Gradebooks", () => {
        cy.get(Locators.Header.MyGradebook).click()
        cy.intercept('GET', 'https://gradebook-api.vivifyideas.com/api/diaries/my-diary/' + prof_id,
            { fixture: 'stubMyGradebook.json' }
        )
        cy.url().should("contains", "my-gradebook")
        cy.contains('My Gradebook Page').should('be.visible')
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Get My Gradebook', () => {
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/my-diary/' + prof_id,
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).its('body').then((rensponseBody) => {
                pageData = rensponseBody
                cy.expect(pageData.professor_id).to.eq(prof_id)
            })
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Get Single Gradebook', () => {
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/601',
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then((rensponseBody) => {
                pageData = rensponseBody.body
                cy.expect(pageData.professor_id).to.eq(prof_id)
            })
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Add Student no data', () => {
        cy.get(Locators.Header.MyGradebook).click()
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/my-diary/' + myGB_id,
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
        cy.get(Locators.MyGradebook.AddSubmit).contains('Add Student').click()
        cy.request(
            {
                method: 'POST',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/' + myGB_id + '/students',
                headers: {
                    authorization: `Bearer ${token}`
                },
                failOnStatusCode: false,
            }).then((rensponseBody) => {
                cy.expect(rensponseBody.status).to.eq(500)
                cy.expect(rensponseBody.statusText).to.eq("Internal Server Error")
            })
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Add Student no LN', () => {
        cy.wait(500)
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(500)
        cy.get(Locators.MyGradebook.AddSubmit).contains('Add Student').click()
        cy.get(Locators.AddStudent.FN).type('Vuk')
        cy.request(
            {
                method: 'POST',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/' + myGB_id + '/students',
                headers: {
                    authorization: `Bearer ${token}`
                },
                failOnStatusCode: false,
                body: {
                    firstName: 'Vuk'
                }
            }).then((rensponseBody) => {
                cy.expect(rensponseBody.status).to.eq(500)
                cy.expect(rensponseBody.statusText).to.eq("Internal Server Error")
            })
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Add Student no FN', () => {
        cy.wait(500)
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(500)
        cy.get(Locators.MyGradebook.AddSubmit).contains('Add Student').click()
        cy.get(Locators.AddStudent.LN).type('Vojvodic')
        cy.request(
            {
                method: 'POST',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/' + myGB_id + '/students',
                headers: {
                    authorization: `Bearer ${token}`
                },
                body: {
                    lastName: 'Vojvodic'
                },
                failOnStatusCode: false,
            }).then((rensponseBody) => {
                cy.expect(rensponseBody.status).to.eq(500)
                cy.expect(rensponseBody.statusText).to.eq("Internal Server Error")
            })
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Add Student', () => {
        cy.wait(300)
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(300)
        cy.get(Locators.MyGradebook.AddSubmit).contains('Add Student').click()
        cy.get(Locators.AddStudent.FN).type('VukSt')
        cy.get(Locators.AddStudent.LN).type('VojvodicSt')
        cy.request(
            {
                method: 'POST',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/' + myGB_id + '/students',
                headers: {
                    authorization: `Bearer ${token}`
                },
                failOnStatusCode: false,
                body: {
                    "firstName": "VukSt",
                    "lastName": "VojvodicSt",
                    "url": []
                }
            })
        cy.get(Locators.Header.MyGradebook).click()
        cy.get('table').contains('td', 'VukSt VojvodicSt')
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Add Comment', () => {
        cy.wait(300)
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(400)
        cy.get(Locators.MyGradebook.Comment).type('Vuks Comment')
        cy.get(Locators.MyGradebook.AddSubmit).contains('Submit Comment').click()
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/' + myGB_id,
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then((rensponseBody) => {
                console.log(rensponseBody)
                pageData = rensponseBody.body
                cy.expect(pageData.professor_id).to.eq(prof_id)
            })
        cy.get(Locators.Header.Gradebooks).click()
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(500)
        cy.contains('Vuks Comment').should('be.visible')
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Delete Comment', () => {
        cy.wait(300)
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(400)
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/' + myGB_id,
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then((rensponseBody) => {
                console.log(rensponseBody)
                pageData = rensponseBody.body
                cy.expect(pageData.professor_id).to.eq(prof_id)
            })
        cy.get(Locators.Header.Gradebooks).click()
        cy.get(Locators.Header.MyGradebook).click()
        cy.contains('Vuks Comment').should('be.visible')
        cy.get('.comments-box > :nth-child(2) > div > .btn').contains('Delete').click()
        cy.contains('Vuks Comment').should('not.exist')
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
    it('Edit Gradebook', () => {
        cy.wait(300)
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(400)
        cy.request(
            {
                method: 'GET',
                url: 'https://gradebook-api.vivifyideas.com/api/diaries/' + myGB_id,
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then((rensponseBody) => {
                console.log(rensponseBody)
                pageData = rensponseBody.body
                cy.expect(pageData.professor_id).to.eq(prof_id)
            })
        cy.get(Locators.Header.Gradebooks).click()
        cy.get(Locators.Header.MyGradebook).click()
        cy.get(Locators.MyGradebook.EditGB).contains('Edit Gradebook').click()
        cy.wait(400)
        cy.get(Locators.CreateGB.Title).clear()
        cy.get(Locators.CreateGB.Title).type("Vukov2 Gradebook2")
        cy.get(Locators.CreateGB.Button).click()
        cy.wait(500)
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(400)
        cy.contains('Vukov2 Gradebook2').should('be.visible')
        cy.get(Locators.MyGradebook.EditGB).contains('Edit Gradebook').click()
        cy.wait(400)
        cy.get(Locators.CreateGB.Title).clear()
        cy.get(Locators.CreateGB.Title).type("Vukov Gradebook")
        cy.get(Locators.CreateGB.Button).click()
        cy.get(Locators.Header.MyGradebook).click()
        cy.wait(500)
        cy.contains('Vukov Gradebook').should('be.visible')
        cy.get(Locators.SignOut.Logoff).click()
        cy.clearCookies()
    })
})
