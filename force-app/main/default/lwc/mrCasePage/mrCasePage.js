import { LightningElement, api, wire } from 'lwc';
import { getRecord } from "lightning/uiRecordApi";
import submitCase from '@salesforce/apex/MGSubmitCaseController.submitCase';

export default class MrCasePage extends LightningElement {
    @api recordId;
    @api mode = 'view';
    fields = ['Region__c', 'Manufacture__c', 'Inspection_Types__c', 'Desired_inspection_start__c', 'InspectionAddress__c'];

    get viewMode() {
        return this.mode == 'view';
    }

    get headerText() {
        return 'Case ' + this.caseNumber + ' - ' + this.caseSubject;
    }

    @wire(getRecord, { recordId: '$recordId', fields: ['Case.CaseNumber', 'Case.Subject', 'Case.Status'] })
    ourCase;


    get caseNumber() {
        return this.ourCase?.data?.fields.CaseNumber.value;
    }
    get caseSubject() {
        return this.ourCase?.data?.fields.Subject.value;
    }

    get canSubmit() {
        return this.ourCase?.data?.fields.Status.value == 'Draft';
    }

    editClick() {
        this.mode = 'edit';
    }

    submitClick() {
        submitCase({ caseId : this.recordId });
    }
}