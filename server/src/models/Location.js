const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    approximateCoordinates: {
      type: String,
      default: null,
    },
    evidenceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evidence',
      },
    ],
    timelineEventIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimelineEvent',
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
locationSchema.index({ caseId: 1 });

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;
