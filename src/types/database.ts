export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          key: string
          name: string
          xp_reward: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          key: string
          name: string
          xp_reward?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          key?: string
          name?: string
          xp_reward?: number | null
        }
        Relationships: []
      }
      adrs: {
        Row: {
          action_taken: string | null
          complaint: string
          created_at: string
          date: string
          id: string
          patient_id: string
          remarks: string | null
          severity: string
          updated_at: string
        }
        Insert: {
          action_taken?: string | null
          complaint: string
          created_at?: string
          date: string
          id?: string
          patient_id: string
          remarks?: string | null
          severity: string
          updated_at?: string
        }
        Update: {
          action_taken?: string | null
          complaint?: string
          created_at?: string
          date?: string
          id?: string
          patient_id?: string
          remarks?: string | null
          severity?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adrs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      attachments: {
        Row: {
          file_name: string
          file_type: Database["public"]["Enums"]["file_type"]
          file_url: string
          id: string
          patient_id: string
          uploaded_at: string
          uploaded_by: string
          visit_number: number
        }
        Insert: {
          file_name: string
          file_type: Database["public"]["Enums"]["file_type"]
          file_url: string
          id?: string
          patient_id: string
          uploaded_at?: string
          uploaded_by: string
          visit_number?: number
        }
        Update: {
          file_name?: string
          file_type?: Database["public"]["Enums"]["file_type"]
          file_url?: string
          id?: string
          patient_id?: string
          uploaded_at?: string
          uploaded_by?: string
          visit_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "attachments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          record_id: string
          table_name: string
          timestamp: string
          user_id: string
        }
        Insert: {
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          record_id: string
          table_name: string
          timestamp?: string
          user_id: string
        }
        Update: {
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          record_id?: string
          table_name?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      corrections: {
        Row: {
          comment: string
          created_at: string
          created_by: string
          crf_id: string
          id: string
          resolved_by: string | null
          section: string
          status: Database["public"]["Enums"]["correction_status"]
          updated_at: string
        }
        Insert: {
          comment: string
          created_at?: string
          created_by: string
          crf_id: string
          id?: string
          resolved_by?: string | null
          section: string
          status?: Database["public"]["Enums"]["correction_status"]
          updated_at?: string
        }
        Update: {
          comment?: string
          created_at?: string
          created_by?: string
          crf_id?: string
          id?: string
          resolved_by?: string | null
          section?: string
          status?: Database["public"]["Enums"]["correction_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "corrections_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corrections_crf_id_fkey"
            columns: ["crf_id"]
            isOneToOne: false
            referencedRelation: "crfs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "corrections_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crf_responses: {
        Row: {
          created_at: string
          field_key: string
          field_label: string
          field_type: string
          id: string
          response: string | null
          section_id: string
          updated_at: string
          visit_number: number
        }
        Insert: {
          created_at?: string
          field_key: string
          field_label: string
          field_type: string
          id?: string
          response?: string | null
          section_id: string
          updated_at?: string
          visit_number?: number
        }
        Update: {
          created_at?: string
          field_key?: string
          field_label?: string
          field_type?: string
          id?: string
          response?: string | null
          section_id?: string
          updated_at?: string
          visit_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "crf_responses_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "crf_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      crf_sections: {
        Row: {
          completed: boolean
          created_at: string
          crf_id: string
          id: string
          locked: boolean
          section_name: string
          section_order: number
          updated_at: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          crf_id: string
          id?: string
          locked?: boolean
          section_name: string
          section_order: number
          updated_at?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          crf_id?: string
          id?: string
          locked?: boolean
          section_name?: string
          section_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crf_sections_crf_id_fkey"
            columns: ["crf_id"]
            isOneToOne: false
            referencedRelation: "crfs"
            referencedColumns: ["id"]
          },
        ]
      }
      crfs: {
        Row: {
          approved: boolean
          created_at: string
          id: string
          locked: boolean
          patient_id: string
          status: Database["public"]["Enums"]["crf_status"]
          submitted: boolean
          template_version: string
          updated_at: string
        }
        Insert: {
          approved?: boolean
          created_at?: string
          id?: string
          locked?: boolean
          patient_id: string
          status?: Database["public"]["Enums"]["crf_status"]
          submitted?: boolean
          template_version?: string
          updated_at?: string
        }
        Update: {
          approved?: boolean
          created_at?: string
          id?: string
          locked?: boolean
          patient_id?: string
          status?: Database["public"]["Enums"]["crf_status"]
          submitted?: boolean
          template_version?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "crfs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: true
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_replies: {
        Row: {
          author_id: string | null
          body: string
          created_at: string | null
          discussion_id: string | null
          id: string
          upvote_count: number | null
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          upvote_count?: number | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          upvote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      discussions: {
        Row: {
          author_id: string | null
          body: string
          created_at: string | null
          id: string
          reply_count: number | null
          title: string
          topic_id: string | null
          updated_at: string | null
          upvote_count: number | null
        }
        Insert: {
          author_id?: string | null
          body: string
          created_at?: string | null
          id?: string
          reply_count?: number | null
          title: string
          topic_id?: string | null
          updated_at?: string | null
          upvote_count?: number | null
        }
        Update: {
          author_id?: string | null
          body?: string
          created_at?: string | null
          id?: string
          reply_count?: number | null
          title?: string
          topic_id?: string | null
          updated_at?: string | null
          upvote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussions_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      export_history: {
        Row: {
          created_at: string
          export_type: string
          id: string
          study_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          export_type: string
          id?: string
          study_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          export_type?: string
          id?: string
          study_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "export_history_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "export_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          created_at: string
          id: string
          patient_id: string
          status: Database["public"]["Enums"]["visit_status"]
          updated_at: string
          visit_date: string | null
          visit_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          patient_id: string
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string
          visit_date?: string | null
          visit_name: string
        }
        Update: {
          created_at?: string
          id?: string
          patient_id?: string
          status?: Database["public"]["Enums"]["visit_status"]
          updated_at?: string
          visit_date?: string | null
          visit_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      investigations: {
        Row: {
          created_at: string
          id: string
          investigation_name: string
          patient_id: string
          reference_range: string | null
          remarks: string | null
          result: string | null
          unit: string | null
          updated_at: string
          visit_number: number
        }
        Insert: {
          created_at?: string
          id?: string
          investigation_name: string
          patient_id: string
          reference_range?: string | null
          remarks?: string | null
          result?: string | null
          unit?: string | null
          updated_at?: string
          visit_number?: number
        }
        Update: {
          created_at?: string
          id?: string
          investigation_name?: string
          patient_id?: string
          reference_range?: string | null
          remarks?: string | null
          result?: string | null
          unit?: string | null
          updated_at?: string
          visit_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "investigations_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      mcqs: {
        Row: {
          correct_option: string
          created_at: string | null
          created_by: string | null
          difficulty: string | null
          explanation: string | null
          id: string
          is_verified: boolean | null
          options: Json
          question: string
          resource_id: string | null
          source: string | null
          topic_id: string | null
          upvote_count: number | null
        }
        Insert: {
          correct_option: string
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          explanation?: string | null
          id?: string
          is_verified?: boolean | null
          options: Json
          question: string
          resource_id?: string | null
          source?: string | null
          topic_id?: string | null
          upvote_count?: number | null
        }
        Update: {
          correct_option?: string
          created_at?: string | null
          created_by?: string | null
          difficulty?: string | null
          explanation?: string | null
          id?: string
          is_verified?: boolean | null
          options?: Json
          question?: string
          resource_id?: string | null
          source?: string | null
          topic_id?: string | null
          upvote_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mcqs_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcqs_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "mcqs_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      medications: {
        Row: {
          created_at: string
          dose: string | null
          duration: string | null
          frequency: string | null
          id: string
          med_type: string
          medicine: string
          patient_id: string
          reason: string | null
          updated_at: string
          visit_number: number
        }
        Insert: {
          created_at?: string
          dose?: string | null
          duration?: string | null
          frequency?: string | null
          id?: string
          med_type: string
          medicine: string
          patient_id: string
          reason?: string | null
          updated_at?: string
          visit_number?: number
        }
        Update: {
          created_at?: string
          dose?: string | null
          duration?: string | null
          frequency?: string | null
          id?: string
          med_type?: string
          medicine?: string
          patient_id?: string
          reason?: string | null
          updated_at?: string
          visit_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "medications_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          age: number
          created_at: string
          created_by: string
          gender: Database["public"]["Enums"]["gender"]
          hospital_cr_number: string
          id: string
          opd_number: string
          patient_name: string
          phone: string | null
          research_group_id: string
          status: Database["public"]["Enums"]["patient_status"]
          study_id: string
          study_patient_id: string
          updated_at: string
        }
        Insert: {
          age: number
          created_at?: string
          created_by: string
          gender: Database["public"]["Enums"]["gender"]
          hospital_cr_number: string
          id?: string
          opd_number: string
          patient_name: string
          phone?: string | null
          research_group_id: string
          status?: Database["public"]["Enums"]["patient_status"]
          study_id: string
          study_patient_id: string
          updated_at?: string
        }
        Update: {
          age?: number
          created_at?: string
          created_by?: string
          gender?: Database["public"]["Enums"]["gender"]
          hospital_cr_number?: string
          id?: string
          opd_number?: string
          patient_name?: string
          phone?: string | null
          research_group_id?: string
          status?: Database["public"]["Enums"]["patient_status"]
          study_id?: string
          study_patient_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "patients_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_research_group_id_fkey"
            columns: ["research_group_id"]
            isOneToOne: false
            referencedRelation: "research_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "patients_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_questions: {
        Row: {
          display_order: number
          id: string
          question: string
          question_type: string
          questionnaire_id: string
          required: boolean
        }
        Insert: {
          display_order: number
          id?: string
          question: string
          question_type: string
          questionnaire_id: string
          required?: boolean
        }
        Update: {
          display_order?: number
          id?: string
          question?: string
          question_type?: string
          questionnaire_id?: string
          required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_questions_questionnaire_id_fkey"
            columns: ["questionnaire_id"]
            isOneToOne: false
            referencedRelation: "questionnaires"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaire_responses: {
        Row: {
          answer: string | null
          created_at: string
          id: string
          patient_id: string
          question_id: string
          updated_at: string
          visit_number: number
        }
        Insert: {
          answer?: string | null
          created_at?: string
          id?: string
          patient_id: string
          question_id: string
          updated_at?: string
          visit_number?: number
        }
        Update: {
          answer?: string | null
          created_at?: string
          id?: string
          patient_id?: string
          question_id?: string
          updated_at?: string
          visit_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "questionnaire_responses_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questionnaire_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questionnaire_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questionnaires: {
        Row: {
          active: boolean
          created_at: string
          id: string
          questionnaire_name: string
          study_id: string
          version: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          questionnaire_name: string
          study_id: string
          version?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          questionnaire_name?: string
          study_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "questionnaires_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      research_groups: {
        Row: {
          created_at: string
          description: string | null
          group_name: string
          id: string
          study_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          group_name: string
          id?: string
          study_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string
          id?: string
          study_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_groups_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      resources: {
        Row: {
          ai_processed: boolean | null
          created_at: string | null
          file_size_bytes: number | null
          file_type: string | null
          id: string
          processing_status: string | null
          save_count: number | null
          storage_path: string
          title: string
          topic_id: string | null
          uploaded_by: string | null
          upvote_count: number | null
          visibility: string | null
        }
        Insert: {
          ai_processed?: boolean | null
          created_at?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          processing_status?: string | null
          save_count?: number | null
          storage_path: string
          title: string
          topic_id?: string | null
          uploaded_by?: string | null
          upvote_count?: number | null
          visibility?: string | null
        }
        Update: {
          ai_processed?: boolean | null
          created_at?: string | null
          file_size_bytes?: number | null
          file_type?: string | null
          id?: string
          processing_status?: string | null
          save_count?: number | null
          storage_path?: string
          title?: string
          topic_id?: string | null
          uploaded_by?: string | null
          upvote_count?: number | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resources_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resources_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      revision_log: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          mcq_score: number | null
          retention_delta: number | null
          revision_number: number | null
          scheduled_for: string
          status: string | null
          topic_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mcq_score?: number | null
          retention_delta?: number | null
          revision_number?: number | null
          scheduled_for: string
          status?: string | null
          topic_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          mcq_score?: number | null
          retention_delta?: number | null
          revision_number?: number | null
          scheduled_for?: string
          status?: string | null
          topic_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revision_log_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revision_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      revision_notes: {
        Row: {
          content: string
          created_at: string | null
          generated_by: string | null
          id: string
          model_used: string | null
          resource_id: string | null
          save_count: number | null
          topic_id: string | null
          visibility: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          generated_by?: string | null
          id?: string
          model_used?: string | null
          resource_id?: string | null
          save_count?: number | null
          topic_id?: string | null
          visibility?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          generated_by?: string | null
          id?: string
          model_used?: string | null
          resource_id?: string | null
          save_count?: number | null
          topic_id?: string | null
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revision_notes_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revision_notes_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revision_notes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_resources: {
        Row: {
          created_at: string | null
          id: string
          resource_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          resource_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          resource_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saved_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_resources_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          created_at: string | null
          id: string
          name: string
          sort_order: number | null
          syllabus_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          sort_order?: number | null
          syllabus_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          sort_order?: number | null
          syllabus_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sections_syllabus_id_fkey"
            columns: ["syllabus_id"]
            isOneToOne: false
            referencedRelation: "syllabi"
            referencedColumns: ["id"]
          },
        ]
      }
      studies: {
        Row: {
          co_guide_name: string | null
          created_at: string
          created_by: string
          department: string
          guide_name: string
          id: string
          sample_size: number
          scholar_name: string
          study_code: string
          study_status: Database["public"]["Enums"]["study_status"]
          study_title: string
          updated_at: string
        }
        Insert: {
          co_guide_name?: string | null
          created_at?: string
          created_by: string
          department: string
          guide_name: string
          id?: string
          sample_size: number
          scholar_name: string
          study_code: string
          study_status?: Database["public"]["Enums"]["study_status"]
          study_title: string
          updated_at?: string
        }
        Update: {
          co_guide_name?: string | null
          created_at?: string
          created_by?: string
          department?: string
          guide_name?: string
          id?: string
          sample_size?: number
          scholar_name?: string
          study_code?: string
          study_status?: Database["public"]["Enums"]["study_status"]
          study_title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "studies_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_investigators: {
        Row: {
          created_at: string
          id: string
          investigator_id: string
          study_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          investigator_id: string
          study_id: string
        }
        Update: {
          created_at?: string
          id?: string
          investigator_id?: string
          study_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_investigators_investigator_id_fkey"
            columns: ["investigator_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_investigators_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "studies"
            referencedColumns: ["id"]
          },
        ]
      }
      syllabi: {
        Row: {
          branch: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          branch: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          branch?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "syllabi_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          id: string
          setting: string
          value: string
        }
        Insert: {
          id?: string
          setting: string
          value: string
        }
        Update: {
          id?: string
          setting?: string
          value?: string
        }
        Relationships: []
      }
      test_attempts: {
        Row: {
          answers: Json
          attempted_at: string | null
          context: string | null
          id: string
          mcq_ids: string[]
          score: number
          topic_id: string | null
          user_id: string | null
        }
        Insert: {
          answers: Json
          attempted_at?: string | null
          context?: string | null
          id?: string
          mcq_ids: string[]
          score: number
          topic_id?: string | null
          user_id?: string | null
        }
        Update: {
          answers?: Json
          attempted_at?: string | null
          context?: string | null
          id?: string
          mcq_ids?: string[]
          score?: number
          topic_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_attempts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string | null
          id: string
          is_custom: boolean | null
          name: string
          section_id: string | null
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          name: string
          section_id?: string | null
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_custom?: boolean | null
          name?: string
          section_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_id: string | null
          earned_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          achievement_id?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string
          department: string | null
          email: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_topic_progress: {
        Row: {
          created_at: string | null
          id: string
          is_overdue: boolean | null
          knowledge_health: string | null
          last_studied_at: string | null
          level: number | null
          mcq_avg_score: number | null
          next_revision_at: string | null
          retention_score: number | null
          revision_count: number | null
          snooze_count: number | null
          topic_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_overdue?: boolean | null
          knowledge_health?: string | null
          last_studied_at?: string | null
          level?: number | null
          mcq_avg_score?: number | null
          next_revision_at?: string | null
          retention_score?: number | null
          revision_count?: number | null
          snooze_count?: number | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_overdue?: boolean | null
          knowledge_health?: string | null
          last_studied_at?: string | null
          level?: number | null
          mcq_avg_score?: number | null
          next_revision_at?: string | null
          retention_score?: number | null
          revision_count?: number | null
          snooze_count?: number | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_topic_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_topic_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          academic_rank_score: number | null
          avatar_url: string | null
          batch_year: number | null
          branch: string | null
          college: string | null
          contributor_rank_score: number | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          rcs_score: number | null
          updated_at: string | null
          xp_total: number | null
        }
        Insert: {
          academic_rank_score?: number | null
          avatar_url?: string | null
          batch_year?: number | null
          branch?: string | null
          college?: string | null
          contributor_rank_score?: number | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          rcs_score?: number | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Update: {
          academic_rank_score?: number | null
          avatar_url?: string | null
          batch_year?: number | null
          branch?: string | null
          college?: string | null
          contributor_rank_score?: number | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          rcs_score?: number | null
          updated_at?: string | null
          xp_total?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_knowledge_health: {
        Args: { retention: number }
        Returns: string
      }
      compute_rcs: { Args: { p_user_id: string }; Returns: number }
      decay_topic_retention: { Args: { p_utp_id: string }; Returns: undefined }
      investigator_study_ids: { Args: never; Returns: string[] }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      correction_status: "pending" | "resolved"
      crf_status:
        | "draft"
        | "submitted"
        | "correction_required"
        | "approved"
        | "locked"
      file_type: "pdf" | "png" | "jpeg" | "docx"
      gender: "male" | "female" | "other"
      patient_status: "active" | "completed" | "dropped" | "withdrawn"
      study_status: "active" | "completed" | "archived"
      user_role: "admin" | "investigator"
      visit_status: "scheduled" | "completed" | "missed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      correction_status: ["pending", "resolved"],
      crf_status: [
        "draft",
        "submitted",
        "correction_required",
        "approved",
        "locked",
      ],
      file_type: ["pdf", "png", "jpeg", "docx"],
      gender: ["male", "female", "other"],
      patient_status: ["active", "completed", "dropped", "withdrawn"],
      study_status: ["active", "completed", "archived"],
      user_role: ["admin", "investigator"],
      visit_status: ["scheduled", "completed", "missed"],
    },
  },
} as const
