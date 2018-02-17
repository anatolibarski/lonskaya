import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('PaymentDetails e2e test', () => {

    let navBarPage: NavBarPage;
    let paymentDetailsDialogPage: PaymentDetailsDialogPage;
    let paymentDetailsComponentsPage: PaymentDetailsComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load PaymentDetails', () => {
        navBarPage.goToEntity('payment-details');
        paymentDetailsComponentsPage = new PaymentDetailsComponentsPage();
        expect(paymentDetailsComponentsPage.getTitle())
            .toMatch(/lonskayaApp.paymentDetails.home.title/);

    });

    it('should load create PaymentDetails dialog', () => {
        paymentDetailsComponentsPage.clickOnCreateButton();
        paymentDetailsDialogPage = new PaymentDetailsDialogPage();
        expect(paymentDetailsDialogPage.getModalTitle())
            .toMatch(/lonskayaApp.paymentDetails.home.createOrEditLabel/);
        paymentDetailsDialogPage.close();
    });

    it('should create and save PaymentDetails', () => {
        paymentDetailsComponentsPage.clickOnCreateButton();
        paymentDetailsDialogPage.setInvoiceUrlInput('invoiceUrl');
        expect(paymentDetailsDialogPage.getInvoiceUrlInput()).toMatch('invoiceUrl');
        paymentDetailsDialogPage.setPaymentMethodInput('paymentMethod');
        expect(paymentDetailsDialogPage.getPaymentMethodInput()).toMatch('paymentMethod');
        paymentDetailsDialogPage.setDetailsJsonInput('detailsJson');
        expect(paymentDetailsDialogPage.getDetailsJsonInput()).toMatch('detailsJson');
        paymentDetailsDialogPage.save();
        expect(paymentDetailsDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class PaymentDetailsComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-payment-details div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class PaymentDetailsDialogPage {
    modalTitle = element(by.css('h4#myPaymentDetailsLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    invoiceUrlInput = element(by.css('input#field_invoiceUrl'));
    paymentMethodInput = element(by.css('input#field_paymentMethod'));
    detailsJsonInput = element(by.css('input#field_detailsJson'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setInvoiceUrlInput = function(invoiceUrl) {
        this.invoiceUrlInput.sendKeys(invoiceUrl);
    };

    getInvoiceUrlInput = function() {
        return this.invoiceUrlInput.getAttribute('value');
    };

    setPaymentMethodInput = function(paymentMethod) {
        this.paymentMethodInput.sendKeys(paymentMethod);
    };

    getPaymentMethodInput = function() {
        return this.paymentMethodInput.getAttribute('value');
    };

    setDetailsJsonInput = function(detailsJson) {
        this.detailsJsonInput.sendKeys(detailsJson);
    };

    getDetailsJsonInput = function() {
        return this.detailsJsonInput.getAttribute('value');
    };

    save() {
        this.saveButton.click();
    }

    close() {
        this.closeButton.click();
    }

    getSaveButton() {
        return this.saveButton;
    }
}
