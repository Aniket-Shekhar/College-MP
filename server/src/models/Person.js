const mongoose = require('mongoose');

const personSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    statusLabel: {
      type: String,
      default: null,
    },
    evidenceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evidence',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
personSchema.index({ caseId: 1 });

const Person = mongoose.model('Person', personSchema);

module.exports = Person;
