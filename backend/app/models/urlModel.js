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
    lastAccessedAt: { type: Date, default: Date.now },
    urlExpiry: { type: Date, required: true },
    totalClicks: {
      type: Number,
      default: 0
    },
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
