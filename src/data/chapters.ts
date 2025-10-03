export type Chapter = {
  name: string;
  region: string;
  focus: string;
  contactEmail: string;
  isAcceptingMembers: boolean;
};

export const chapters: Chapter[] = [
  {
    name: 'Midwest Regional Chapter',
    region: 'Des Moines, Iowa, USA',
    focus: 'Precision agriculture trials and soil carbon monitoring',
    contactEmail: 'midwest@agronomyclub.org',
    isAcceptingMembers: true,
  },
  {
    name: 'California Cooperative',
    region: 'Fresno, California, USA',
    focus: 'Water stewardship, specialty crops, and agtech partnerships',
    contactEmail: 'california@agronomyclub.org',
    isAcceptingMembers: true,
  },
  {
    name: 'Atlantic Coast Chapter',
    region: 'Raleigh, North Carolina, USA',
    focus: 'Coastal soil health advocacy and policy briefings',
    contactEmail: 'atlantic@agronomyclub.org',
    isAcceptingMembers: false,
  },
  {
    name: 'Prairie Research Collective',
    region: 'Regina, Saskatchewan, Canada',
    focus: 'Drought-resilient cropping systems and regenerative grazing',
    contactEmail: 'prairie@agronomyclub.org',
    isAcceptingMembers: true,
  },
  {
    name: 'Sahel Innovation Hub',
    region: 'Dakar, Senegal',
    focus: 'Climate adaptation, millet intercropping, and community seed banks',
    contactEmail: 'sahel@agronomyclub.org',
    isAcceptingMembers: true,
  },
]
