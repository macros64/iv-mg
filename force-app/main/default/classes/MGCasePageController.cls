public with sharing class MGCasePageController {

    @AuraEnabled
    public static List<Case> getCases(String[] statuses) {
        Id userId = UserInfo.getUserId();
        String soql = 'SELECT Id, CaseNumber, Subject, CreatedDate, Status, Region__c, Manufacture__c, Inspection_Types__c, ' +
            'Desired_inspection_start__c, ExperienceUrl__c, StatusIconLWC__c, CaseName__c ' + 
            'FROM Case WHERE RecordType.DeveloperName = \'Generators_support\' AND (CreatedById = :userId OR OwnerId = :userId)';
        
        if(statuses != null && !statuses.isEmpty()) {
            soql += ' AND Status IN :statuses';
        }

        return Database.query(soql);
    }

    @AuraEnabled
    public static void acceptCase(Id caseId) {
        try {
            Case c = [SELECT Id, Status FROM Case WHERE Id = :caseId];

            c.Status = 'Closed';
            update c;
        } catch (Exception ex) {
            throw new AuraException(ex.getMessage());
        }
    }
}