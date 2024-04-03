import { LightningElement, api, wire } from 'lwc';
import { getRecord } from "lightning/uiRecordApi";
import toast from 'lightning/toast';
import { NavigationMixin } from "lightning/navigation";
import submitCase from '@salesforce/apex/MGSubmitCaseController.submitCase';

export default class MrCasePage extends NavigationMixin(LightningElement) {
    @api recordId;
    @api mode = 'view';
    isLoading = false;
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
    get canEdit() {
        return this.ourCase?.data?.fields.Status.value == 'Draft';
    }

    editClick() {
        this.mode = 'edit';
    }

    submitClick() {
        this.isLoading = true;
        submitCase({ caseId : this.recordId })
            .then(() => {
                toast.show({
                    label: 'Case submitted',
                    variant: 'success'
                }, this);

                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'My_open_cases__c' // TODO: move to attribute
                    }
                });
            })
            .catch(err => {
                console.log(err);
                toast.show({
                    label: 'Error',
                    message: err.body?.message,
                    variant: 'error'
                }, this);
            })
            .finally(() => { 
                this.isLoading = false; 
            });
    }

    formLoad(evt) {
        console.log('form load');
    }
}