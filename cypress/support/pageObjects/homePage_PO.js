class HomePage {
    visit() {
        cy.visit('/');
    }

    goToLogin(){
        cy.get('a[href="/login"]').click();

    }

    goToProducts(){
        cy.get('a[href="/products"]').click();
    }

    goToCart(){
        cy.get('a[href=("/Cart")]').click();
    }

    logout(){
        cy.get('a[href="/logout"]').click();
    }
}

export default new HomePage();