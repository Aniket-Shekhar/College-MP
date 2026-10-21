const Investigation = require('../models/Investigation');
const Case = require('../models/Case');
const Evidence = require('../models/Evidence');

/**
 * Create a new investigation
 */
const createInvestigation = async (userId, caseId) => {
  try {
    // Verify case exists and is published
    const caseData = await Case.findOne({
      _id: caseId,
      status: 'PUBLISHED',
    });

    if (!caseData) {
      return { success: false, error: 'CASE_NOT_FOUND' };
    }

    // Check for existing in-progress investigations
    const existingInvestigation = await Investigation.findOne({
      userId,
      caseId,
      status: 'IN_PROGRESS',
    });

    if (existingInvestigation) {
      return {
        success: false,
        error: 'INVESTIGATION_EXISTS',
        investigation: existingInvestigation,
      };
    }

    // Get next attempt number
    const attemptCount = await Investigation.countDocuments({
      userId,
      caseId,
    });

    const investigation = new Investigation({
      userId,
      caseId,
      status: 'IN_PROGRESS',
      attemptNumber: attemptCount + 1,
      startedAt: new Date(),
    });

    await investigation.save();

    return { success: true, investigation };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get investigation by ID
 */
const getInvestigationById = async (investigationId, userId) => {
  try {
    const investigation = await Investigation.findById(investigationId);

    if (!investigation) {
      return { success: false, error: 'INVESTIGATION_NOT_FOUND' };
    }

    // Verify ownership
    if (investigation.userId.toString() !== userId.toString()) {
      return { success: false, error: 'FORBIDDEN' };
    }

    return { success: true, investigation };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get user's investigations for a case
 */
const getUserInvestigationsForCase = async (userId, caseId) => {
  try {
    const investigations = await Investigation.find({
      userId,
      caseId,
    }).sort({ createdAt: -1 });

    return { success: true, investigations };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Get all user investigations
 */
const getUserInvestigations = async (userId) => {
  try {
    const investigations = await Investigation.find({ userId })
      .populate('caseId', 'slug title shortDescription')
      .sort({ createdAt: -1 });

    return { success: true, investigations };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Update investigation (autosave)
 */
const updateInvestigation = async (investigationId, userId, updates) => {
  try {
    const investigation = await Investigation.findById(investigationId);

    if (!investigation) {
      return { success: false, error: 'INVESTIGATION_NOT_FOUND' };
    }

    // Verify ownership
    if (investigation.userId.toString() !== userId.toString()) {
      return { success: false, error: 'FORBIDDEN' };
    }

    // Cannot update completed investigations
    if (investigation.status === 'COMPLETED') {
      return { success: false, error: 'INVESTIGATION_COMPLETED' };
    }

    // Allowed updates: discoveredEvidenceIds, board, hypotheses
    const allowedUpdates = [
      'discoveredEvidenceIds',
      'board',
      'hypotheses',
      'conclusion',
    ];

    const filteredUpdates = {};
    allowedUpdates.forEach((field) => {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    });

    Object.assign(investigation, filteredUpdates);
    await investigation.save();

    return { success: true, investigation };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Discover evidence
 */
const discoverEvidence = async (investigationId, userId, evidenceId) => {
  try {
    const investigation = await Investigation.findById(investigationId);

    if (!investigation) {
      return { success: false, error: 'INVESTIGATION_NOT_FOUND' };
    }

    // Verify ownership
    if (investigation.userId.toString() !== userId.toString()) {
      return { success: false, error: 'FORBIDDEN' };
    }

    // Cannot modify completed investigations
    if (investigation.status === 'COMPLETED') {
      return { success: false, error: 'INVESTIGATION_COMPLETED' };
    }

    // Verify evidence belongs to case
    const evidence = await Evidence.findOne({
      _id: evidenceId,
      caseId: investigation.caseId,
    });

    if (!evidence) {
      return { success: false, error: 'EVIDENCE_NOT_FOUND' };
    }

    // Check if evidence is hidden
    if (evidence.isHidden) {
      // Check unlock conditions (simplified for MVP - always deny hidden evidence)
      return { success: false, error: 'EVIDENCE_HIDDEN' };
    }

    // Add to discovered evidence if not already discovered
    if (!investigation.discoveredEvidenceIds.includes(evidenceId)) {
      investigation.discoveredEvidenceIds.push(evidenceId);
      await investigation.save();
    }

    return { success: true, investigation };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * Abandon investigation
 */
const abandonInvestigation = async (investigationId, userId) => {
  try {
    const investigation = await Investigation.findById(investigationId);

    if (!investigation) {
      return { success: false, error: 'INVESTIGATION_NOT_FOUND' };
    }

    // Verify ownership
    if (investigation.userId.toString() !== userId.toString()) {
      return { success: false, error: 'FORBIDDEN' };
    }

    investigation.status = 'ABANDONED';
    await investigation.save();

    return { success: true, investigation };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  createInvestigation,
  getInvestigationById,
  getUserInvestigationsForCase,
  getUserInvestigations,
  updateInvestigation,
  discoverEvidence,
  abandonInvestigation,
};
