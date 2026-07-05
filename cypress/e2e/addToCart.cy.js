import homePage_PO from "../support/pageObjects/homePage_PO";
import productPage_PO from "../support/pageObjects/productsPage_PO";
import cartPage_PO from "../support/pageObjects/cartPage_PO";

describe ('Add Product to Cart', () =>{
    beforeEach(()=>{
        homePage_PO.visit();
        productPage_PO.visit();
    })


    it('Adds a product to the cart and verify it appears in the cart', () =>{
        cy.get('.single-products').first().find('.productinfo > p').invoke('text')
        .then((productName) =>{
            productPage_PO.addBlueTopToCart();
            productPage_PO.clickViewCart();

            //Assert the link is directed to Cart Page
            cy.url().should('include', '/view_cart');
            cartPage_PO.verifyProductInCart(productName.trim());
        })
    })

    it('Verify the quantity in the cart', () =>{
        cy.get('.single-products').first().find('.productinfo > p').invoke('text')
        .then((productName) =>{

            //Add the blue top shirt three times
            productPage_PO.addBlueTopToCart();
            productPage_PO.clickContinueShopping();
            productPage_PO.addBlueTopToCart();
            productPage_PO.clickContinueShopping();
            productPage_PO.addBlueTopToCart();
            productPage_PO.clickViewCart();

            cartPage_PO.verifyProductInCart(productName.trim());

            //Verify the amount added correctly in the cart
            cy.get('.cart_quantity > button').should('have.text', '3');

        })
    })

    it('Adds more than one product to cart and verify', () =>{
        productPage_PO.addProductsToCart(1);
        productPage_PO.clickContinueShopping();

        productPage_PO.addProductsToCart(3);
        productPage_PO.clickContinueShopping();

        productPage_PO.addProductsToCart(6);
        productPage_PO.clickContinueShopping();

        productPage_PO.addProductsToCart(14);
        productPage_PO.clickContinueShopping();
        productPage_PO.clickViewCart();
        cy.fixture('addedItems').then((addedItems) =>{
            cy.get('#cart_info_table > tbody > tr').should('have.length.at.least', 4);
            cy.get('#cart_info_table > tbody > tr').each(($row, index) =>{
                const item = addedItems[index];

                //Verfiy Name in Cart
                cy.wrap($row).find('.cart_description h4').should('have.text', item.name);
                cy.wrap($row).find('.cart_price p').should('have.text', item.price);
                cy.wrap($row).find('.cart_quantity button').should('have.text', item.quantity);
                cy.wrap($row).find('.cart_total_price').should('have.text', item.total);
            })
        })
    })

    it('Remove Products From Cart', ()=>{
        productPage_PO.addBlueTopToCart();
        productPage_PO.clickViewCart();
        cy.wait(500);

        //Delete the item
        cy.get('.cart_quantity_delete').click();

        //Assert the item has been deleted
        cy.get('.cart_description').should('not.exist');
        cy.get('#cart_info').contains('Cart is empty!');
        
    })
})