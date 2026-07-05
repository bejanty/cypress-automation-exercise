import homePage_PO from "../support/pageObjects/homePage_PO";
import loginPage_PO from "../support/pageObjects/loginPage_PO";
import productPage_PO from "../support/pageObjects/productsPage_PO";
import cartPage_PO from "../support/pageObjects/cartPage_PO";
import checkoutPage_PO from "../support/pageObjects/checkoutPage_PO";

describe('Checkout and Place Order', () =>{

    beforeEach(() =>{
        cy.clearCookies();
        
    })

    it('Assert that Register / Login message must pop up before Checkout', ()=>{
        homePage_PO.visit();
        productPage_PO.visit();

        productPage_PO.addBlueTopToCart();
        productPage_PO.clickViewCart();

        //Assert the link is redirected to Cart Page
        cy.url().should('include', '/view_cart');
        cartPage_PO.proceedToCheckout();

        //Check the pop up message after clicking checkout
        cy.get('.modal-title').should('have.text', 'Checkout');
        cy.get('.modal-body > p').first().should('have.text', 'Register / Login account to proceed on checkout.');
        cy.get('.modal-body a').should('have.attr','href', '/login');
        cy.get('.modal-body a').click({force:true});
        cy.wait(500)
        cy.url().should('include', '/login');
        
    })

    it('Login Account before Checkout', ()=> {
        cy.fixture('payment').then((payment) =>{
            cy.fixture('validCredential').then((user) =>{
                homePage_PO.visit();
                homePage_PO.goToLogin();
                cy.wait(500);
                loginPage_PO.enterLoginEmail(user.email);
                loginPage_PO.enterLoginPassword(user.password);
                loginPage_PO.clickLogin();
                cy.wait(200);

                //Check the login status exists
                cy.contains('Logged in as').should('be.visible');
                
                //Capture product details
                productPage_PO.visit();
                cy.get('.single-products').first().find('.productinfo > p').invoke('text').then(name =>{
                    cy.get('.single-products').first().find('.productinfo > h2').invoke('text').then(price =>{
                
                        productPage_PO.addBlueTopToCart();
                        productPage_PO.clickViewCart();

                        //Go to Cart Page and proceed checkout
                        cartPage_PO.visit();
                        cartPage_PO.proceedToCheckout();

                        cy.url().should('include', '/checkout');
                        //Verify the delivery address and billing address
                        checkoutPage_PO.verifyAddress('address_delivery', user);
                        checkoutPage_PO.verifyAddress('address_invoice', user);

                        //Review the order details
                        checkoutPage_PO.verifyOrder({
                            description: name.trim(),
                            price: price.trim(),
                            quantity: "1",
                            total: price.trim(),
                            orderTotal: price.trim()
                        })
                    })
                })
                    
            
            //Leave a comment
            checkoutPage_PO.addComment("Deliver to a safe place when no one answers the door.");

            cy.get('.check_out').click(); //Click 'Place Order'

            //Assert it is directed to Payment Page
            cy.url().should('contain', '/payment');
            cy.get('h2.heading').should('have.text', 'Payment');

            checkoutPage_PO.fillPaymentDetails(payment);

            cy.get('#submit').click();

            //Check if the order is placed
            cy.get("h2[data-qa='order-placed']").should('have.text', 'Order Placed!');
            cy.contains('Congratulations! Your order has been confirmed!');

            //Click Download Invoice
            cy.get('.check_out').should('have.attr', 'href', '/download_invoice/500');
            cy.get('.check_out').click();
            //Verify it is downloaded in folder
            cy.readFile('cypress/downloads/invoice.txt').should('exist');

            //Logout for Exit
            homePage_PO.logout();
            })
        })

    })

    it('Register while Checkout and Place Order', ()=>{
        cy.fixture('payment2').then((payment) =>{
            cy.fixture("newUser2").then((user) =>{
                const newEmail = `test.${Math.floor(Math.random()*100)+1}@mail.com`;

                homePage_PO.visit();
                productPage_PO.visit();
        
                productPage_PO.addBlueTopToCart();
                productPage_PO.clickViewCart();
        
                //Assert the link is redirected to Cart Page
                cy.url().should('include', '/view_cart');
                cartPage_PO.proceedToCheckout();
                cy.get('.modal-body a').click({force:true});
                cy.wait(500)

                //Assert the link is redirected to Login Page
                cy.url().should('include', '/login');

                loginPage_PO.enterSignUpName(user.name);
                loginPage_PO.enterSignUpEmail(newEmail);

                cy.get('[data-qa="signup-button"]').click();
                cy.wait(500);

                //Verify the page and inputs
                cy.get('h2.title').should('contain.text', 'Enter Account Information');
                cy.get('[data-qa="name"]').should('have.value', user.name); //Name Input from previous signup page
                cy.get('[data-qa="email"]').should('have.value', newEmail); //Email Input from previous signup page

                loginPage_PO.fillAccountInformation(user);

                loginPage_PO.clickCreateAccount();

                //Suceessful Screen
                cy.get('h2.title').should('contain.text', 'Account Created!');
                cy.get('[data-qa="continue-button"]').click();

                //Check the login status 
                cy.contains('Logged in as').should('be.visible');

                //Capture product details
                productPage_PO.visit();
                cy.get('.single-products').first().find('.productinfo > p').invoke('text').then(name =>{
                    cy.get('.single-products').first().find('.productinfo > h2').invoke('text').then(price =>{
                
                        productPage_PO.clickViewCart();

                        //Go to Cart Page and proceed checkout
                        cartPage_PO.visit();
                        cartPage_PO.proceedToCheckout();

                        cy.url().should('include', '/checkout');
                        //Verify the delivery address and billing address
                        checkoutPage_PO.verifyAddress('address_delivery', user);
                        checkoutPage_PO.verifyAddress('address_invoice', user);

                        //Review the order details
                        checkoutPage_PO.verifyOrder({
                            description: name.trim(),
                            price: price.trim(),
                            quantity: "1",
                            total: price.trim(),
                            orderTotal: price.trim()
                        })
                    })
                })
                    
            //Leave a comment
            checkoutPage_PO.addComment("Deliver to reception.");

            cy.get('.check_out').click(); //Click 'Place Order'

            //Assert it is directed to Payment Page
            cy.url().should('contain', '/payment');
            cy.get('h2.heading').should('have.text', 'Payment');

            checkoutPage_PO.fillPaymentDetails(payment);

            cy.get('#submit').click();

            //Check if the order is placed
            cy.get("h2[data-qa='order-placed']").should('have.text', 'Order Placed!');
            cy.contains('Congratulations! Your order has been confirmed!');

            //Click Download Invoice
            cy.get('.check_out').should('have.attr', 'href', '/download_invoice/500');
            cy.get('.check_out').click();
            //Verify it is downloaded in folder
            cy.readFile('cypress/downloads/invoice.txt').should('exist');

            //Logout for Exit
            homePage_PO.logout();

            }) 
        })
    })


})