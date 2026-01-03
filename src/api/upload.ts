import { IUploadResponse } from "@/interface/auth";

export const uploadApi = {
  image: async (formData: FormData): Promise<IUploadResponse> => {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    return response.json();
  }
};
