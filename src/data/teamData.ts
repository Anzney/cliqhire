// Dummy team data with hierarchical structure
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  teamSize?: number;
}

export interface RecruitmentManager extends TeamMember {
  teamSize: number;
}

export interface TeamLead extends TeamMember {
  managerId: string;
  teamSize: number;
}

export interface Recruiter extends TeamMember {
  teamLeadId: string;
}

export const recruitmentManagers: RecruitmentManager[] = [
  {
    id: "rm1",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1-555-0101",
    teamSize: 12,
  },
  {
    id: "rm2",
    name: "Michael Chen",
    email: "michael.chen@company.com",
    phone: "+1-555-0102",
    teamSize: 8,
  },
  {
    id: "rm3",
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    phone: "+1-555-0103",
    teamSize: 15,
  },
  {
    id: "rm4",
    name: "David Wilson",
    email: "david.wilson@company.com",
    phone: "+1-555-0104",
    teamSize: 10,
  },
  {
    id: "rm5",
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    phone: "+1-555-0105",
    teamSize: 6,
  },
];

export const teamLeads: TeamLead[] = [
  // Sarah Johnson's team leads
  {
    id: "tl1",
    name: "Alex Kumar",
    email: "alex.kumar@company.com",
    phone: "+1-555-0201",
    managerId: "rm1",
    teamSize: 4,
  },
  {
    id: "tl2",
    name: "Jessica Park",
    email: "jessica.park@company.com",
    phone: "+1-555-0202",
    managerId: "rm1",
    teamSize: 5,
  },
  {
    id: "tl3",
    name: "Robert Taylor",
    email: "robert.taylor@company.com",
    phone: "+1-555-0203",
    managerId: "rm1",
    teamSize: 3,
  },

  // Michael Chen's team leads
  {
    id: "tl4",
    name: "Amanda Foster",
    email: "amanda.foster@company.com",
    phone: "+1-555-0204",
    managerId: "rm2",
    teamSize: 4,
  },
  {
    id: "tl5",
    name: "Ryan Mitchell",
    email: "ryan.mitchell@company.com",
    phone: "+1-555-0205",
    managerId: "rm2",
    teamSize: 4,
  },

  // Emily Rodriguez's team leads
  {
    id: "tl6",
    name: "Sophia Lee",
    email: "sophia.lee@company.com",
    phone: "+1-555-0206",
    managerId: "rm3",
    teamSize: 6,
  },
  {
    id: "tl7",
    name: "Marcus Johnson",
    email: "marcus.johnson@company.com",
    phone: "+1-555-0207",
    managerId: "rm3",
    teamSize: 5,
  },
  {
    id: "tl8",
    name: "Rachel Green",
    email: "rachel.green@company.com",
    phone: "+1-555-0208",
    managerId: "rm3",
    teamSize: 4,
  },

  // David Wilson's team leads
  {
    id: "tl9",
    name: "Kevin Brown",
    email: "kevin.brown@company.com",
    phone: "+1-555-0209",
    managerId: "rm4",
    teamSize: 5,
  },
  {
    id: "tl10",
    name: "Natalie Davis",
    email: "natalie.davis@company.com",
    phone: "+1-555-0210",
    managerId: "rm4",
    teamSize: 5,
  },

  // Lisa Thompson's team leads
  {
    id: "tl11",
    name: "Chris Anderson",
    email: "chris.anderson@company.com",
    phone: "+1-555-0211",
    managerId: "rm5",
    teamSize: 3,
  },
  {
    id: "tl12",
    name: "Maya Patel",
    email: "maya.patel@company.com",
    phone: "+1-555-0212",
    managerId: "rm5",
    teamSize: 3,
  },
];

