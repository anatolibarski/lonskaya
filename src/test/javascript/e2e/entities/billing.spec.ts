import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('Billing e2e test', () => {

    let navBarPage: NavBarPage;
    let billingDialogPage: BillingDialogPage;
    let billingComponentsPage: BillingComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load Billings', () => {
        navBarPage.goToEntity('billing');
        billingComponentsPage = new BillingComponentsPage();
        expect(billingComponentsPage.getTitle())
            .toMatch(/lonskayaApp.billing.home.title/);

    });

    it('should load create Billing dialog', () => {
        billingComponentsPage.clickOnCreateButton();
        billingDialogPage = new BillingDialogPage();
        expect(billingDialogPage.getModalTitle())
            .toMatch(/lonskayaApp.billing.home.createOrEditLabel/);
        billingDialogPage.close();
    });

    it('should create and save Billings', () => {
        billingComponentsPage.clickOnCreateButton();
        billingDialogPage.setAmountInput('5');
        expect(billingDialogPage.getAmountInput()).toMatch('5');
        billingDialogPage.setCurrencyInput('currency');
        expect(billingDialogPage.getCurrencyInput()).toMatch('currency');
        billingDialogPage.setDueDateInput('2000-12-31');
        expect(billingDialogPage.getDueDateInput()).toMatch('2000-12-31');
        billingDialogPage.getClosedInput().isSelected().then((selected) => {
            if (selected) {
                billingDialogPage.getClosedInput().click();
                expect(billingDialogPage.getClosedInput().isSelected()).toBeFalsy();
            } else {
                billingDialogPage.getClosedInput().click();
                expect(billingDialogPage.getClosedInput().isSelected()).toBeTruthy();
            }
        });
        billingDialogPage.detailsSelectLastOption();
        billingDialogPage.skySubscriptionSelectLastOption();
        billingDialogPage.save();
        expect(billingDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class BillingComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-billing div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class BillingDialogPage {
    modalTitle = element(by.css('h4#myBillingLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    amountInput = element(by.css('input#field_amount'));
    currencyInput = element(by.css('input#field_currency'));
    dueDateInput = element(by.css('input#field_dueDate'));
    closedInput = element(by.css('input#field_closed'));
    detailsSelect = element(by.css('select#field_details'));
    skySubscriptionSelect = element(by.css('select#field_skySubscription'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setAmountInput = function(amount) {
        this.amountInput.sendKeys(amount);
    };

    getAmountInput = function() {
        return this.amountInput.getAttribute('value');
    };

    setCurrencyInput = function(currency) {
        this.currencyInput.sendKeys(currency);
    };

    getCurrencyInput = function() {
        return this.currencyInput.getAttribute('value');
    };

    setDueDateInput = function(dueDate) {
        this.dueDateInput.sendKeys(dueDate);
    };

    getDueDateInput = function() {
        return this.dueDateInput.getAttribute('value');
    };

    getClosedInput = function() {
        return this.closedInput;
    };
    detailsSelectLastOption = function() {
        this.detailsSelect.all(by.tagName('option')).last().click();
    };

    detailsSelectOption = function(option) {
        this.detailsSelect.sendKeys(option);
    };

    getDetailsSelect = function() {
        return this.detailsSelect;
    };

    getDetailsSelectedOption = function() {
        return this.detailsSelect.element(by.css('option:checked')).getText();
    };

    skySubscriptionSelectLastOption = function() {
        this.skySubscriptionSelect.all(by.tagName('option')).last().click();
    };

    skySubscriptionSelectOption = function(option) {
        this.skySubscriptionSelect.sendKeys(option);
    };

    getSkySubscriptionSelect = function() {
        return this.skySubscriptionSelect;
    };

    getSkySubscriptionSelectedOption = function() {
        return this.skySubscriptionSelect.element(by.css('option:checked')).getText();
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
