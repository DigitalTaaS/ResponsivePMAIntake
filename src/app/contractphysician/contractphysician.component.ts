import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
//import { HttpClient } from '@angular/common/http';
import { Dropdown } from '../shared/dropdown';
import * as moment from 'moment';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Observable, } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/catch';
import { DegreeautosearchService } from '../degreeautosearch.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import { ContractphysicianModel, Address, Age, ContractedPartner, Facility, HoursOfOperation, Phone, Qualification, Taxonomy } from './contractphysician.model';
import { environment } from '../../environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModal } from './confirmation.modal';
import { variable } from '@angular/compiler/src/output/output_ast';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { LoginService } from '../login/login.service';

const API_URL = environment.apiURL;
const clientId = environment.clientId;
const clientSecret = environment.clientSecret;

@Component({
  selector: 'app-contractphysician',
  templateUrl: './contractphysician.component.html',
  styleUrls: ['./contractphysician.component.css']
})

export class ContractphysicianComponent  {
 
  authToken: string;
  model: ContractphysicianModel;
  contractPhysicianForm: FormGroup;
  firstnameCtrl: FormControl;
  middlenameCtrl: FormControl;
  lastnameCtrl: FormControl;
  aliasnameCtrl: FormControl;
  suffixCtrl: FormControl;
  npiCtrl: FormControl;
  licenceCtrl: FormControl;
  deaCtrl: FormControl;
  addressCtrl: FormControl;
  suiteCtrl: FormControl;
  cityCtrl: FormControl;
  zipCtrl: FormControl;
  phoneCtrl: FormControl;
  faxCtrl: FormControl;
  emailCtrl: FormControl;
  minAgeCtrl: FormControl;
  maxAgeCtrl: FormControl;
  description1:FormControl;

  demoPanelClicked = true;
  cpPanelClicked = true;
  licencePanelClicked = true;
  locationPanelClicked = true;

  demoPanelValueChange = false;
  cpPanelValueChange = false;
  licencePanelValueChange = false;
  locationPanelValueChange = false;

  states: Dropdown[] = [];
  contractedPartners: Dropdown[] = [];
  degrees: Dropdown[] = [];
  txcodes: Dropdown[] = [];
  days: Dropdown[] = [];
  hours: Dropdown[] = [];
  practiceTypes: Dropdown[] = [];
  locationTypes: Dropdown[] = [];
  male = true;
  gender = "M";
  selectedTaxcode:string="";
  selectedTaxType:string = "";
  descriptionText:string="";
  searchTextbox:string="";
  //story-955
  //officeIndex: number = 1;
  officeHourOne: string = "";
  officeHourTwo: string = "";
  isOfficeHoursValid: boolean = true;
  IsHidden= false;
  isDayValid:boolean= true;
  dayUnique = new Map<string,string>();

  // autocomplete 
  public degreesdata: Observable<any[]>;
  private searchTerms = new Subject<string>();
  public name = '';
  public flag: boolean = false;
  loading:boolean = false;
  startDate = new Date(1985, 0, 1);
  dobdate = new Date();
  navigationSubscription:any;

  private readonly newProperty = this.cpPanelValueChange = false;

  constructor(private fb: FormBuilder, 
              private degreeService: DegreeautosearchService, 
              private httpClient: HttpClient,
              private cdRef : ChangeDetectorRef, 
              private modalService: NgbModal,
              private router: Router,
              private loginservice:LoginService) {

            this.navigationSubscription = this.router.events.subscribe((e: any) => {
              // If it is a NavigationEnd event re-initalise the component
              if (e instanceof NavigationEnd) {
                this.initialiseform();
              }
            });
  }

