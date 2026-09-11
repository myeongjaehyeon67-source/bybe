export type ProjectStatus = "planning" | "building" | "completed" | "archived";
export type FeaturePriority = "high" | "medium" | "low";
export type FeatureStatus = "todo" | "doing" | "done";
export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "doing" | "done";

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string;
          original_idea: string;
          problem: string | null;
          target_user: string | null;
          value_proposition: string | null;
          mvp_summary: string | null;
          platform: string | null;
          experience_level: string | null;
          status: ProjectStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string;
          original_idea: string;
          problem?: string | null;
          target_user?: string | null;
          value_proposition?: string | null;
          mvp_summary?: string | null;
          platform?: string | null;
          experience_level?: string | null;
          status?: ProjectStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Insert"]>;
      };
      features: {
        Row: {
          id: string;
          project_id: string;
          title: string;
          description: string;
          priority: FeaturePriority;
          included_in_mvp: boolean;
          status: FeatureStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          title: string;
          description?: string;
          priority?: FeaturePriority;
          included_in_mvp?: boolean;
          status?: FeatureStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["features"]["Insert"]>;
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          feature_id: string | null;
          title: string;
          description: string;
          priority: TaskPriority;
          status: TaskStatus;
          acceptance_criteria: string[];
          ai_coding_prompt: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          feature_id?: string | null;
          title: string;
          description?: string;
          priority?: TaskPriority;
          status?: TaskStatus;
          acceptance_criteria?: string[];
          ai_coding_prompt?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["tasks"]["Insert"]>;
      };
    };
  };
}

export type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
export type FeatureRow = Database["public"]["Tables"]["features"]["Row"];
export type TaskRow = Database["public"]["Tables"]["tasks"]["Row"];
