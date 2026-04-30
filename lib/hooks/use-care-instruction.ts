import { toast } from "sonner";
import { UpdateCareInstructionRequest } from "@/types/care-instruction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCareInstruction,
  deleteCareInstruction,
  getCareInstructionById,
  getCareInstructions,
  updateCareInstruction,
} from "@/lib/api/care-instruction";

export const careInstructionKeys = {
  all: ["careInstructions"] as const,
  list: () => ["careInstructions"] as const,
  detail: (id: string) => ["careInstruction", id] as const,
};

export const useCareInstructions = () => {
  return useQuery({
    queryKey: careInstructionKeys.list(),
    queryFn: () => getCareInstructions(),
  });
};

export const useCareInstructionById = (id: string) => {
  return useQuery({
    queryKey: careInstructionKeys.detail(id),
    queryFn: () => getCareInstructionById(id),
    enabled: !!id,
  });
};

export const useCreateCareInstruction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCareInstruction,
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: careInstructionKeys.all });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useUpdateCareInstruction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCareInstructionRequest;
    }) => updateCareInstruction(id, data),
    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: careInstructionKeys.all });
      queryClient.invalidateQueries({
        queryKey: careInstructionKeys.detail(variables.id),
      });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};

export const useDeleteCareInstruction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCareInstruction(id),
    onSuccess: (response, id) => {
      queryClient.invalidateQueries({ queryKey: careInstructionKeys.all });
      queryClient.invalidateQueries({
        queryKey: careInstructionKeys.detail(id),
      });

      toast.success("Thành công", { description: response?.message });
    },
    onError: (error) => {
      toast.error("Có lỗi", { description: error?.message });
    },
  });
};
