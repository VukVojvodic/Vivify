class Header{
    get loginButton(){
        return cy.get('a[href="/login"]')
    }
    get registerButton(){
        return cy.get('a[href="/register"]')
    }
    get gradebooksButton(){
        return cy.get("a[href='/gradebooks']")
    }
    get myGradebookButton(){
        return cy.get("a[href='my-gradebook/']")
    }
    get createGradebookButton(){
        return cy.get("a[href='/create-gradebook']")
    }
    get ProfessorsButton(){
        return cy.get("a[href='/gradebooks#']")
    }
    get allProfessorsButton(){
        return cy.get("a[href='/all-professors']")
    }
    get createProfessorButton(){
        return cy.get("a[href='/create-professor']")
    }
    get logoutButton(){
        return cy.get("a[href='#']")
    }
    logout(){
        this.logoutButton.click()
    }
}
export const header = new Header()