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
  },
  {
    timestamps: true,
  }
);

export default model('DistributedData', distributedDataSchema);