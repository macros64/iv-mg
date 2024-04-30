import { LightningElement, track } from 'lwc';
import { NavigationMixin } from "lightning/navigation";

import getCases from '@salesforce/apex/MGCasePageController.getCases';

export default class MrCasesListPage extends NavigationMixin(LightningElement) {
    isLoading = false;
    cases = [];
    columns = [
        { 
            label: 'Case Number', fieldName: 'ExperienceUrl__c', type: 'url', sortable: true, name: 'CaseNumber',
            typeAttributes: { label: { fieldName: 'CaseNumber' } }
        },
        { label: 'Case Name', fieldName: 'CaseName__c', type: 'text' },
        { label: 'Created', fieldName: 'CreatedDate', type: 'date', sortable: true, name: 'CreatedDate' },
        { label: 'Insp. Date', fieldName: 'Desired_inspection_start__c', type: 'date', sortable: true, name: 'Desired_inspection_start__c' },
        { 
            label: 'Status', fieldName: 'Status', type: 'text', hideDefaultActions: true, sortable: true, name: 'Status',
            actions: [
                { label: 'Active', checked: true, name: 'activeCases' },
                { label: 'All', checked: false, name: 'allCases' },
            ],
            cellAttributes: { iconName: { fieldName: 'StatusIconLWC__c' } }
        }/*,
        { label: 'Region', fieldName: 'Region__c', type: 'text' },
        { label: 'Place', fieldName: 'Manufacture__c', type: 'text' }*/
    ];

    sortDir = 'desc';
    sortedBy = 'CaseNumber';

    activeStats = ['Draft', 'Submitted', 'Approved', 'Working', 'Escalated', 'Completed'];

    connectedCallback() {
        this.refreshCases(this.activeStats);
        this.sortCases();
    }

    newCase() {
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'New_Case__c' // TODO: move to attribute
            }
        });
    }

    refreshCases(stats) {
        this.isLoading = true;
        this.cases = [];
        getCases({ statuses: stats })
            .then(res => {
                this.cases = res;
            })
            .catch(err => { console.log(err); })
            .finally(() => {
                this.isLoading = false;
            });
    }

    sortCases() {
        const column = this.columns.find(i => i.fieldName === this.sortedBy);

        let cs = JSON.parse(JSON.stringify(this.cases)); // quite stupid but it doesn't work wthout new object
        cs.sort((a, b) => {
            const valA = column.type === 'date' ? new Date(a[this.sortedBy]) : a[this.sortedBy];
            const valB = column.type === 'date' ? new Date(b[this.sortedBy]) : b[this.sortedBy];
            if(valA == valB) return 0;
            return this.sortDir === 'asc' ? (valA > valB ? -1 : 1) : (valA < valB ? -1 : 1); // asc - desc
        });
        this.cases = cs;
    }

    headerAction(event) {
        const actionName = event.detail.action.name;
        const colDef = event.detail.columnDefinition;
        
        if(actionName === 'activeCases') {
            this.refreshCases(this.activeStats);
        } else if (actionName === 'allCases') {
            this.refreshCases(null);
        }

        const cols = JSON.parse(JSON.stringify(this.columns)); // quite stupid but it doesn't work wthout new object
        const column = cols.find(el => el.fieldName == colDef.fieldName);
        const actions = column.actions;
        actions.forEach((a) => {
            a.checked = a.name === actionName;
        });
        this.columns = cols;
    }

    columnSort(event) {
        this.sortDir = event.detail.sortDirection;
        this.sortedBy = event.detail.fieldName;
        this.sortCases();
    }
}