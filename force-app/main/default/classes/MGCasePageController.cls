public with sharing class MGCasePageController {

    @AuraEnabled
    public static List<Case> getCases() {
        return [
            SELECT Id, CaseNumber, Subject, CreatedDate, Status, Region__c, Manufacture__c, Inspection_Types__c, Desired_inspection_start__c, ExperienceUrl__c
            FROM Case 
            WHERE RecordType.DeveloperName = 'Generators_support'
            //WITH SECURITY_ENFORCED
        ];
    }
}