export interface FilterCoupon{
    couponsCode?: string;
    couponsName?: string;
    conditions?: string;
    couponsPrice?: number;
    quantity?: number ;
    startDate?: string;
    endDate?: string ;
    createdAt?: string;
    updatedAt?: string;
    isActive?: number;
    [key: string]: any;
}