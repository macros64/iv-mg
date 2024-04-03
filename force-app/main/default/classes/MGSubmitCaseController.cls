public without sharing class MGSubmitCaseController {
    @AuraEnabled
    public static void submitCase(Id caseId){
        try {
            //ProcessDefinition pd = [SELECT Id FROM ProcessDefinition WHERE DeveloperName = 'Generators_support_case_approval']; system.debug(pd);

            Case c = [SELECT Id, Status FROM Case WHERE Id = :caseId];
            c.Status = 'Submitted';
            update c;

            Approval.ProcessSubmitRequest req = new Approval.ProcessSubmitRequest();
            req.setComments('Submitting case for approval.');
            req.setObjectId(caseId);
            req.setSubmitterId(UserInfo.getUserId()); 
            req.setProcessDefinitionNameOrId('Generators_support_case_approval');
            req.setSkipEntryCriteria(true);

            Approval.process(req);
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
}