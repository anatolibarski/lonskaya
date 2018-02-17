import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('SalesforceContact e2e test', () => {

    let navBarPage: NavBarPage;
    let salesforceContactDialogPage: SalesforceContactDialogPage;
    let salesforceContactComponentsPage: SalesforceContactComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load SalesforceContacts', () => {
        navBarPage.goToEntity('salesforce-contact');
        salesforceContactComponentsPage = new SalesforceContactComponentsPage();
        expect(salesforceContactComponentsPage.getTitle())
            .toMatch(/lonskayaApp.salesforceContact.home.title/);

    });

    it('should load create SalesforceContact dialog', () => {
        salesforceContactComponentsPage.clickOnCreateButton();
        salesforceContactDialogPage = new SalesforceContactDialogPage();
        expect(salesforceContactDialogPage.getModalTitle())
            .toMatch(/lonskayaApp.salesforceContact.home.createOrEditLabel/);
        salesforceContactDialogPage.close();
    });

    it('should create and save SalesforceContacts', () => {
        salesforceContactComponentsPage.clickOnCreateButton();
        salesforceContactDialogPage.setNameInput('name');
        expect(salesforceContactDialogPage.getNameInput()).toMatch('name');
        salesforceContactDialogPage.save();
        expect(salesforceContactDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SalesforceContactComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-salesforce-contact div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SalesforceContactDialogPage {
    modalTitle = element(by.css('h4#mySalesforceContactLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    nameInput = element(by.css('input#field_name'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setNameInput = function(name) {
        this.nameInput.sendKeys(name);
    };

    getNameInput = function() {
        return this.nameInput.getAttribute('value');
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
