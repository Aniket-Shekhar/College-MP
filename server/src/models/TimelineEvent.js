const mongoose = require('mongoose');

const timelineEventSchema = new mongoose.Schema(
  {
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    displayDate: {
      type: String,
      required: true,
    },
    evidenceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evidence',
      },
    ],
    personIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
      },
    ],
    locationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
    },
    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
timelineEventSchema.index({ caseId: 1 });
timelineEventSchema.index({ order: 1 });

const TimelineEvent = mongoose.model('TimelineEvent', timelineEventSchema);

module.exports = TimelineEvent;
