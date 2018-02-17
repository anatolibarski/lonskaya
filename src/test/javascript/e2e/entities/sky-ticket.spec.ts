import { browser, element, by } from 'protractor';
import { NavBarPage } from './../page-objects/jhi-page-objects';

describe('SkyTicket e2e test', () => {

    let navBarPage: NavBarPage;
    let skyTicketDialogPage: SkyTicketDialogPage;
    let skyTicketComponentsPage: SkyTicketComponentsPage;

    beforeAll(() => {
        browser.get('/');
        browser.waitForAngular();
        navBarPage = new NavBarPage();
        navBarPage.getSignInPage().autoSignInUsing('admin', 'admin');
        browser.waitForAngular();
    });

    it('should load SkyTickets', () => {
        navBarPage.goToEntity('sky-ticket');
        skyTicketComponentsPage = new SkyTicketComponentsPage();
        expect(skyTicketComponentsPage.getTitle())
            .toMatch(/lonskayaApp.skyTicket.home.title/);

    });

    it('should load create SkyTicket dialog', () => {
        skyTicketComponentsPage.clickOnCreateButton();
        skyTicketDialogPage = new SkyTicketDialogPage();
        expect(skyTicketDialogPage.getModalTitle())
            .toMatch(/lonskayaApp.skyTicket.home.createOrEditLabel/);
        skyTicketDialogPage.close();
    });

    it('should create and save SkyTickets', () => {
        skyTicketComponentsPage.clickOnCreateButton();
        skyTicketDialogPage.setDetailsJsonInput('detailsJson');
        expect(skyTicketDialogPage.getDetailsJsonInput()).toMatch('detailsJson');
        skyTicketDialogPage.save();
        expect(skyTicketDialogPage.getSaveButton().isPresent()).toBeFalsy();
    });

    afterAll(() => {
        navBarPage.autoSignOut();
    });
});

export class SkyTicketComponentsPage {
    createButton = element(by.css('.jh-create-entity'));
    title = element.all(by.css('jhi-sky-ticket div h2 span')).first();

    clickOnCreateButton() {
        return this.createButton.click();
    }

    getTitle() {
        return this.title.getAttribute('jhiTranslate');
    }
}

export class SkyTicketDialogPage {
    modalTitle = element(by.css('h4#mySkyTicketLabel'));
    saveButton = element(by.css('.modal-footer .btn.btn-primary'));
    closeButton = element(by.css('button.close'));
    detailsJsonInput = element(by.css('input#field_detailsJson'));

    getModalTitle() {
        return this.modalTitle.getAttribute('jhiTranslate');
    }

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
