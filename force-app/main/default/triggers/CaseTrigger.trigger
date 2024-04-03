trigger CaseTrigger on Case (before insert, before update) {
    Id rtId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Generators_support').getRecordTypeId();
    for(Case c : Trigger.new) {
        if(c.RecordTypeId == rtId) {
            c.Subject = c.Region__c + ' - ' + c.Manufacture__c;
            //Case oldCase = Trigger.old == null ? null : Trigger.oldMap.get(c.Id);
            //if(oldCase != null && oldCase.Status != c.Status && c.Status == 'Draft') c.OwnerId = c.CreatedById; customer community can't be owner
        }
    }
}