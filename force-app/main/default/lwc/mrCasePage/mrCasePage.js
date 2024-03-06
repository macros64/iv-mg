import { LightningElement, api } from 'lwc';

export default class MrCasePage extends LightningElement {
    @api recordId;
    @api mode = 'view';
    fields = ['Region__c', 'Manufacture__c', 'Inspection_Types__c', 'Desired_inspection_start__c'];
}