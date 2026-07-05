class CheckoutPage{

    verifyAddress(section, user){
        cy.get(`#${section} li.address_firstname.address_lastname`).should('contain', user.name);
        cy.get(`#${section} li.address_address1.address_address2`).eq(1).should('contain', user.address1);
        cy.get(`#${section} li.address_address1.address_address2`).eq(2).should('contain', user.address2);
        cy.get(`#${section} li.address_city.address_state_name.address_postcode`).should('contain', user.city);
        cy.get(`#${section} li.address_city.address_state_name.address_postcode`).should('contain', user.state);
        cy.get(`#${section} li.address_city.address_state_name.address_postcode`).should('contain', user.zipcode);
        cy.get(`#${section} li.address_country_name`).should('contain', user.country );
        cy.get(`#${section} li.address_phone`).should('contain', user.mobileNumber );
    }

    verifyOrder({description, price, quantity, total, orderTotal}) {
            if (description) cy.get('.cart_description h4 a').first().should('contain', description);
            if (price) cy.get('.cart_price p').first().should('contain', price);
            if (quantity) cy.get('.cart_quantity button').first().should('contain', quantity);
            if (total) cy.get('.cart_total p').first().should('contain', total);
            if (orderTotal) cy.get('.cart_total_price').last().should('contain', total);
    
    }
    addComment(comment){
        cy.get("textarea[name='message']").type(comment);
    
    }

    fillPaymentDetails(payment){
        cy.get("input[name='name_on_card']").type(payment.cardName);
        cy.get("input[data-qa='card-number']").type(payment.cardNumber);
        cy.get("input[name='cvc']").type(payment.cvc);
        cy.get("input[data-qa='expiry-month']").type(payment.expiryMonth);
        cy.get("input[data-qa='expiry-year']").type(payment.expiryYear);

    }

}

export default new CheckoutPage();