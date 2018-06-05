import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'confirmation-modal',
    templateUrl: './confirmation.modal.html',      
    encapsulation: ViewEncapsulation.None,
    styles: [`
    .modal-content {
        background-color: #B1E6E9;
        color: white;
        
    }

    .error-modal .modal-content {
        background-color: #B09EC1;
        color: white;
        
    }

    .success-modal{
        height:300px;
        padding-top:75px;
    }

    .modal-backdrop.fade {
        opacity: 0.5;
    }

    .modal-open .modal {
        opacity: 1;
    }
    .p-text{
        font-size:35px;
        font-family: ArialMT, Regular;
    }
    `]
})
export class ConfirmationModal {

    @Input() errors: number;
    @Input() errorMessage:string;
    constructor(private activeModal: NgbActiveModal, private router: Router) {

    }

    NewEntry() {
        this.activeModal.close();
        this.router.navigate(['']);
    }

    close(){
        this.activeModal.close();
    }

}