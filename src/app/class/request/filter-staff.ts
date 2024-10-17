export interface FilterStaff {
      staffCode?: string;
      fullName?: string;
      gender?: string
      email?: string;
      address?: string;
      phoneNumber?: string;
      isActive?: number;
      [key: string]: any;
}
