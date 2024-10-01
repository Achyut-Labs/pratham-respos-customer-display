export interface MediaSettings {
  restaurantId: number
  size: number
  group: number
}

export interface GetFilesParams {
  restaurant_id: number,
  aspect_ratio_id: number,
  group_ids: number[]
}
export interface CustomerDisplayGroupType {
  id: number;
  type: string;
}

export interface CustomerDisplayGroupOtm {
  group_id: number;
  customer_display_group_types: CustomerDisplayGroupType;
}

export interface AspectRatio {
  id: number;
  aspect_ratio: string;
}

export interface MediaFile {
  id: number;
  file_name: string;
  file_path: string;
  aspect_ratios: AspectRatio;
  file_type: string;
  storage_type: number;
  uploaded_at: string;
  uploaded_by: string;
  customer_display_group_otm: CustomerDisplayGroupOtm[];
}

export type files = MediaFile[] | null


