export type VerificationCheckId =
  | 'originality'
  | 'authenticity'
  | 'safety'
  | 'human_rights'
  | 'relevance';

export type CheckStatus = 'waiting' | 'checking' | 'passed' | 'failed';

export type OverallStatus = 'idle' | 'checking' | 'passed' | 'failed' | 'error';

export interface VerificationCheck {
  id: VerificationCheckId;
  label: string;
  description: string;
  status: CheckStatus;
  statusMessage?: string;
  passedMessage: string;
  failedMessage?: string;
}

export type SimulationScenario =
  | 'pass'
  | 'fail_originality'
  | 'fail_authenticity'
  | 'fail_safety'
  | 'fail_relevance'
  | 'error';

export interface VerificationFailureDetails {
  checkId: VerificationCheckId;
  checkLabel: string;
  issue: string;
  explanation: string;
}

export interface SupportTicketData {
  issueType: string;
  videoName: string;
  failedCategory: string;
  aiExplanation: string;
  additionalDetails: string;
}