export const recruiters: Recruiter[] = [
  // Alex Kumar's recruiters (tl1)
  {
    id: "r1",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1-555-0301",
    teamLeadId: "tl1",
  },
  {
    id: "r2",
    name: "Emma Wilson",
    email: "emma.wilson@company.com",
    phone: "+1-555-0302",
    teamLeadId: "tl1",
  },
  {
    id: "r3",
    name: "James Brown",
    email: "james.brown@company.com",
    phone: "+1-555-0303",
    teamLeadId: "tl1",
  },
  {
    id: "r4",
    name: "Olivia Davis",
    email: "olivia.davis@company.com",
    phone: "+1-555-0304",
    teamLeadId: "tl1",
  },

  // Jessica Park's recruiters (tl2)
  {
    id: "r5",
    name: "William Garcia",
    email: "william.garcia@company.com",
    phone: "+1-555-0305",
    teamLeadId: "tl2",
  },
  {
    id: "r6",
    name: "Ava Martinez",
    email: "ava.martinez@company.com",
    phone: "+1-555-0306",
    teamLeadId: "tl2",
  },
  {
    id: "r7",
    name: "Benjamin Lee",
    email: "benjamin.lee@company.com",
    phone: "+1-555-0307",
    teamLeadId: "tl2",
  },
  {
    id: "r8",
    name: "Mia Rodriguez",
    email: "mia.rodriguez@company.com",
    phone: "+1-555-0308",
    teamLeadId: "tl2",
  },
  {
    id: "r9",
    name: "Lucas Taylor",
    email: "lucas.taylor@company.com",
    phone: "+1-555-0309",
    teamLeadId: "tl2",
  },

  // Robert Taylor's recruiters (tl3)
  {
    id: "r10",
    name: "Charlotte Moore",
    email: "charlotte.moore@company.com",
    phone: "+1-555-0310",
    teamLeadId: "tl3",
  },
  {
    id: "r11",
    name: "Henry Jackson",
    email: "henry.jackson@company.com",
    phone: "+1-555-0311",
    teamLeadId: "tl3",
  },
  {
    id: "r12",
    name: "Amelia White",
    email: "amelia.white@company.com",
    phone: "+1-555-0312",
    teamLeadId: "tl3",
  },

  // Amanda Foster's recruiters (tl4)
  {
    id: "r13",
    name: "Alexander Harris",
    email: "alexander.harris@company.com",
    phone: "+1-555-0313",
    teamLeadId: "tl4",
  },
  {
    id: "r14",
    name: "Harper Clark",
    email: "harper.clark@company.com",
    phone: "+1-555-0314",
    teamLeadId: "tl4",
  },
  {
    id: "r15",
    name: "Daniel Lewis",
    email: "daniel.lewis@company.com",
    phone: "+1-555-0315",
    teamLeadId: "tl4",
  },
  {
    id: "r16",
    name: "Ella Robinson",
    email: "ella.robinson@company.com",
    phone: "+1-555-0316",
    teamLeadId: "tl4",
  },

  // Ryan Mitchell's recruiters (tl5)
  {
    id: "r17",
    name: "Matthew Walker",
    email: "matthew.walker@company.com",
    phone: "+1-555-0317",
    teamLeadId: "tl5",
  },
  {
    id: "r18",
    name: "Sofia Hall",
    email: "sofia.hall@company.com",
    phone: "+1-555-0318",
    teamLeadId: "tl5",
  },
  {
    id: "r19",
    name: "Jackson Allen",
    email: "jackson.allen@company.com",
    phone: "+1-555-0319",
    teamLeadId: "tl5",
  },
  {
    id: "r20",
    name: "Avery Young",
    email: "avery.young@company.com",
    phone: "+1-555-0320",
    teamLeadId: "tl5",
  },

  // Continue with more recruiters for other team leads...
  // Sophia Lee's recruiters (tl6)
  {
    id: "r21",
    name: "Sebastian King",
    email: "sebastian.king@company.com",
    phone: "+1-555-0321",
    teamLeadId: "tl6",
  },
  {
    id: "r22",
    name: "Luna Wright",
    email: "luna.wright@company.com",
    phone: "+1-555-0322",
    teamLeadId: "tl6",
  },
  {
    id: "r23",
    name: "Owen Lopez",
    email: "owen.lopez@company.com",
    phone: "+1-555-0323",
    teamLeadId: "tl6",
  },
  {
    id: "r24",
    name: "Grace Hill",
    email: "grace.hill@company.com",
    phone: "+1-555-0324",
    teamLeadId: "tl6",
  },
  {
    id: "r25",
    name: "Carter Scott",
    email: "carter.scott@company.com",
    phone: "+1-555-0325",
    teamLeadId: "tl6",
  },
  {
    id: "r26",
    name: "Zoe Green",
    email: "zoe.green@company.com",
    phone: "+1-555-0326",
    teamLeadId: "tl6",
  },
];

// Helper functions to get related data
export const getTeamLeadsByManager = (managerId: string): TeamLead[] => {
  return teamLeads.filter((tl) => tl.managerId === managerId);
};

export const getRecruitersByTeamLead = (teamLeadId: string): Recruiter[] => {
  return recruiters.filter((r) => r.teamLeadId === teamLeadId);
};

export const getRecruitmentManagerById = (id: string): RecruitmentManager | undefined => {
  return recruitmentManagers.find((rm) => rm.id === id);
};

export const getTeamLeadById = (id: string): TeamLead | undefined => {
  return teamLeads.find((tl) => tl.id === id);
};

export const getRecruiterById = (id: string): Recruiter | undefined => {
  return recruiters.find((r) => r.id === id);
};
