const mongoose = require('mongoose');

const evidenceSchema = new mongoose.Schema(
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
    type: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    fullContent: {
      type: String,
      required: true,
    },
    importance: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH'],
      default: 'MEDIUM',
    },
    discoveryWeight: {
      type: Number,
      default: 5,
      min: 0,
      max: 10,
    },
    // Private field - never returned in public APIs
    isHidden: {
      type: Boolean,
      default: false,
    },
    // Private field - never returned in public APIs
    unlockConditions: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    relatedPersonIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Person',
      },
    ],
    relatedTimelineEventIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TimelineEvent',
      },
    ],
    relatedLocationIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
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
evidenceSchema.index({ caseId: 1 });

/**
 * Instance method to return public evidence object (without isHidden and unlockConditions)
 */
evidenceSchema.methods.toPublicObject = function () {
  const evidenceObj = this.toObject();
  delete evidenceObj.isHidden;
  delete evidenceObj.unlockConditions;
  return evidenceObj;
};

const Evidence = mongoose.model('Evidence', evidenceSchema);

module.exports = Evidence;
