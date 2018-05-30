import { TestBed, inject } from '@angular/core/testing';

import { DegreeautosearchService } from './degreeautosearch.service';

describe('DegreeautosearchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DegreeautosearchService]
    });
  });

  it('should be created', inject([DegreeautosearchService], (service: DegreeautosearchService) => {
    expect(service).toBeTruthy();
  }));
});
