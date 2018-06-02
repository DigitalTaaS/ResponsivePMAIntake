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

export class Taxonomy {
    taxonomyType: string;
    taxonomyCode: string;
    status?: string;
}

export class Qualification {
    professionalDegreeCode: string;
    professionalDegreeSchool?: string;
    certificateNumber?: string;
    graduationYear?: number;
}

export class ContractedPartner {
    partnerName: string;
}

export class Facility {
    facilityId?: string;
    facilityName?: string;
    facilityType: string;
    practiceType: string;
    dhcsSiteId?: string;
    lastFsrDate?: string;
    email: string;
    phones: Phone[];
    hoursOfOperation: HoursOfOperation[];
    age?: Age;
    address: Address;
}

export class Phone {
    type: string;
    number: string;
}

export class HoursOfOperation {
    day: string;
    open: string;
    close: string;
}

export class Age {
    min: number;
    max: number;
}

export class Address {
    name?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    country?: string;
    state: string;
    zipCode: string;
}






