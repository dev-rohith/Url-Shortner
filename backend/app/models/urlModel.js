import { Schema, model } from "mongoose";

const urlSchema = new Schema(
  {
    longUrl: { type: String, required: true },
    sortUrl: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, required: true },
    country: {
      type: Map,
      of: Number,
      default: {},
      select: false,
    },
    device: {
      type: Map,
      of: Number,
      default: {},
      select: false,
    },
    lastAccessedAt: { type: Date, default: Date.now, select: false },
    urlExpiry: { type: Date, required: true },
    locations: {
     type: [
      {
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
    }
    ]}
  },
  { timestamps: true }
);

const Url = model("Url", urlSchema);

export default Url;
