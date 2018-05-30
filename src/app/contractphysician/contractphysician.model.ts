export class ContractphysicianModel {
    //Demographics Panel    
    firstName?: string;
    middleName?: string;
    lastName?: string;
    suffix?: string;
    alias?: string;
    gender?: string;
    dateOfBirth?: string;

    //Licensing Panel
    contractedPartners?: ContractedPartner[];

    //Licensing Panel
    npi: string;
    dea?: string;
    licenseNumber?: string;
    qualification?: Qualification;
    taxonomies?: Taxonomy[];

    //Location Panel
    facilities?: Facility[];
}

class Taxonomy {
    taxonomyType: string;
    taxonomyCode: string;
    status: string;
}

class Qualification {
    professionalDegreeCode: string;
    professionalDegreeSchool?: string;
    certificateNumber?: string;
    graduationYear?: number;
}

class ContractedPartner {
    partnerName: string;
}

class Facility {
    facilityId?: string;
    facilityName?: string;
    facilityType: string;
    practiceType: string;
    dhcsSiteId?: string;
    lastFsrDate?: string;
    email: string;
    phones: Phone[];
    hoursOfOperation: HoursOfOperation[];
    age: Age;
    address: Address;
}

class Phone {
    type: string;
    number: string;
}

class HoursOfOperation {
    day: string;
    open: string;
    close: string;
}

class Age {
    min: number;
    max: number;
}

class Address {
    name: string;
    addressLine1: string;
    city: string;
    country: string;
    state: string;
    zipCode: string;
}






