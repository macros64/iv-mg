public without sharing class MGRegisterController {

    private static final String PROFILE = 'Customer Community User';
    //private static final String PROFILE = 'Customer Community User';

    public class RegResult {
        @AuraEnabled public Boolean success;
        @AuraEnabled public String message;
        public RegResult(Boolean s, String m) {
            success = s;
            message = m;
        }
    }

    @AuraEnabled
    public static RegResult Register(String firstName, String lastName, String email, String license) {
        RegResult ret = new RegResult(true, 'ok');

        List<Account> accList = [SELECT Id, Name FROM Account WHERE LicenseCode__c = :license];
        if(accList.isEmpty()) {
            ret.success = false;
            ret.message = 'Licnse number does not belongs to any registered company';
        } else if(accList.size() > 1) {
            ret.success = false;
            ret.message = 'Multiple companies found with this license number, please contact administrator';
        } else {
            Account acc = accList.get(0);
            SavePoint sp = Database.setSavepoint();

            Contact cont = new Contact();
            cont.AccountId = acc.Id;
            cont.FirstName = firstName;
            cont.LastName = lastName;
            cont.Email = email;

            User newUser = new User();
            newUser.FirstName = firstName;
            newUser.LastName = lastName;
            newUser.Email = email;
            newUser.ProfileId = [SELECT Id FROM Profile WHERE Name = :PROFILE LIMIT 1].Id;
            newUser.Username = email;
            newUser.Alias = email.substring(0, Math.min(8, email.indexOf('@')));
            newUser.TimeZoneSidKey = 'Asia/Dubai';
            newuser.LocaleSidKey = 'en_US';
            newUser.EmailEncodingKey = 'ISO-8859-1';
            newUser.LanguageLocaleKey = 'en_US';
            

            try {
                insert cont;
                newUser.ContactId = cont.Id;
                insert newUser;
            }
            catch(Exception ex) {
                Database.rollback(sp);
                ret.success = false;
                ret.message = ex.getMessage();
                System.debug(ex.getStackTraceString());
            }
        }

        return ret;
    }
}