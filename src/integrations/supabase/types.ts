export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      galangan: {
        Row: {
          created_at: string
          id: string
          jenis_kapal: string
          nama_kapal: string
          nilai_kontrak: number
          pemilik: string
          status: string
          tanggal_mulai: string
          tanggal_target: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          jenis_kapal: string
          nama_kapal: string
          nilai_kontrak?: number
          pemilik: string
          status?: string
          tanggal_mulai: string
          tanggal_target?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          jenis_kapal?: string
          nama_kapal?: string
          nilai_kontrak?: number
          pemilik?: string
          status?: string
          tanggal_mulai?: string
          tanggal_target?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      lunas: {
        Row: {
          created_at: string
          galangan_id: string | null
          id: string
          keterangan: string | null
          sisa_bayar: number | null
          tanggal_lunas: string
          total_bayar: number
        }
        Insert: {
          created_at?: string
          galangan_id?: string | null
          id?: string
          keterangan?: string | null
          sisa_bayar?: number | null
          tanggal_lunas?: string
          total_bayar: number
        }
        Update: {
          created_at?: string
          galangan_id?: string | null
          id?: string
          keterangan?: string | null
          sisa_bayar?: number | null
          tanggal_lunas?: string
          total_bayar?: number
        }
        Relationships: [
          {
            foreignKeyName: "lunas_galangan_id_fkey"
            columns: ["galangan_id"]
            isOneToOne: false
            referencedRelation: "galangan"
            referencedColumns: ["id"]
          },
        ]
      }
      setor: {
        Row: {
          created_at: string
          galangan_id: string | null
          id: string
          jumlah: number
          keterangan: string | null
          tanggal_setor: string
        }
        Insert: {
          created_at?: string
          galangan_id?: string | null
          id?: string
          jumlah: number
          keterangan?: string | null
          tanggal_setor?: string
        }
        Update: {
          created_at?: string
          galangan_id?: string | null
          id?: string
          jumlah?: number
          keterangan?: string | null
          tanggal_setor?: string
        }
        Relationships: [
          {
            foreignKeyName: "setor_galangan_id_fkey"
            columns: ["galangan_id"]
            isOneToOne: false
            referencedRelation: "galangan"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
