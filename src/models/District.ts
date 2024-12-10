import mongoose, { Schema, Document } from 'mongoose';

export interface DistrictDocument extends Document {
  district: string;
  phosphorus_level_ug_per_g: number;
  ph_value: number;
  nitrogen_level_percent: number;
  potassium_level_ug_per_g: number;
  average_rainfall: number;
  createdAt: Date;
  updatedAt: Date;
}

const DistrictSchema = new Schema<DistrictDocument>(
  {
    district: { type: String, required: true },
    phosphorus_level_ug_per_g: { type: Number, required: true },
    ph_value: { type: Number, required: true },
    nitrogen_level_percent: { type: Number, required: true },
    potassium_level_ug_per_g: { type: Number, required: true },
    average_rainfall: { type: Number, required: true },
  },
  { timestamps: true }
);

const District = mongoose.models.District || mongoose.model<DistrictDocument>('District', DistrictSchema);

export default District;




