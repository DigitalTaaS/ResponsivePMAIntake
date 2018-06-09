import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { ContractphysicianComponent } from './contractphysician/contractphysician.component';
import { SetActiveClassDirective } from './shared/set-active-class.directive';
//import { HttpClientModule  } from '@angular/common/http';
import { DegreeautosearchService } from './degreeautosearch.service';
import { PmahighlighttextPipe } from './pmahighlighttext.pipe';
import { PmataxoncodePipe } from './pmataxoncode.pipe';
import { IntakeInterceptor } from './shared/intake-interceptor';
import { Multicolumnfilter } from './multicolumnfilter.pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModal } from './contractphysician/confirmation.modal';
import { LoginComponent } from './login/login.component';
import { AuthGuardService } from './login/auth-guard.service';
import { LoginService } from './login/login.service';

const materials = [MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule]

@NgModule({
  declarations: [
    AppComponent,
    ContractphysicianComponent,
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
