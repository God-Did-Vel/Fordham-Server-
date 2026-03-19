import mongoose from 'mongoose';
declare const Payment: mongoose.Model<{
    status: "pending" | "paid" | "unpaid" | "flagged";
    booking_id: mongoose.Types.ObjectId;
    amount: number;
    payment_method: string;
    receipt_url?: string | null;
    payment_date?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {}, {}, {}, mongoose.Document<unknown, {}, {
    status: "pending" | "paid" | "unpaid" | "flagged";
    booking_id: mongoose.Types.ObjectId;
    amount: number;
    payment_method: string;
    receipt_url?: string | null;
    payment_date?: NativeDate | null;
} & mongoose.DefaultTimestampProps, {}, {
    timestamps: true;
}> & {
    status: "pending" | "paid" | "unpaid" | "flagged";
    booking_id: mongoose.Types.ObjectId;
    amount: number;
    payment_method: string;
    receipt_url?: string | null;
    payment_date?: NativeDate | null;
} & mongoose.DefaultTimestampProps & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}, mongoose.Schema<any, mongoose.Model<any, any, any, any, any, any>, {}, {}, {}, {}, {
    timestamps: true;
}, {
    status: "pending" | "paid" | "unpaid" | "flagged";
    booking_id: mongoose.Types.ObjectId;
    amount: number;
    payment_method: string;
    receipt_url?: string | null;
    payment_date?: NativeDate | null;
} & mongoose.DefaultTimestampProps, mongoose.Document<unknown, {}, mongoose.FlatRecord<{
    status: "pending" | "paid" | "unpaid" | "flagged";
    booking_id: mongoose.Types.ObjectId;
    amount: number;
    payment_method: string;
    receipt_url?: string | null;
    payment_date?: NativeDate | null;
} & mongoose.DefaultTimestampProps>, {}, mongoose.MergeType<mongoose.DefaultSchemaOptions, {
    timestamps: true;
}>> & mongoose.FlatRecord<{
    status: "pending" | "paid" | "unpaid" | "flagged";
    booking_id: mongoose.Types.ObjectId;
    amount: number;
    payment_method: string;
    receipt_url?: string | null;
    payment_date?: NativeDate | null;
} & mongoose.DefaultTimestampProps> & {
    _id: mongoose.Types.ObjectId;
} & {
    __v: number;
}>>;
export default Payment;
//# sourceMappingURL=Payment.d.ts.map