trigger CaseTrigger on Case (before insert, before update) {
    Id rtId = Schema.SObjectType.Case.getRecordTypeInfosByDeveloperName().get('Generators_support').getRecordTypeId();
    for(Case c : Trigger.new) {
        if(c.RecordTypeId == rtId) {
            c.Subject = c.Region__c + ' - ' + c.Manufacture__c;
            String inspType = c.Inspection_Types__c == null ? '' : c.Inspection_Types__c.split(';').get(0);
            c.First_inspection_Type__c = inspType;
            
            // manage NextActor
            Case oldCase = Trigger.old == null ? null : Trigger.oldMap.get(c.Id);
            if(oldCase != null && oldCase.Status != c.Status && c.Status == 'Draft') c.NextActor__c = c.CreatedById;
            else if(oldCase != null && oldCase.Status != c.Status && c.Status == 'Completed') c.NextActor__c = c.CreatedById;
            else if(oldCase != null && oldCase.OwnerId != c.OwnerId && ((String)c.OwnerId).startsWith('005')) c.NextActor__c = c.OwnerId;
            else c.NextActor__c = null;
        }
    }
}