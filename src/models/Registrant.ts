import mongoose, { Schema, models, model } from "mongoose";

export const MAX_REGISTRANTS = 50;

export interface IRegistrant {
  ticketId: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  checkedIn: boolean;
  checkedInAt?: Date;
  createdAt: Date;
}

const RegistrantSchema = new Schema<IRegistrant>(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    firstname: { type: String, required: true, trim: true },
    lastname: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    phone: { type: String, required: true, trim: true, unique: true },
    checkedIn: { type: Boolean, default: false },
    checkedInAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Registrant =
  models.Registrant || model<IRegistrant>("Registrant", RegistrantSchema);