  private initialiseform() {
    //this.GetAuthToken();
    this.firstnameCtrl = new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern("[A-z ]+$")]);
    this.middlenameCtrl = new FormControl(null, [Validators.maxLength(30), Validators.pattern("[A-z ]+$")]);
    this.lastnameCtrl = new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern("[A-z ]+$")]);
    this.suffixCtrl = new FormControl(null, [Validators.maxLength(10)]);
    this.aliasnameCtrl = new FormControl(null, [Validators.maxLength(30), Validators.pattern("[A-z ]+$")]);
    this.npiCtrl = new FormControl(null, [Validators.required, Validators.minLength(10)]);
    this.licenceCtrl = new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z0-9]{3}[0-9]+$")]);
    this.deaCtrl = new FormControl(null, [Validators.required, Validators.minLength(9), Validators.pattern("[a-zA-Z]{2}[0-9]{7}")]);
    this.addressCtrl = new FormControl(null, [Validators.maxLength(50), Validators.pattern("^[a-zA-Z0-9 ,]*$")]);
    this.suiteCtrl = new FormControl(null, [Validators.maxLength(15), Validators.pattern("^[a-zA-Z0-9 ,]*$")]);
    this.cityCtrl = new FormControl(null, [Validators.required, Validators.maxLength(30), Validators.pattern("[A-z ]+$")]);
    this.zipCtrl = new FormControl(null, [Validators.required, , Validators.minLength(5)]);
    this.phoneCtrl = new FormControl(null, [Validators.required, Validators.minLength(10)]);
    this.faxCtrl = new FormControl(null, Validators.minLength(10));
    this.emailCtrl = new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}")]);
    this.minAgeCtrl = new FormControl(null, [Validators.maxLength(3), Validators.max(150)]);
    this.maxAgeCtrl = new FormControl(null, [Validators.maxLength(3), Validators.max(150)]);
    this.contractPhysicianForm = this.fb.group({
      demographics: this.fb.group({
        firstName: this.firstnameCtrl,
        lastName: this.lastnameCtrl,
        middleName: this.middlenameCtrl,
        aliasName: this.aliasnameCtrl,
        suffixName: this.suffixCtrl,
        dateOfBirth: new FormControl(null, Validators.required),
        genderType: new FormControl("M", Validators.required)
      }),
      contractedPartners: this.fb.array([
        this.initContractedPartner()
      ]),
      licensing: this.fb.group({
        npiNumber: this.npiCtrl,
        licNumber: this.licenceCtrl,
        deaNumber: this.deaCtrl,
        degreeName: new FormControl(null),
        // taxanomyCode: new FormControl(null, Validators.required),
        taxanomyCode: new FormControl(null, Validators.required),
        description: new FormControl(),
        description1: new FormControl(null)
      }),
      locations: this.fb.array([
        this.initLocation(false)
      ])
    });


    this.populateDropDowns();
    
    //taxon search-highlight
    // stroy 955
    this.degreeService.search("all");
    //  // auto complete
    this.degreesdata = this.searchTerms
      .debounceTime(300) // wait for 300ms pause in events  
      .distinctUntilChanged() // ignore if next search term is same as previous  
      .switchMap(term => term ? this.degreeService.search(term) : Observable.of<any[]>([]))
      .catch(error => {
        // TODO: real error handling  
        console.log(error);
        return Observable.of<any[]>([]);
      });
    this.txcodes;
    this.degreeService.search("All")
      .subscribe(data => {
        this.txcodes = data.map(d => d.Code);
        console.log(this.txcodes);
      });
  }

  ngAfterViewInit() {
    (<FormGroup>this.contractPhysicianForm.get('demographics')).valueChanges.subscribe(val => {
      this.demoPanelValueChange = true;
      this.cpPanelValueChange = false;
      this.licencePanelValueChange = false;
      this.locationPanelValueChange = false;
    });

    (<FormArray>this.contractPhysicianForm.get('contractedPartners')).valueChanges.subscribe(val => {
      this.demoPanelValueChange = false;
      this.cpPanelValueChange = true;
      this.licencePanelValueChange = false;
      this.locationPanelValueChange = false;
    });

    (<FormGroup>this.contractPhysicianForm.get('licensing')).valueChanges.subscribe(val => {
      this.demoPanelValueChange = false;
      this.cpPanelValueChange = false;
      this.licencePanelValueChange = true;
      this.locationPanelValueChange = false;
    });

    (<FormArray>this.contractPhysicianForm.get('locations')).valueChanges.subscribe(val => {
      this.demoPanelValueChange = false;
      this.cpPanelValueChange = false;
      this.licencePanelValueChange = false;
      this.locationPanelValueChange = true;
    });
  }

  ngOnDestroy() {
    // avoid memory leaks here by cleaning up after ourselves. If we  
    // don't then we will continue to run our initialiseform()   
    // method on every navigationEnd event.
    if (this.navigationSubscription) {  
       this.navigationSubscription.unsubscribe();
    }
  }

  // Fast Search taxcode autocomplete
  searchClient(term: string): void {
    this.flag = true;
    console.log(term);
    this.searchTerms.next(term);  
  }  
  onselectClient(ClientObj) { 
    
    this.selectedTaxcode=ClientObj.Code;
    this.selectedTaxType = ClientObj.Specialization;
    this.descriptionText=ClientObj.Grouping+"\n\t"+ClientObj.Classification+ "\n\t\t"+ClientObj.Specialization;
    this.contractPhysicianForm.controls.licensing.get('taxanomyCode').setErrors(null);
    
    if (ClientObj.id != "0") {  
      this.name ="";       
      this.flag = false;  
      this.IsHidden= !this.IsHidden;
    }  
    else {  
      return false;  
    }  
  }  

  openFastSearch(){
    alert("ddd");
  }

  initContractedPartner() {
    return this.fb.group({
      contractedPartner: new FormControl(null, Validators.required)
    })
  }

  addContractedPartner() {
    const control = <FormArray>this.contractPhysicianForm.get('contractedPartners');
    control.push(this.initContractedPartner());
  }

  removeContractedPartner(i: number) {
    const control = <FormArray>this.contractPhysicianForm.get('contractedPartners');
    control.removeAt(i);
  }

  initLocation(clicked: boolean) {
    return this.fb.group({
      locationType: new FormControl(clicked ? "" : "Practice", Validators.required),
      address: this.addressCtrl,
      suite: this.suiteCtrl,
      state: new FormControl(null, Validators.required),
      city: this.cityCtrl,
      zipcode: this.zipCtrl,
      phone: this.phoneCtrl,
      fax: this.faxCtrl,
      email: this.emailCtrl,
      minAge: this.minAgeCtrl,
      maxAge: this.maxAgeCtrl,
      providerType: new FormControl(null, Validators.required),
      officeHours: this.fb.array([
        this.initOfficeHour()
      ])
    })
  }

  addLocation() {
    const control = <FormArray>this.contractPhysicianForm.get('locations');
    control.push(this.fb.group({
      locationType: new FormControl("", Validators.required),
      address: new FormControl(null, Validators.required),
      suite: new FormControl(),
      state: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      zipcode: new FormControl(null, Validators.required),
      phone: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      fax: new FormControl(null, [Validators.required, Validators.minLength(10)]),
      email: new FormControl(null, Validators.pattern("[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}"))
    })
    );
    //control.push(this.initLocation(true));
  }

  removeLocation(i: number) {
    const control = <FormArray>this.contractPhysicianForm.get('locations');
    control.removeAt(i);
  }

  initOfficeHour() {
    return this.fb.group({
      day: new FormControl(null, Validators.required),
      open: new FormControl(null, Validators.required),
      close: new FormControl(null, Validators.required)
    })
  }

  getOfficeHour(form) {
    return form.controls.officeHours.controls;
  }

  addOfficeHour(i: number) {
    //const control = <FormArray>this.contractPhysicianForm.get('locations.${i}.officeHours');
    //const control = (<FormArray>this.contractPhysicianForm.controls['locations']).controls[i]['controls']['officeHours'];
    const control = <FormArray>this.contractPhysicianForm.get(['locations', i, 'officeHours']);
    control.push(this.initOfficeHour());
    // this.officeIndex += 1;
  }

  removeOfficeHour(i: number, j: number) {
    //const control = <FormArray>this.contractPhysicianForm.get('locations.${i}.officeHours');
    //const control = (<FormArray>this.contractPhysicianForm.controls['locations']).controls[i]['controls']['officeHours'];
    const control = <FormArray>this.contractPhysicianForm.get(['locations', i, 'officeHours']);
    //control.removeAt(j);
    // control.removeAt(this.officeIndex = this.officeIndex - 1);
    control.removeAt(j);
  }

  // stroy 955
  onItemChangeOne(selectedValue: string) {
    this.officeHourOne = selectedValue;
    if (this.officeHourOne != "" && this.officeHourTwo != "") {
      this.isOfficeHoursValid = this.isValidHours(this.officeHourOne, this.officeHourTwo)
    }
    console.log(this.isOfficeHoursValid)
  }
  onItemChangeday(selectedValue)
  {
    if (this.dayUnique.get(selectedValue)!=null)
     {
        // alert("Select new day..")
         this.isDayValid=false;
         return this.isDayValid ;
     }
     else
     {
        this.dayUnique.set(selectedValue,selectedValue);
        this.isDayValid=true;
        return this.isDayValid;
     }
  }

  onItemChangeTwo(selectedValue: string) {
    this.officeHourTwo = selectedValue;
    if (this.officeHourOne != "" && this.officeHourTwo != "") {
      this.isOfficeHoursValid = this.isValidHours(this.officeHourOne, this.officeHourTwo)
    }
    console.log(this.isOfficeHoursValid)
  }

  isValidHours(open: string, close: string) {
    var format = 'hh:mm A'
    let myopen: moment.Moment = moment(open, format);
    let myclose: moment.Moment = moment(close, format);

    console.log(myopen);
    if (myopen.isBefore(myclose)) {
      return true;
    }

    return false;

  }

  onSelect(event:Event){
    event.preventDefault();
   this.IsHidden= !this.IsHidden;
   this.cdRef.detectChanges(); 
   //this.contractPhysicianForm.controls.licensing.get('taxanomyCode').setErrors(null);

   
  }

  // story -955 
  //Physician PCP
  onSelectContractedPartner(selectedValue:string)
  {
    // console.log(selectedValue);
    // this.degrees=[];
    // if (selectedValue=="CNTRPhysician")
  
    // this.degrees.push(new Dropdown("Doctor of Osteopathic Medicine", "DO"));
    // this.degrees.push(new Dropdown("Doctor of Medicine", "MD"));
    // this.degrees.push(new Dropdown("Doctor of Podiatry Medicine", "DPM"));
    // this.degrees.push(new Dropdown("Doctor of Nurse Anaesthesia Practice", "DNAP"));
    // this.degrees.push(new Dropdown("Doctor of NUrsing Practice", "DNP"));
    // this.degrees.push(new Dropdown("Doctor of Nursing Science", "DNS"));
    // this.degrees.push(new Dropdown("Doctoral Degree in Audiology", "AuD"));
    // this.degrees.push(new Dropdown("Doctor of Chiropractic", "DC"));
    // this.degrees.push(new Dropdown("Master Degree in Occupational Therapy", "OT"));
    // this.degrees.push(new Dropdown("Doctorate in Occupational Therapy", "OTD"));
    // this.degrees.push(new Dropdown("Doctor of Optometry", "OD"));
    // this.degrees.push(new Dropdown("Doctor of Physical Therapy", "DPT"));
    // this.degrees.push(new Dropdown("Doctor of Speech-Language Pathology", "SLPD"));
    
    // //Extended PCP
    // // if (selectedValue=="CNTRExtendedPCP")
    // // {
    //   this.degrees.push(new Dropdown("Master of Science in Nursing", "MSN"));
    // this.degrees.push(new Dropdown("Master of Clinical Health Services", "MCHS"));
    // this.degrees.push(new Dropdown("Master of Clinical Medical Science", "MCMSc"));
    // this.degrees.push(new Dropdown("Master of Health Science", "MHS"));
    // this.degrees.push(new Dropdown("Master of Science in Medicine", "MMS"));
    // this.degrees.push(new Dropdown("Master of Medical Science", "MMSc"));
    // this.degrees.push(new Dropdown("Master of Physician Assistant Studies", "MPAS"));
    // this.degrees.push(new Dropdown("Master of Science in Physician Associate studies", "MSPA"));
    // this.degrees.push(new Dropdown("Postgraduate Diploma in Physician Associate studies", "PgDip"));
    // this.degrees.push(new Dropdown("Master Degree in Occupational Therapy", "OT"));
   
    // //  }
    //  //Extended Other
    // // if (selectedValue=="CNTROther")
    // // {
    // this.degrees.push(new Dropdown("Doctor of Podiatry Medicine", "DPM"));
    // //  } 
   //  this.contractPhysicianForm.controls.licensing.get('taxanomyCode').setErrors(null);

    selectedValue="";
  }

  toggleGender(val) {
    if(val != this.gender){
      this.male = !this.male;
      this.gender = this.male ? "M" : "F";
    }
  }

  togglePanel(id: string) {
    switch (id) {
      case "demo":
        this.demoPanelClicked = !this.demoPanelClicked;
        break;
      case "cp":
        this.cpPanelClicked = !this.cpPanelClicked;
        break;
      case "licence":
        this.licencePanelClicked = !this.licencePanelClicked;
        break;
      case "location":
        this.locationPanelClicked = !this.locationPanelClicked;
        break;
    }
  }

  scrollTo(elementid) {
    let element = document.getElementById(elementid);
    element.scrollIntoView();

    switch (elementid) {
      case "demographicsPanel":
        if (!this.demoPanelClicked) {
          this.demoPanelClicked = true;
          document.getElementById("demoPanelinfo").setAttribute('class', 'show');
        }
        break;
      case "cpPanel":
        if (!this.cpPanelClicked) {
          this.cpPanelClicked = true;
          document.getElementById("cpPanelinfo").setAttribute('class', 'show');
        }
        break;
      case "licencePanel":
        if (!this.licencePanelClicked) {
          this.licencePanelClicked = true;
          document.getElementById("licensePanelinfo").setAttribute('class', 'show');
        }
        break;
      case "locationPanel":
        if (!this.locationPanelClicked) {
          this.locationPanelClicked = true;
          document.getElementById("locationPanelinfo").setAttribute('class', 'show');
        }
        break;
    }
  }

  populateDropDowns() {
    this.states.push(new Dropdown("Alabama", "AL"));
    this.states.push(new Dropdown("Alaska", "AK"));
    this.states.push(new Dropdown("Arizona", "AZ"));
    this.states.push(new Dropdown("Arkansas", "AR"));
    this.states.push(new Dropdown("California", "CA"));
    this.states.push(new Dropdown("Colorado", "CO"));
    this.states.push(new Dropdown("Connecticut", "CT"));
    this.states.push(new Dropdown("Delaware", "DE"));
    this.states.push(new Dropdown("District Of Columbia", "DC"));
    this.states.push(new Dropdown("Florida", "FL"));
    this.states.push(new Dropdown("Georgia", "GA"));
    this.states.push(new Dropdown("Hawaii", "HI"));
    this.states.push(new Dropdown("Idaho", "ID"));
    this.states.push(new Dropdown("Illinois", "IL"));
    this.states.push(new Dropdown("Indiana", "IN"));
    this.states.push(new Dropdown("Iowa", "IA"));
    this.states.push(new Dropdown("Kansas", "KS"));
    this.states.push(new Dropdown("Kentucky", "KY"));
    this.states.push(new Dropdown("Louisiana", "LA"));
    this.states.push(new Dropdown("Maine", "ME"));
    this.states.push(new Dropdown("Maryland", "MD"));
    this.states.push(new Dropdown("Massachusetts", "MA"));
    this.states.push(new Dropdown("Michigan", "MI"));
    this.states.push(new Dropdown("Minnesota", "MN"));
    this.states.push(new Dropdown("Mississippi", "MS"));
    this.states.push(new Dropdown("Missouri", "MO"));
    this.states.push(new Dropdown("Montana", "MT"));
    this.states.push(new Dropdown("Nebraska", "NE"));
    this.states.push(new Dropdown("Nevada", "NV"));
    this.states.push(new Dropdown("New Hampshire", "NH"));
    this.states.push(new Dropdown("New Jersey", "NJ"));
    this.states.push(new Dropdown("New Mexico", "NM"));
    this.states.push(new Dropdown("New York", "NY"));
    this.states.push(new Dropdown("North Carolina", "NC"));
    this.states.push(new Dropdown("North Dakota", "ND"));
    this.states.push(new Dropdown("Ohio", "OH"));
    this.states.push(new Dropdown("Oklahoma", "OK"));
    this.states.push(new Dropdown("Oregon", "OR"));
    this.states.push(new Dropdown("Pennsylvania", "PA"));
    this.states.push(new Dropdown("Rhode Island", "RI"));
    this.states.push(new Dropdown("South Carolina", "SC"));
    this.states.push(new Dropdown("South Dakota", "SD"));
    this.states.push(new Dropdown("Tennessee", "TN"));
    this.states.push(new Dropdown("Texas", "TX"));
    this.states.push(new Dropdown("Utah", "UT"));
    this.states.push(new Dropdown("Vermont", "VI"));
    this.states.push(new Dropdown("Virginia", "VA"));
    this.states.push(new Dropdown("Washington", "WA"));
    this.states.push(new Dropdown("West Virginia", "WV"));
    this.states.push(new Dropdown("Wisconsin", "WI"));
    this.states.push(new Dropdown("Wyoming", "WY"));

    //USER STORY-973-Contracted Partner Panel
    this.contractedPartners.push(new Dropdown("Allied Physicians if California, A Professional Medical Corp ", "CNTRPhysician"));
    this.contractedPartners.push(new Dropdown("Applecare Medical Group, Inc ", "CNTRExtendedPCP"));
    this.contractedPartners.push(new Dropdown("Community Family Care IPA ", "CNTROther"));

    //New lists for drop down
    // this.contractedPartners.push(new Dropdown("AIDS Healthcare Foundation", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("Allied Physicians if California, A Professional Medical Corp", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Altamed Health Services Corp", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("Angel Medical Group, Inc.", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("Angeles IPA, A Medical Corporation ", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Applecare Medical Group St. Francis, Inc.", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("Applecare Medical Group, Inc", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("Axminster Medical Group Inc.", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Bella Vista Medical Group IPA", "CNTROther"));

    // this.contractedPartners.push(new Dropdown("Cedars-Sinai Medical Care Foundation", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("Citrus Valley Physicians Group", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("City of Hope Medical Foundation", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Community Family Care IPA", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("Crown City Medical Group, Inc.", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("Davita Medical Group Talbert California, P.C.", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("El Proyecto Del Barrio, Inc", "CNTROther"));
    
    // this.contractedPartners.push(new Dropdown("Employee Health Systems Medical Group", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("Exceptional Care Medical Group, Inc", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("Family Care Specislist", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Global Care Medical Group IPA", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("HealthCare Partners Associates Medical Group, Inc.", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("Heritage Provider Network, Inc.", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Martin Luther King Jr Community Medical Group", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("MedPoint Management, Inc. (NPI belongs to MedPoints)", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("Omnicare Medical Group, Inc.", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("Pioneer Provider Network", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Pomona Valley Medical Group, Inc. ", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("Preferred IPA of California, A Professional Medical Corporation", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("Prospect Medical Group, Inc", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("Seaside Health Plan", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Seoul Medical Group Inc", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("South Atlantic Medical Group", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("St. Vincent IPA Medical Corporations", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("UC Regents", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Universal Care", "CNTROther"));
    // this.contractedPartners.push(new Dropdown("University Childrens Medical Group", "CNTRPhysician"));
    // this.contractedPartners.push(new Dropdown("USC Care Medical Group, Inc", "CNTRExtendedPCP"));
    // this.contractedPartners.push(new Dropdown("Universal Care", "CNTROther"));
    // 
    //     
    //this.contractedPartners.push(new Dropdown("CNTR. PARTNER4", "CNTRPARTNER4"));

    // this.contractedPartners.push(new Dropdown("CNTR. PARTNER1", "CNTRPARTNER1"));
    // this.contractedPartners.push(new Dropdown("CNTR. PARTNER2", "CNTRPARTNER2"));
    // this.contractedPartners.push(new Dropdown("CNTR. PARTNER3", "CNTRPARTNER3"));
    // this.contractedPartners.push(new Dropdown("CNTR. PARTNER4", "CNTRPARTNER4"));

    // this.degrees.push(new Dropdown("MA", "01a"));
    // this.degrees.push(new Dropdown("MD", "01b"));

    // this.txcodes.push(new Dropdown("Taxonomy Code1", "txc1"));
    // this.txcodes.push(new Dropdown("Taxonomy Code2", "txc2"));
    // this.txcodes.push(new Dropdown("Taxonomy Code3", "txc3"));

    //Degree drop down
    this.degrees.push(new Dropdown("Doctor of Osteopathic Medicine", "DO"));
    this.degrees.push(new Dropdown("Doctor of Medicine", "MD"));
    this.degrees.push(new Dropdown("Doctor of Podiatry Medicine", "DPM"));
    this.degrees.push(new Dropdown("Doctor of Nurse Anaesthesia Practice", "DNAP"));
    this.degrees.push(new Dropdown("Doctor of NUrsing Practice", "DNP"));
    this.degrees.push(new Dropdown("Doctor of Nursing Science", "DNS"));

    //REMOVED AS PER DIANE CRAIG LATEST UPDATE
    // this.degrees.push(new Dropdown("Doctoral Degree in Audiology", "AuD"));
    // this.degrees.push(new Dropdown("Doctor of Chiropractic", "DC"));
    // this.degrees.push(new Dropdown("Master Degree in Occupational Therapy", "OT"));
    // this.degrees.push(new Dropdown("Doctorate in Occupational Therapy", "OTD"));
    // this.degrees.push(new Dropdown("Doctor of Optometry", "OD"));
    // this.degrees.push(new Dropdown("Doctor of Physical Therapy", "DPT"));
    // this.degrees.push(new Dropdown("Doctor of Speech-Language Pathology", "SLPD"));
    
    //Extended PCP
    // if (selectedValue=="CNTRExtendedPCP")
    // {
      this.degrees.push(new Dropdown("Master of Science in Nursing", "MSN"));
    this.degrees.push(new Dropdown("Master of Clinical Health Services", "MCHS"));
    this.degrees.push(new Dropdown("Master of Clinical Medical Science", "MCMSc"));
    this.degrees.push(new Dropdown("Master of Health Science", "MHS"));
    this.degrees.push(new Dropdown("Master of Science in Medicine", "MMS"));
    this.degrees.push(new Dropdown("Master of Medical Science", "MMSc"));
    this.degrees.push(new Dropdown("Master of Physician Assistant Studies", "MPAS"));
    this.degrees.push(new Dropdown("Master of Science in Physician Associate studies", "MSPA"));
    this.degrees.push(new Dropdown("Postgraduate Diploma in Physician Associate studies", "PgDip"));
    this.degrees.push(new Dropdown("Master Degree in Occupational Therapy", "OT"));
   
    //  }
     //Extended Other
    // if (selectedValue=="CNTROther")
    // {
    this.degrees.push(new Dropdown("Doctor of Podiatry Medicine", "DPM"));
   


    //Degree drop downs
    
    this.days.push(new Dropdown("Monday", "monday"));
    this.days.push(new Dropdown("Tuesday", "tuesday"));
    this.days.push(new Dropdown("Wednesday", "wednesday"));
    this.days.push(new Dropdown("Thursday", "thursday"));
    this.days.push(new Dropdown("Friday", "friday"));
    this.days.push(new Dropdown("Saturday", "saturday"));
    this.days.push(new Dropdown("Sunday", "sunday"));

    this.hours.push(new Dropdown("8:00am", "8:00am"));
    this.hours.push(new Dropdown("8:30am", "8:30am"));
    this.hours.push(new Dropdown("9:00am", "9:00am"));
    this.hours.push(new Dropdown("9:30am", "9:30am"));
    this.hours.push(new Dropdown("10:00am", "10:00am"));
    this.hours.push(new Dropdown("10:30am", "10:30am"));
    this.hours.push(new Dropdown("11:00am", "11:00am"));
    this.hours.push(new Dropdown("11:30am", "11:30am"));
    this.hours.push(new Dropdown("12:00pm", "12:00pm"));
    this.hours.push(new Dropdown("12:30pm", "12:30pm"));
    this.hours.push(new Dropdown("1:00pm", "1:00pm"));
    this.hours.push(new Dropdown("1:30pm", "1:30pm"));
    this.hours.push(new Dropdown("2:00pm", "2:00pm"));
    this.hours.push(new Dropdown("2:30pm", "2:30pm"));
    this.hours.push(new Dropdown("3:00pm", "3:00pm"));
    this.hours.push(new Dropdown("3:30pm", "3:30pm"));
    this.hours.push(new Dropdown("4:00pm", "4:00pm"));
    this.hours.push(new Dropdown("4:30pm", "4:30pm"));
    this.hours.push(new Dropdown("5:00pm", "5:00pm"));
    this.hours.push(new Dropdown("5:30pm", "5:30pm"));
    this.hours.push(new Dropdown("6:00pm", "6:00pm"));
    this.hours.push(new Dropdown("6:30pm", "6:30pm"));
    this.hours.push(new Dropdown("7:00pm", "7:00pm"));

    this.practiceTypes.push(new Dropdown("PCP", "PCP"));
    this.practiceTypes.push(new Dropdown("PCP/Specialist", "PCP/Specialist"));
    this.practiceTypes.push(new Dropdown("Specialist", "Specialist"));
    this.practiceTypes.push(new Dropdown("PCP extender", "PCP extender"));

    this.locationTypes.push(new Dropdown("Practice", "Practise"));
    this.locationTypes.push(new Dropdown("Office", "Office"));
    this.locationTypes.push(new Dropdown("Billing", "Billing"));

  }

  onSubmit() {
    
    try {
      this.loading = true;
      this.ConstructModel();
    } catch (error) {
      this.loading = false;
      const modalRef = this.modalService.open(ConfirmationModal, {centered: true, keyboard: false, backdrop:'static', windowClass: 'error-modal'});
      modalRef.componentInstance.errors = 0;
      modalRef.componentInstance.errorMessage = "Submission Failed. Please try again later.";
      return false;
    }
   

    //this.model.dateOfBirth = this.dobdate.getMonth + '-' + this.dobdate.getDay + '-' + this.dobdate.getFullYear;
     

    console.log(this.model);
    console.log(JSON.stringify(this.model));
    const accesstoken =  JSON.parse(localStorage.getItem('accesstoken'));
    this.httpClient.post(API_URL+'/api/providers?access_token='+accesstoken, this.model, {observe: 'response'})
      .subscribe(
        res => {
          this.loading = false;
          console.log(res)
          var body:any = res.body;
          if(res.status == 200){
            const modalRef = this.modalService.open(ConfirmationModal, {centered: true, keyboard: false, backdrop:'static'});
            modalRef.componentInstance.errors = body.errors.length;
            modalRef.componentInstance.errorMessage = "";
          }
        }, 
        err => {
          this.loading = false;
          var message;
          if(err.status == 400)
            message = 'OOPS!! Status Code : 400 Bad request. Please try again.'
          else if(err.status == 401)
            message = 'OOPS!! Status Code : 401 Token Issue. Please try again.'
          else
            message = 'OOPS!! Something went wrong. Please try again.'

          const modalRef = this.modalService.open(ConfirmationModal, {centered: true, keyboard: false, backdrop:'static', windowClass: 'error-modal'});
          modalRef.componentInstance.errors = 0;
          modalRef.componentInstance.errorMessage = message;
          }

          
        
      );

  }

  private ConstructModel() {
    var contractedPartners: ContractedPartner[] = this.TransformContractedPartnersData();
    var facilities: Facility[] = this.TransformLocationData();
    this.model =
      {
        firstName: this.contractPhysicianForm.get('demographics').get('firstName').value,
        lastName: this.contractPhysicianForm.get('demographics').get('lastName').value,
        gender: this.contractPhysicianForm.get('demographics').get('genderType').value,
        contractedPartners: contractedPartners,
        npi: this.contractPhysicianForm.get('licensing').get('npiNumber').value,
        licenseNumber: this.contractPhysicianForm.get('licensing').get('licNumber').value,
        dea: this.contractPhysicianForm.get('licensing').get('deaNumber').value,
        /* taxonomies:[{taxonomyCode: this.selectedTaxcode, taxonomyType: this.selectedTaxType}], */
        taxonomies:[{taxonomyCode: this.selectedTaxcode, taxonomyType: 'board'}],
        qualification:{professionalDegreeCode: this.contractPhysicianForm.get('licensing').get('degreeName').value},
        facilities: facilities
      };
    //Optional values
    if (this.contractPhysicianForm.get('demographics').get('middleName').value)
      this.model.middleName = this.contractPhysicianForm.get('demographics').get('middleName').value;
    if (this.contractPhysicianForm.get('demographics').get('aliasName').value)
      this.model.middleName = this.contractPhysicianForm.get('demographics').get('aliasName').value;
    if (this.contractPhysicianForm.get('demographics').get('suffixName').value)
      this.model.middleName = this.contractPhysicianForm.get('demographics').get('suffixName').value;
  }

  private TransformLocationData() {

    var facilities: Facility[] = new Array();
    var facility: Facility;
    var fvalues = <FormArray>this.contractPhysicianForm.get('locations');
    var phones: Phone[] = new Array();
    var mobile: Phone = { type: 'work', number: fvalues.at(0).get('phone').value };
    phones.push(mobile);
    if (fvalues.at(0).get('fax').value) {
      var fax: Phone = { type: 'fax', number: fvalues.at(0).get('fax').value };
      phones.push(fax);
    }
    var officeHours: HoursOfOperation[] = new Array();
    var offhrs = <FormArray>fvalues.at(0).get('officeHours');
    for (let i = 0; i < offhrs.length; i++) {
      let offhr = new HoursOfOperation;
      offhr.day = offhrs.at(i).get('day').value;
      offhr.open = offhrs.at(i).get('open').value;
      offhr.close = offhrs.at(i).get('close').value;
      officeHours.push(offhr);
    }
    facility = {
      facilityType: "Practice",
      email: fvalues.at(0).get('email').value,
      address: {
        addressLine1: fvalues.at(0).get('address').value,
        city: fvalues.at(0).get('city').value,
        state: fvalues.at(0).get('state').value,
        zipCode: fvalues.at(0).get('zipcode').value,
      },
      practiceType: fvalues.at(0).get('providerType').value,
      phones: phones,
      hoursOfOperation: officeHours,
      age: { 
        min : fvalues.at(0).get('minAge').value ? +fvalues.at(0).get('minAge').value : 0,
        max : fvalues.at(0).get('maxAge').value ? +fvalues.at(0).get('maxAge').value : 0
      }
    };

    if(fvalues.at(0).get('suite').value)
      facility.address.addressLine2 = fvalues.at(0).get('suite').value;
      
    facilities.push(facility);
    return facilities;
  }

  private TransformContractedPartnersData() {

    var contractedPartners: ContractedPartner[] = new Array();
    var cpvaules = <FormArray>this.contractPhysicianForm.get('contractedPartners');
    for (let i = 0; i < cpvaules.length; i++) {
      let cp = new ContractedPartner;
      cp.partnerName = cpvaules.at(i).get('contractedPartner').value;
      contractedPartners.push(cp);
    }
    return contractedPartners;
  }

  logout(){
    this.loginservice.logout();
      this.router.navigate(['/login']);
    
  }
}