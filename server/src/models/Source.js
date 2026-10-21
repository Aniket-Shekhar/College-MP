const mongoose = require('mongoose');

const sourceSchema = new mongoose.Schema(
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
    publisher: {
      type: String,
      default: null,
    },
    url: {
      type: String,
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    accessedAt: {
      type: Date,
      default: Date.now,
    },
    sourceType: {
      type: String,
      enum: [
        'OFFICIAL',
        'REPUTABLE_NEWS',
        'BOOK',
        'ARCHIVE',
        'PUBLIC_RECORD',
        'OTHER',
      ],
      default: 'OTHER',
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
sourceSchema.index({ caseId: 1 });

const Source = mongoose.model('Source', sourceSchema);

module.exports = Source;
