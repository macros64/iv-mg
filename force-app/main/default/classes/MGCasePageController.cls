public with sharing class MGCasePageController {

    @AuraEnabled
    public static List<Case> getCases() {
        return [
            SELECT Id, Subject, CreatedDate, Region__c, Manufacture__c, Inspection_Types__c, Desired_inspection_start__c 
            FROM Case 
            WITH SECURITY_ENFORCED
        ];
    }
}