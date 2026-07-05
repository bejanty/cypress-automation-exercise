class ProductsPage {
    visit(){
        cy.visit('/products');
    }

    addBlueTopToCart(){
        cy.get('.single-products').first().trigger('mouseover');
        cy.get('.single-products').first().find('.add-to-cart').first().click({force: true});
        cy.wait(500)
    }

    clickContinueShopping(){
        cy.get('.btn-success').click({force: true});
    }

    clickViewCart() {
        cy.get('.modal-content').contains('View Cart').click({force: true});
    }

    addProductsToCart(index){
        cy.get('.single-products').eq(index).trigger('mouseover');
        cy.get('.single-products').eq(index).find('.add-to-cart').first().click({force: true});
        cy.wait(500)    
    }

}

export default new ProductsPage();