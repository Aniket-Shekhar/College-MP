const mongoose = require('mongoose');

const witnessStatementSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Person',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    statement: {
      type: String,
      required: true,
    },
    dateLabel: {
      type: String,
      required: true,
    },
    evidenceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evidence',
      },
    ],
    sourceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
witnessStatementSchema.index({ caseId: 1 });
witnessStatementSchema.index({ personId: 1 });

const WitnessStatement = mongoose.model(
  'WitnessStatement',
  witnessStatementSchema
);

module.exports = WitnessStatement;
