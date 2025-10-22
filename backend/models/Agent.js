import { Schema, model } from 'mongoose';
import { genSalt, hash, compare } from 'bcryptjs';

const agentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    mobile: {
      type: String,
      required: [true, 'Please add a mobile number'],
      unique: true,
      trim: true,
      match: [/^\+\d{1,4}\d{7,15}$/, 'Please add a valid mobile number with country code'],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    createdByModel: {
      type: String,
      required: true,
      enum: ['Admin', 'Agent'],
      default: 'Admin'
    },
    parentAgent: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
agentSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

// Match password method
agentSchema.methods.matchPassword = async function (enteredPassword) {
  return await compare(enteredPassword, this.password);
};

export default model('Agent', agentSchema);