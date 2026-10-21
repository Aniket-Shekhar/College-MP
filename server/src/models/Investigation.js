const mongoose = require('mongoose');

const investigationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    caseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Case',
      required: true,
    },
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'COMPLETED', 'ABANDONED'],
      default: 'IN_PROGRESS',
    },
    attemptNumber: {
      type: Number,
      default: 1,
    },
    startedAt: {
      type: Date,
      default: Date.now,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    discoveredEvidenceIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Evidence',
      },
    ],
    board: {
      nodes: [
        {
          id: String,
          type: String,
          position: {
            x: Number,
            y: Number,
          },
          data: {
            evidenceId: mongoose.Schema.Types.ObjectId,
            title: String,
            notes: String,
          },
        },
      ],
      edges: [
        {
          id: String,
          source: String,
          target: String,
          type: String,
          label: String,
          data: {
            relationshipType: String,
          },
        },
      ],
      groups: [
        {
          id: String,
          label: String,
          nodeIds: [String],
        },
      ],
      version: {
        type: String,
        default: '1.0',
      },
    },
    hypotheses: [
      {
        title: String,
        explanation: String,
        supportingEvidenceIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Evidence',
          },
        ],
        contradictoryEvidenceIds: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Evidence',
          },
        ],
        confidence: {
          type: Number,
          min: 0,
          max: 100,
          default: 50,
        },
      },
    ],
    conclusion: {
      answerId: {
        type: mongoose.Schema.Types.ObjectId,
      },
      explanation: String,
      selectedEvidenceIds: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Evidence',
        },
      ],
    },
    score: {
      total: {
        type: Number,
        default: 0,
      },
      evidence: {
        type: Number,
        default: 0,
      },
      conclusion: {
        type: Number,
        default: 0,
      },
      reasoning: {
        type: Number,
        default: 0,
      },
      scoringVersion: {
        type: String,
        default: '1.0',
      },
    },
    hintsUsed: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
investigationSchema.index({ userId: 1 });
investigationSchema.index({ caseId: 1 });
investigationSchema.index({ userId: 1, caseId: 1 });
investigationSchema.index({ status: 1 });

const Investigation = mongoose.model('Investigation', investigationSchema);

module.exports = Investigation;
