import {
  CreateCareInstructionRequestValidation,
  UpdateCareInstructionRequestValidation,
} from "@/validations/care-instruction";
import z from "zod";

export interface CareInstructionResponse {
  id: string;
  lightRequirement: string;
  wateringFrequency: string;
  temperature: string;
  soil: string;
  notes: string;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}

export type CreateCareInstructionRequest = z.infer<
  typeof CreateCareInstructionRequestValidation
>;
export type UpdateCareInstructionRequest = z.infer<
  typeof UpdateCareInstructionRequestValidation
>;
