
class LoginPage {
    enterSignUpName(name){
        cy.get('[data-qa="signup-name"]').type(name);
    }

    enterSignUpEmail(email){
        cy.get('[data-qa="signup-email"]').type(email);
    }

    fillAccountInformation(account){
        cy.get('#id_gender1').click({force:true}); //Mr.
        cy.get('#password').type(account.password);
        cy.get('[data-qa="days"]').select(account.dayDOB, {force:true});
        cy.get('#months').select(account.monthDOB, {force:true});
        cy.get('#years').select(account.yearDOB, {force:true});
        cy.get('#newsletter').check({force:true});
        cy.get('#optin').check({force:true});

        cy.get('#first_name').type(account.firstName);
        cy.get('#last_name').type(account.lastName);
        cy.get('#company');
        cy.get('#address1').type(account.address1);
        cy.get('#address2').type(account.address2);
        cy.get('#country').select(account.country);
        cy.get('#state').type(account.state);
        cy.get('#city').type(account.city);
        cy.get('#zipcode').type(account.zipcode);
        cy.get('#mobile_number').type(account.mobileNumber);
    }

    clickCreateAccount(){
        cy.get('[data-qa="create-account"]').click();
    }

    enterLoginEmail(email){
        cy.get('[data-qa="login-email"]').type(email);
    }

    enterLoginPassword(password){
        cy.get('[data-qa="login-password"]').type(password);
    }

    clickLogin(){
        cy.get('[data-qa="login-button"]').click({force: true});
    }

    getSignupEmailErrorMessage(){
        return cy.get('input[data-qa="signup-email"]').then(($input) =>{
            expect($input[0].validity.typeMismatch).to.be.true;
        })
    }

    assertRequiredFieldErrorMessage(selector){
        cy.get(selector).then(($input) => {
            expect($input[0].validity.valueMissing).to.be.true;

        })
    }


}

export default new LoginPage();

