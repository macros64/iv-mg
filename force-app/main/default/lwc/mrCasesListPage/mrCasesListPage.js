import { LightningElement } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

import getCases from '@salesforce/apex/MGCasePageController.getCases';

export default class MrCasesListPage extends NavigationMixin(LightningElement) {
    isLoading = false;
    cases = [];
    columns = [
        { 
            label: 'Case Number', fieldName: 'ExperienceUrl__c', type: 'url',
            typeAttributes: { label: { fieldName: 'CaseNumber' } }
        },
        { label: 'Case Subject', fieldName: 'Subject', type: 'text' },
        { label: 'Created', fieldName: 'CreatedDate', type: 'date' },
        { label: 'Status', fieldName: 'Status', type: 'text' },
        { label: 'Region', fieldName: 'Region__c', type: 'text' },
        { label: 'Place', fieldName: 'Manufacture__c', type: 'text' }
    ];

    connectedCallback() {
        this.isLoading = true;
        getCases()
        .then(res => {
            this.cases = res;
        })
        .catch(err => { console.log(err); })
        .finally(() => {
            this.isLoading = false;
        });
    }

    newCase() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'New_Case__c' // TODO: move to attribute
            }
        });
    }
}