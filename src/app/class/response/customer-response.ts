export class CustomerResponse {
    id: string = '';
    customerCode:  string = '';
    fullName:  string = '';
    gender:  string = '';
    birthday: string= '';
    phoneNumber:  string = '';
    address:  string = '';
    email:  string = '';
    accumulatedPoints: number = 0;
    created_at: Date = new Date;
    updated_at: Date = new Date;
}
