import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { PractitionerComponent } from './practitioner/practitioner.component';
import { ContractphysicianComponent } from './contractphysician/contractphysician.component';
import { LndpageComponent } from './lndpage/lndpage.component';
import { NoncontractphysicianComponent } from './noncontractphysician/noncontractphysician.component';
import { ContractmidlevelComponent } from './contractmidlevel/contractmidlevel.component';
import { ContractnonphysicianComponent } from './contractnonphysician/contractnonphysician.component';
import { NoncontractmidlevelComponent } from './noncontractmidlevel/noncontractmidlevel.component';
import { NoncontractnonphysicianComponent } from './noncontractnonphysician/noncontractnonphysician.component';
import { SetActiveClassDirective } from './shared/set-active-class.directive';
//import { HttpClientModule  } from '@angular/common/http';
import { DegreeautosearchService } from './degreeautosearch.service';
import { PmahighlighttextPipe } from './pmahighlighttext.pipe';
import { PmataxoncodePipe } from './pmataxoncode.pipe';
import { IntakeInterceptor } from './shared/intake-interceptor';
import { Multicolumnfilter } from './multicolumnfilter.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModal } from './contractphysician/confirmation.modal';
import { AuthenticationService } from './shared/authentication.service';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './login/auth-guard.service';
import { LoginService } from './login/login.service';

const materials = [MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule]

@NgModule({
  declarations: [
    AppComponent,
    PractitionerComponent,
    ContractphysicianComponent,
    LndpageComponent,
    NoncontractphysicianComponent,
    ContractmidlevelComponent,
    ContractnonphysicianComponent,
    NoncontractmidlevelComponent,
    NoncontractnonphysicianComponent,
    SetActiveClassDirective,
    PmahighlighttextPipe,
    PmataxoncodePipe,
    Multicolumnfilter,
    ConfirmationModal,
    LoginComponent
  ],
  entryComponents:[ConfirmationModal],
  exports:[materials],
  imports: [
    NgbModule.forRoot(),
    materials,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule,
    HttpClientModule ,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
     {path:'',component:LoginComponent},
     {path:'contractphysician', component:ContractphysicianComponent, canActivate: [AuthGuardService]},
     // otherwise redirect to home
    { path: '**', redirectTo: '' }
    ], {onSameUrlNavigation: "reload"})
  ],
 
  providers: [
    LoginService,
    AuthGuardService,
    DegreeautosearchService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: IntakeInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule { }
