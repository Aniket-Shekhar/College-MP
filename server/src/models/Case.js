const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[a-z0-9-]+$/,
        'Slug can only contain lowercase letters, numbers, and hyphens',
      ],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['REAL_SOLVED', 'REAL_UNSOLVED', 'FICTIONAL'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD', 'EXPERT'],
      required: true,
    },
    status: {
      type: String,
      enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
      default: 'DRAFT',
    },
    estimatedMinutes: {
      type: Number,
      default: 30,
    },
    briefing: {
      type: String,
      required: true,
    },
    contentWarning: {
      type: String,
      default: null,
    },
    editorialNote: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    sourceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Source',
      },
    ],
    // Private solution data - never returned in public APIs
    solution: {
      type: {
        type: String,
        enum: ['PERSON', 'EVENT', 'CAUSE'],
        required: true,
      },
      acceptedAnswerIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
        },
      ],
      scoringVersion: {
        type: String,
        required: true,
        default: '1.0',
      },
      partialCreditRules: [
        {
          type: mongoose.Schema.Types.Mixed,
        },
      ],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
caseSchema.index({ slug: 1 }, { unique: true });
caseSchema.index({ status: 1 });
caseSchema.index({ category: 1 });
caseSchema.index({ difficulty: 1 });

/**
 * Instance method to return public case object (without solution)
 */
caseSchema.methods.toPublicObject = function () {
  const caseObj = this.toObject();
  delete caseObj.solution;
  return caseObj;
};

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
