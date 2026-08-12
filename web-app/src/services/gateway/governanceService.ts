import { apiFetch } from "@/services/api/httpClient";
import { ApiResponse } from "@/models/ApiResponse";
import { ComplianceEvidenceRecord, CustomerComplaint, RegulatoryRequirement } from "@/models/GatewayModels";
import { endpoints } from "@/services/api/endpoints";

export const governanceService = {
  listRequirements: async (): Promise<ApiResponse<RegulatoryRequirement[]>> => {
    return apiFetch<ApiResponse<RegulatoryRequirement[]>>(endpoints.governance.requirements);
  },

  listEvidence: async (): Promise<ApiResponse<ComplianceEvidenceRecord[]>> => {
    return apiFetch<ApiResponse<ComplianceEvidenceRecord[]>>(endpoints.governance.evidence);
  },

  generateEvidence: async (
    requirementId: string,
    evidenceType: string,
    description: string
  ): Promise<ApiResponse<ComplianceEvidenceRecord>> => {
    return apiFetch<ApiResponse<ComplianceEvidenceRecord>>(
      endpoints.governance.generateEvidence(requirementId),
      {
        method: "POST",
        body: JSON.stringify({ evidenceType, description }),
      }
    );
  },

  listComplaints: async (): Promise<ApiResponse<CustomerComplaint[]>> => {
    return apiFetch<ApiResponse<CustomerComplaint[]>>(endpoints.gateway.complaints.list);
  },

  resolveComplaint: async (
    complaintRef: string,
    resolutionNotes: string
  ): Promise<ApiResponse<CustomerComplaint>> => {
    return apiFetch<ApiResponse<CustomerComplaint>>(
      endpoints.gateway.complaints.resolve(complaintRef),
      {
        method: "POST",
        body: JSON.stringify({ resolutionNotes }),
      }
    );
  },
};
