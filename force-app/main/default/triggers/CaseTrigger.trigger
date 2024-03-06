trigger CaseTrigger on Case (before insert, before update) {
    Id rtId = Schema.SObjectType.Case.getRecordTypeInfosByName().get('Generators_support').getRecordTypeId();
    for(Case c : Trigger.new) {
        if(c.RecordTypeId == rtId) {
            c.Subject = c.Region__c + ' - ' + c.Manufacture__c;
        }
    }
}