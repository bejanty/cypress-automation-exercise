import homePage_PO from '../support/pageObjects/homePage_PO';
import loginPage_PO from '../support/pageObjects/loginPage_PO';

describe("User Sign Up",() => {

    beforeEach(() =>{
        cy.clearCookies();
        cy.clearLocalStorage();
        cy.wait(500);
        cy.visit('/');

    })

    it('New User Sign Up Sucessfully', () => {
        cy.fixture("newUser").then((user) =>{
            const email = `test.${Math.floor(Math.random()*100)+1}@mail.com`;

            homePage_PO.goToLogin();
            cy.wait(1000);
            loginPage_PO.enterSignUpName(user.name);
            loginPage_PO.enterSignUpEmail(email);

            cy.get('[data-qa="signup-button"]').click();
            cy.wait(1000);

            //Verify the page and inputs
            cy.get('h2.title').should('contain.text', 'Enter Account Information');
            cy.get('[data-qa="name"]').should('have.value', user.name); //Name Input from previous signup page
            cy.get('[data-qa="email"]').should('have.value', email); //Email Input from previous signup page

            loginPage_PO.fillAccountInformation(user);

            loginPage_PO.clickCreateAccount();

            //Suceessful Screen
            cy.get('h2.title').should('contain.text', 'Account Created!');
            cy.get('[data-qa="continue-button"]').click();

            //Check the login status and Assert that Logout Button exist
            cy.contains('Logged in as').should('be.visible');
            cy.get('a[href="/logout"]').should('be.exist');
        }) 
    })

    it('New User Sign Up Using Incorrect Email Format', () => {
        cy.fixture("newUser").then((user) =>{
            homePage_PO.goToLogin();
            cy.wait(1000);
            loginPage_PO.enterSignUpName(user.name);
            loginPage_PO.enterSignUpEmail("testError.com");

            cy.get('[data-qa="signup-button"]').click();
            cy.wait(1000);

            //Check if the error message shows
            loginPage_PO.getSignupEmailErrorMessage();
        })
    })

    it('Required field - Check the error on the password field', () => {
        cy.fixture("newUser").then((user) =>{
            const email = `test.${Math.floor(Math.random()*100)+1}@mail.com`;
            homePage_PO.goToLogin();
            cy.wait(1000);
            loginPage_PO.enterSignUpName(user.name);
            loginPage_PO.enterSignUpEmail(email);

            cy.get('[data-qa="signup-button"]').click();

            loginPage_PO.clickCreateAccount(); //Submit
            cy.wait(1000);

            //Check if the error message shows
            loginPage_PO.assertRequiredFieldErrorMessage('[data-qa="password"]');
        })
    })

    //Check other required fields
    const requiredFields = [
        {name: 'First name', selector: '#first_name'},
        {name: 'Last name', selector: '#last_name'},
        {name: 'Address', selector: '#address1'},
        {name: 'State', selector: '#state'},
        {name: 'City', selector: '#city'},
        {name: 'Zipcode', selector: '#zipcode'},
        {name: 'Mobile Number', selector: '#mobile_number'}
    ]

    requiredFields.forEach(({name,selector}) =>{
        it(`Required field - Check the error on the ${name} field`, () => {
            cy.fixture("newUser").then((user) =>{
                const email = `testRequired.${Math.floor(Math.random()*100000000)+1}@mail.com`;
                homePage_PO.goToLogin();
                cy.wait(500);
                loginPage_PO.enterSignUpName(user.name);
                loginPage_PO.enterSignUpEmail(email);
    
                cy.get('[data-qa="signup-button"]').click();
                cy.wait(500);

                loginPage_PO.fillAccountInformation(user);
                cy.get(selector).clear();
                loginPage_PO.clickCreateAccount(); //Submit
                cy.wait(100);
    
                //Check if the error message shows
                loginPage_PO.assertRequiredFieldErrorMessage(selector);
            })
        })
    })

    it('Register User with existing email', () =>{
        cy.fixture('validCredential').then((user) =>{
            homePage_PO.visit();
            homePage_PO.goToLogin();
            cy.wait(500);
            loginPage_PO.enterSignUpName("Janet");
            loginPage_PO.enterSignUpEmail(user.email);

            cy.get('[data-qa="signup-button"]').click();

            //Check the error message
            cy.get('.signup-form > form > p').should('have.text', 'Email Address already exist!');
        })
    })

})