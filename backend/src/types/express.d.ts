// Declaration merging untuk menambahkan property `user` ke Express Request
declare namespace Express {
    interface Request {
        user?: {
            userId: string;
            nik: string;
            role: string;
        };
    }
}
