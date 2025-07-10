import { ClientForm } from "@/components/create-client-modal/type";
import { PrimaryContact } from "@/services/clientService";

export const optionsForClient = [
  {
    value: "Lead",
    label: "Lead",
  },
  {
    value: "Engaged",
    label: "Engaged",
    children: [
      {
        value: "Calls",
        label: "Calls",
      },
      {
        value: "Profile Sent",
        label: "Profile Sent",
      },
      {
        value: "Contract Sent",
        label: "Contract Sent",
      },
      {
        value: "Attended a meeting",
        label: "Attended a meeting",
      },
      {
        value: "Replied to a message",
        label: "Replied to a message",
      },
      {
        value: "Contract Negotiation",
        label: "Contract Negotiation",
      }
    ]
  },
  {
    value: "Signed",
    label: "Signed",
  }
];

export const countryCodes = [
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+1", label: "+1 (USA)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+91", label: "+91 (India)" },
];

export const positionOptions = [
  { value: "HR", label: "HR" },
  { value: "Senior HR", label: "Senior HR" },
  { value: "Manager", label: "Manager" },
  { value: "HR Manager", label: "HR Manager" },
  { value: "Director", label: "Director" },
  { value: "Executive", label: "Executive" },
];

export const levelFieldMap: Record<string, { percentage: keyof ClientForm; notes: keyof ClientForm; money: keyof ClientForm; currency: keyof ClientForm; }> = {
  "Senior Level": { percentage: "seniorLevelPercentage", notes: "seniorLevelNotes", money: "seniorLevelMoney", currency: "seniorLevelCurrency" },
  "Executives": { percentage: "executivesPercentage", notes: "executivesNotes", money: "executivesMoney", currency: "executivesCurrency" },
  "Non-Executives": { percentage: "nonExecutivesPercentage", notes: "nonExecutivesNotes", money: "nonExecutivesMoney", currency: "nonExecutivesCurrency" },
  "Other": { percentage: "otherPercentage", notes: "otherNotes", money: "otherMoney", currency: "otherCurrency" },
};


export const clientSubStages = [ "Calls", "Profile Sent", "Contract Sent", "Attended a meeting", "Replied to a message", "Contract Negotiation" ];

export const levelValue = {
  percentage: 0,
  notes: ""
}

export const levelValueAdvance = {
  percentage: 0,
  notes: "",
  amount: 0,
  currency: "SAR"
}

export const businessInitialState = {
  contractStartDate: null,
  contractEndDate: null, 
  contractType: "",
  //fixed with advance
  fixedPercentage: 0,
  advanceMoneyCurrency: "SAR",
  advanceMoneyAmount: 0,
  fixedPercentageAdvanceNotes: "",

  //fixed without advance
  fixWithoutAdvanceValue: 0,
  fixWithoutAdvanceNotes: "",

  levelBasedHiring: {
    levelTypes: [],
    seniorLevel: { ...levelValue },
    executives: { ...levelValue },
    nonExecutives: { ...levelValue },
    other: { ...levelValue }
  },

  levelBasedAdvanceHiring: {
    levelTypes: [],
    seniorLevel: { ...levelValueAdvance },
    executives: { ...levelValueAdvance },
    nonExecutives: { ...levelValueAdvance },
    other: { ...levelValueAdvance }
  },
  
  contractDocument: null,
}

export const consultingInitialState = {
  contractStartDate: null,
  contractEndDate: null,
  technicalProposalDocument: null,
  financialProposalDocument: null,
  technicalProposalNotes: "",
  financialProposalNotes: "",
}

export const primaryContactInitialState = {
  firstName: "",
  lastName: "",
  gender: "",
  email: "",
  phone: "",
  countryCode: "+966",
  designation: "",
  linkedin: "",
  isPrimary: true,
}

export const outsourcingInitialState = {
  contractStartDate: null,
  contractEndDate: null,
  contractType: "",
  serviceCategory: "",
  numberOfResources: 0,
  durationPerResource: 0,
  slaTerms: "",
  totalCost: 0,
  contractDocument: null
}

export const clientGeneralInfoInitialState = {
  clientStage: undefined,
  salesLead: undefined,
  referredBy: undefined,
  clientPriority: undefined,
  clientSegment: undefined,
  clientSource: undefined,
  industry: undefined,
  clientSubStage: undefined,
}

export const clientContactInfoInitialstate = {
  name: "",
  emails: [],
  phoneNumber: "",
  address: "",
  website: "",
  linkedInProfile: "",
  location: "",
  googleMapsLink: "",
  countryOfBusiness: "",
  primaryContacts: [],
}

