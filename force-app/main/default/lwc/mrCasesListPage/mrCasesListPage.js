import { LightningElement } from 'lwc';
import getCases from '@salesforce/apex/MGCasePageController.getCases';

export default class MrCasesListPage extends LightningElement {
    isLoading = false;
    cases = [];
    columns = ['Subject', 'CreatedDate', 'Region__c', 'Manufacture__c'];

    connectedCallback() {
        this.isLoading = true;
        getCases()
        .then(res => {
            this.cases = res;
        })
        .catch(err => { console.log(err); })
        .fially(() => {
            this.isLoading = false;
        })
    }
}