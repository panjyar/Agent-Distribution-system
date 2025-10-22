import { Schema, model } from 'mongoose';

const distributedDataSchema = new Schema(
  {
    agentId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
      required: true,
    },
    agentName: {
      type: String,
      required: true,
    },
    agentEmail: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    distributedBy: {
      type: Schema.Types.ObjectId,
      refPath: 'distributedByModel',
      required: true,
    },
    distributedByModel: {
      type: String,
      required: true,
      enum: ['Admin', 'Agent'],
    },
    distributedByEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model('DistributedData', distributedDataSchema);