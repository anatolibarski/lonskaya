import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('SkySubscription e2e test', () => {

    let navBarPage: NavBarPage;
    let skySubscriptionDialogPage: SkySubscriptionDialogPage;
    let skySubscriptionComponentsPage: SkySubscriptionComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load SkySubscriptions', () => {
        navBarPage.goToEntity('sky-subscription');
        skySubscriptionComponentsPage = new SkySubscriptionComponentsPage();
        expect(skySubscriptionComponentsPage.getTitle())
            .toMatch(/lonskayaApp.skySubscription.home.title/);

    });

    it('should load create SkySubscription dialog', () => {
        skySubscriptionComponentsPage.clickOnCreateButton();
        skySubscriptionDialogPage = new SkySubscriptionDialogPage();
        expect(skySubscriptionDialogPage.getModalTitle())
            .toMatch(/lonskayaApp.skySubscription.home.createOrEditLabel/);
        skySubscriptionDialogPage.close();
    });

    it('should create and save SkySubscriptions', () => {
        skySubscriptionComponentsPage.clickOnCreateButton();
        skySubscriptionDialogPage.setDetailsJsonInput('detailsJson');
        expect(skySubscriptionDialogPage.getDetailsJsonInput()).toMatch('detailsJson');
        skySubscriptionDialogPage.ticketSelectLastOption();
        skySubscriptionDialogPage.userSelectLastOption();
        skySubscriptionDialogPage.save();
        expect(skySubscriptionDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SkySubscriptionComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-sky-subscription div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SkySubscriptionDialogPage {
    modalTitle = element(by.css('h4#mySkySubscriptionLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    detailsJsonInput = element(by.css('input#field_detailsJson'));
    ticketSelect = element(by.css('select#field_ticket'));
    userSelect = element(by.css('select#field_user'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

    setDetailsJsonInput = function(detailsJson) {
        this.detailsJsonInput.sendKeys(detailsJson);
    };

    getDetailsJsonInput = function() {
        return this.detailsJsonInput.getAttribute('value');
    };

    ticketSelectLastOption = function() {
        this.ticketSelect.all(by.tagName('option')).last().click();
    };

    ticketSelectOption = function(option) {
        this.ticketSelect.sendKeys(option);
    };

    getTicketSelect = function() {
        return this.ticketSelect;
    };

    getTicketSelectedOption = function() {
        return this.ticketSelect.element(by.css('option:checked')).getText();
    };

    userSelectLastOption = function() {
        this.userSelect.all(by.tagName('option')).last().click();
    };

    userSelectOption = function(option) {
        this.userSelect.sendKeys(option);
    };

    getUserSelect = function() {
        return this.userSelect;
    };

    getUserSelectedOption = function() {
        return this.userSelect.element(by.css('option:checked')).getText();
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
