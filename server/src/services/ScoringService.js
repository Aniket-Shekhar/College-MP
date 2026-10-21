const Investigation = require('../models/Investigation');
const Case = require('../models/Case');
const Evidence = require('../models/Evidence');

/**
 * Calculate evidence score based on D-001
 * Evidence discovery: 40 points total, proportional by eligible evidence weights
 */
const calculateEvidenceScore = (discoveredEvidenceIds, caseId) => {
  return Evidence.find({ caseId, isHidden: false }).then((evidenceList) => {
    if (!evidenceList || evidenceList.length === 0) {
      return 0;
    }

    const totalWeight = evidenceList.reduce(
      (sum, e) => sum + (e.discoveryWeight || 1),
      0
    );
    const discoveredWeight = evidenceList
      .filter((e) => discoveredEvidenceIds.includes(e._id.toString()))
      .reduce((sum, e) => sum + (e.discoveryWeight || 1), 0);

    const score = (discoveredWeight / totalWeight) * 40;
    return Math.round(score * 100) / 100; // Keep 2 decimal precision
  });
};

/**
 * Calculate conclusion score based on D-001
 * Conclusion accuracy: 35 points (binary by default, partial credit by case config)
 */
const calculateConclusionScore = (submittedAnswerId, caseData) => {
  if (!caseData.solution || !caseData.solution.acceptedAnswerIds) {
    return 0;
  }

  const acceptedIds = caseData.solution.acceptedAnswerIds.map((id) =>
    id.toString()
  );

  // Check if submitted answer is in accepted answers
  if (acceptedIds.includes(submittedAnswerId.toString())) {
    // Default: full credit for correct answer
    // Partial credit would be implemented via case.solution.partialCreditRules
    return 35;
  }

  return 0;
};

/**
 * Calculate reasoning score based on D-001
 * Reasoning/evidence links: 25 points
 * Rubric: 15 for evidence relevance, 5 for logical consistency, 5 for completeness
 */
const calculateReasoningScore = (
  selectedEvidenceIds,
  investigation,
  _caseId
) => {
  // Simplified implementation for MVP
  // Full implementation would analyze the board graph and evaluate:
  // - Evidence relevance (15 pts): Selected evidence should be relevant to the solution
  // - Logical consistency (5 pts): Connections should form a coherent argument
  // - Completeness (5 pts): Should include key pieces of evidence

  // For MVP: score based on proportion of discovered evidence selected
  const discoveredCount = investigation.discoveredEvidenceIds.length;
  const selectedCount = selectedEvidenceIds.length;

  if (discoveredCount === 0) {
    return 0;
  }

  // Base score: selecting at least 50% of discovered evidence
  const proportion = selectedCount / discoveredCount;
  let score = 0;

  if (proportion >= 0.5) {
    score = 15; // Evidence relevance
  } else if (proportion >= 0.3) {
    score = 10;
  } else if (proportion >= 0.1) {
    score = 5;
  }

  // Add logical consistency (5 pts) if board has connections
  if (investigation.board && investigation.board.edges.length > 0) {
    score += 5;
  }

  // Add completeness (5 pts) if at least 3 pieces of evidence selected
  if (selectedCount >= 3) {
    score += 5;
  }

  return Math.min(score, 25);
};

/**
 * Calculate total score and update investigation
 */
const calculateScore = async (investigationId, conclusionData) => {
  try {
    const investigation = await Investigation.findById(investigationId);

    if (!investigation) {
      return { success: false, error: 'INVESTIGATION_NOT_FOUND' };
    }

    if (investigation.status === 'COMPLETED') {
      return { success: false, error: 'INVESTIGATION_COMPLETED' };
    }

    const caseData = await Case.findById(investigation.caseId);

    if (!caseData) {
      return { success: false, error: 'CASE_NOT_FOUND' };
    }

    // Calculate evidence score
    const evidenceScore = await calculateEvidenceScore(
      investigation.discoveredEvidenceIds,
      investigation.caseId
    );

    // Calculate conclusion score
    const conclusionScore = calculateConclusionScore(
      conclusionData.answerId,
      caseData
    );

    // Calculate reasoning score
    const reasoningScore = calculateReasoningScore(
      conclusionData.selectedEvidenceIds || [],
      investigation,
      investigation.caseId
    );

    // Calculate total score
    const totalScore = evidenceScore + conclusionScore + reasoningScore;

    // Round and clamp to 0-100
    const roundedTotal = Math.round(totalScore);
    const clampedTotal = Math.max(0, Math.min(100, roundedTotal));

    // Update investigation with score
    investigation.score = {
      total: clampedTotal,
      evidence: Math.round(evidenceScore * 100) / 100,
      conclusion: conclusionScore,
      reasoning: reasoningScore,
      scoringVersion: caseData.solution.scoringVersion || '1.0',
    };

    investigation.conclusion = {
      answerId: conclusionData.answerId,
      explanation: conclusionData.explanation,
      selectedEvidenceIds: conclusionData.selectedEvidenceIds || [],
    };

    investigation.status = 'COMPLETED';
    investigation.completedAt = new Date();

    await investigation.save();

    return {
      success: true,
      investigation,
      score: investigation.score,
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  calculateEvidenceScore,
  calculateConclusionScore,
  calculateReasoningScore,
  calculateScore,
};
