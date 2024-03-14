import { LightningElement } from 'lwc';
import toast from 'lightning/toast';
import doRegister from '@salesforce/apex/MGRegisterController.Register';

export default class MgRegister extends LightningElement {
    firstName = '';
    lastName = '';
    email = '';
    license = '';
    isloading = false;

    firstNameChange(event) {
        this.firstName = event.detail.value;
    }
    lastNameChange(event) {
        this.lastName = event.detail.value;
    }
    emailChange(event) {
        this.email = event.detail.value;
    }
    licenseChange(event) {
        this.license = event.detail.value;
    }

    regClick() {
        const allValid = [
            ...this.template.querySelectorAll('lightning-input'),
        ].reduce((validSoFar, inputCmp) => {
            inputCmp.reportValidity();
            return validSoFar && inputCmp.checkValidity();
        }, true);

        if(allValid) {
            this.isloading = true;
            doRegister({
                firstName: this.firstName, lastName: this.lastName, email: this.email, license: this.license
            })
            .then(res => {
                if(res.success) {
                    console.log('registration successful');
                } else {
                    console.log('reg error: ' + res.message);
                    toast.show({
                        label: 'Registration error',
                        message: res.message,
                        //mode: 'dismissible',
                        variant: 'error'
                    }, this);
                }
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                this.isloading = false;
            });

        }
    }
}