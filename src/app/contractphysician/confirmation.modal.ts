import { Component, Input, ViewEncapsulation } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
    selector: 'confirmation-modal',
    templateUrl: './confirmation.modal.html',      
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['confirmation.modal.css']
})
export class ConfirmationModal {

    @Input() errors: number;
    @Input() errorMessage:string;
    constructor(private activeModal: NgbActiveModal, private router: Router) {

    }

    NewEntry() {
        this.activeModal.close();
        this.router.navigate(['contractphysician']);
    }

    close(){
        this.activeModal.close();
    }

}