class CartPage{
    visit(){
        cy.visit('/view_cart');
    }

    proceedToCheckout(){
        cy.get('.check_out').click();
    }

    verifyProductInCart(productName) {
        cy.get('.cart_description > h4').should('have.text', productName);
    }

    clearCart(){
        cy.wait(200);
        cy.get('.cart_quantity_delete').click();     

    }
}

export default new CartPage();