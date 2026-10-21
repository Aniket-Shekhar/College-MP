const Case = require('../models/Case');
const Evidence = require('../models/Evidence');
const Person = require('../models/Person');
const WitnessStatement = require('../models/WitnessStatement');
const TimelineEvent = require('../models/TimelineEvent');
const Location = require('../models/Location');
const Source = require('../models/Source');

/**
 * Get public case data (without solution)
 * Applies projection and public-response serializer for defense-in-depth
 */
const getPublicCase = async (slug) => {
  const caseData = await Case.findOne({ slug, status: 'PUBLISHED' });

  if (!caseData) {
    return null;
  }

  // Use the instance method to get public object
  const publicCase = caseData.toPublicObject();

  // Load related data
  const evidence = await Evidence.find({ caseId: caseData._id });
  const persons = await Person.find({ caseId: caseData._id });
  const witnessStatements = await WitnessStatement.find({
    caseId: caseData._id,
  });
  const timelineEvents = await TimelineEvent.find({
    caseId: caseData._id,
  }).sort({
    order: 1,
  });
  const locations = await Location.find({ caseId: caseData._id });
  const sources = await Source.find({ caseId: caseData._id });

  // Filter evidence - remove isHidden and unlockConditions
  const publicEvidence = evidence.map((e) => e.toPublicObject());

  return {
    ...publicCase,
    evidence: publicEvidence,
    persons,
    witnessStatements,
    timelineEvents,
    locations,
    sources,
  };
};

/**
 * Get list of published cases (public data only)
 */
const getPublishedCases = async (filters = {}) => {
  const { category, difficulty, search } = filters;

  const query = { status: 'PUBLISHED' };

  if (category) {
    query.category = category;
  }

  if (difficulty) {
    query.difficulty = difficulty;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
  }

  const cases = await Case.find(query)
    .select('-solution')
    .sort({ createdAt: -1 });

  return cases.map((c) => c.toPublicObject());
};

/**
 * Get full case with solution (admin only)
 */
const getFullCase = async (caseId) => {
  const caseData = await Case.findById(caseId);

  if (!caseData) {
    return null;
  }

  const evidence = await Evidence.find({ caseId });
  const persons = await Person.find({ caseId });
  const witnessStatements = await WitnessStatement.find({ caseId });
  const timelineEvents = await TimelineEvent.find({ caseId }).sort({
    order: 1,
  });
  const locations = await Location.find({ caseId });
  const sources = await Source.find({ caseId });

  return {
    ...caseData.toObject(),
    evidence,
    persons,
    witnessStatements,
    timelineEvents,
    locations,
    sources,
  };
};

module.exports = {
  getPublicCase,
  getPublishedCases,
  getFullCase,
};
