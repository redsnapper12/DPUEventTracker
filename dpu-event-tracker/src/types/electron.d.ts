export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  preferredName: string,
  phoneNumber: string;
  email: string;
  classYear: string;
  tag: "Banned" | "Underaged" | "Greek President" | null;
}

declare global {
  interface Window {
    electronAPI: {
      db: {
        isConfigured: () => Promise<{ success: boolean; data?: boolean }>;
        promptForFile: () => Promise<{ success: boolean }>;
        reset: () => Promise<{ success: boolean }>;
        getAllStudents: () => Promise<{ success: boolean; data?: Student[] }>;
        searchStudents: (
          term: string
        ) => Promise<{ success: boolean; data?: Student[] }>;
      };
    };
  }
}

export {};
