export interface Comment {
    managerId: string;
    comment: string;
    createdAt: string;
}
export interface Order {
    _id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
    age: number;
    course: string;
    course_format: string;
    course_type: string;
    sum: number | null;
    already_paid: boolean | null;
    created_at: string;
    utm: string;
    msg: string | null;
    status: string | null;
    group: string | null;
    manager: string | null;
    comments: Comment[];
}

export interface PaginationResult {
    currentData: Order[];
    totalPages: number;
}
