export default interface CareInstructionResponse {
  id: string;
  lightRequirement: string;
  wateringFrequency: string;
  temperature: string;
  soil: string;
  notes: string;
  createdAtUtc: Date;
  updatedAtUtc: Date;
}
