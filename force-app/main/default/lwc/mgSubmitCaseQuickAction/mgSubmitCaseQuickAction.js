import { LightningElement, api } from 'lwc';
import submitCase from '@salesforce/apex/MGSubmitCaseController.submitCase';

export default class MgSubmitCaseQuickAction extends LightningElement {
    @api recordId;

    connectedCallback() {
        submitCase({ caseId : this.recordId });
    }
}