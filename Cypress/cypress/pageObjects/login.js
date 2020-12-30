class AuthLogin{
    get email(){
        return cy.get("input[type='text']")
    }
    get password(){
        return cy.get("input[type='password']")
    }
    get submit(){
        return cy.get("button[type='submit']")
    }
    login(email,password){
        this.email.type(email)
        this.password.type(password)
        this.submit.click()
    }    
}
export const authLogin = new AuthLogin()