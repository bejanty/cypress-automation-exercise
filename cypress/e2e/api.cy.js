import homePage_PO from '../support/pageObjects/homePage_PO';
import loginPage_PO from '../support/pageObjects/loginPage_PO';

describe('API Testing', () =>{

    before(() =>{
        cy.visit('/');
    })

    it('API Test Account Sign Up', () => {
        cy.fixture("apiUser").then((user) =>{
            homePage_PO.goToLogin();
            cy.wait(500);
            loginPage_PO.enterSignUpName(user.name);
            loginPage_PO.enterSignUpEmail(user.email);

            cy.get('[data-qa="signup-button"]').click();
            cy.wait(500);

            loginPage_PO.fillAccountInformation(user);

            loginPage_PO.clickCreateAccount();

            //Suceessful Screen
            cy.get('h2.title').should('contain.text', 'Account Created!');
            cy.get('[data-qa="continue-button"]').click();

            //Check the login status and Assert that Logout Button exist
            cy.contains('Logged in as').should('be.visible');
            cy.get('a[href="/logout"]').should('be.exist').click();
        }) 
    })

    it('POST To Verify Login with valid details', () =>{
        cy.fixture("apiUser").then((user) =>{
            //Debugging undefined problem from response body
            const responseMessage = (body) =>
                typeof body === 'string' ? JSON.parse(body): body;

            cy.request({
                method: 'POST',
                url: '/api/verifyLogin',
                form: true,
                body: {
                    email: user.email,
                    password: user.password
                }
            }).then((response) => {
                const body = responseMessage(response.body);
                //cy.log(JSON.stringify(body));

                expect(body.responseCode).to.eq(200);
                expect(body.message).to.eq('User exists!');
            })
        })
    })

    it('POST To Verify Login with invalid details', () =>{
        cy.clearCookies();

        cy.fixture("apiUser").then((user) =>{
            const responseMessage = (body) =>
            typeof body === 'string' ? JSON.parse(body): body;

            cy.request({
                method: 'POST',
                url: '/api/verifyLogin',
                form: true,
                body: {
                    email: user.email,
                    password: "WrongPassword!"
                },
                failOnStatusCode: false,
            }).
            then((response) => {
                const body = responseMessage(response.body);
                expect(response.status).to.eq(200);
                expect(body.responseCode).to.eq(404);
                expect(body.message).to.eq('User not found!');
            })
        })
    })

    it('GET user account detail by email', () =>{
        cy.fixture("apiUser").then((user) =>{
            const responseMessage = (body) =>
            typeof body === 'string' ? JSON.parse(body): body;

            cy.request({
                method: 'GET',
                url: '/api/getUserDetailByEmail',
                qs: {
                    email: user.email
                },
            })
            .then((response) => {
                const body = responseMessage(response.body);
                expect(response.status).to.eq(200);
                expect(body.responseCode).to.eq(200);
                expect(body.user.email).to.eq(user.email);
                expect(body.user.name).to.eq(user.name);
            })
        })
    })

    it('PUT METHOD To Update User Account', () =>{
        cy.fixture("apiUser").then((user) =>{
            const responseMessage = (body) =>
            typeof body === 'string' ? JSON.parse(body): body;

            cy.request({
                method: 'PUT',
                url: '/api/updateAccount',
                form: true,
                body: {
                      name: user.name,
                      email: user.email,
                      password: user.password,
                      title: 'Mrs',
                      birth_date: user.dayDOB,
                      birth_month: user.monthDOB,
                      birth_year: user.yearDOB,
                      address1: 'Updated Street',
                      address2: user.address2,
                      country: user.country,
                      state: user.state,
                      city: 'New City',
                      zipcode: user.zipcode,
                      mobile_number: user.mobileNumber
                },
            }).then((response) => {
                const body = responseMessage(response.body);
                expect(response.status).to.eq(200);
                expect(body.responseCode).to.eq(200);
                expect(body.message).to.eq('User updated!');
            })
        })
    })

    after(()=>{
        //DELETE METHOD To Delete User Account
        cy.fixture("apiUser").then((user) =>{
            const responseMessage = (body) =>
            typeof body === 'string' ? JSON.parse(body): body;

            cy.request({
                method: 'DELETE',
                url: '/api/deleteAccount',
                form:true,
                body:{
                    email: user.email,
                    password: user.password,

                },

            }).then((response) =>{
                const body = responseMessage(response.body);
                expect(response.status).to.eq(200);
                expect(body.responseCode).to.eq(200);
                expect(body.message).to.eq('Account deleted!');
            })
        })
    })


})