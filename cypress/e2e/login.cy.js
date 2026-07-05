import homePage_PO from "../support/pageObjects/homePage_PO";
import loginPage_PO from "../support/pageObjects/loginPage_PO";

describe ('User Login', () =>{

    it('Login with Valid Credentials', () =>{
        
        cy.fixture('validCredential').then((user) =>{
            homePage_PO.visit();
            homePage_PO.goToLogin();
            cy.wait(500);
            //Fill Login details
            loginPage_PO.enterLoginEmail(user.email);
            loginPage_PO.enterLoginPassword(user.password);
            loginPage_PO.clickLogin();
            cy.wait(1000);

            //Check if the login status exists
            cy.contains('Logged in as').should('be.visible');
        })
    })

    it('Login with Invalid Email Address', () =>{
        cy.fixture('invalidEmail').then((user) =>{
            homePage_PO.visit();
            homePage_PO.goToLogin();
            cy.wait(500);
            //Fill Login details
            loginPage_PO.enterLoginEmail(user.loginEmail);
            loginPage_PO.enterLoginPassword(user.loginPassword);
            loginPage_PO.clickLogin();
            cy.wait(1000);

            //Check if the error message shows correctly
            cy.get('form > p').eq(0).should('have.text', 'Your email or password is incorrect!')
            
        })
    })

    it('Login with Invalid Password', () =>{
        cy.fixture('invalidPassword').then((user) =>{
            homePage_PO.visit();
            homePage_PO.goToLogin();
            cy.wait(500);
             //Fill Login details           
            loginPage_PO.enterLoginEmail("test.88@mail.com");
            loginPage_PO.enterLoginPassword(user.password);
            loginPage_PO.clickLogin();
            cy.wait(1000);

            //Check if the error message shows correctly
            cy.get('form > p').eq(0).should('have.text', 'Your email or password is incorrect!')
            
        })
    })

    it('Logout User', ()=>{

        cy.fixture('validCredential').then((user) =>{
            homePage_PO.visit();
            homePage_PO.goToLogin();
            cy.wait(500);
            loginPage_PO.enterLoginEmail(user.email);
            loginPage_PO.enterLoginPassword(user.password);
            loginPage_PO.clickLogin();
            cy.wait(500);

            //Assert that Logout Button exist
            cy.get('a[href="/logout"]').should('be.exist');
            cy.get('a[href="/logout"]').click();

            //Assert the is redirected to login page
            cy.url().should('include','/login');

        })

    })

})