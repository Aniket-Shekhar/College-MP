require('dotenv').config();
const mongoose = require('mongoose');
const Case = require('../src/models/Case');
const Evidence = require('../src/models/Evidence');
const Person = require('../src/models/Person');
const WitnessStatement = require('../src/models/WitnessStatement');
const TimelineEvent = require('../src/models/TimelineEvent');
const Location = require('../src/models/Location');
const Source = require('../src/models/Source');

const seedCase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if case already exists
    const existingCase = await Case.findOne({ slug: 'midnight-burglary' });
    if (existingCase) {
      console.log('Case already exists. Deleting existing case...');
      await Case.deleteOne({ slug: 'midnight-burglary' });
      await Evidence.deleteMany({ caseId: existingCase._id });
      await Person.deleteMany({ caseId: existingCase._id });
      await WitnessStatement.deleteMany({ caseId: existingCase._id });
      await TimelineEvent.deleteMany({ caseId: existingCase._id });
      await Location.deleteMany({ caseId: existingCase._id });
      await Source.deleteMany({ caseId: existingCase._id });
    }

    // Create the case
    const newCase = await Case.create({
      slug: 'midnight-burglary',
      title: 'The Midnight Burglary',
      shortDescription:
        'A valuable necklace has been stolen from The Antique Shop. Can you find the thief?',
      category: 'FICTIONAL',
      difficulty: 'EASY',
      status: 'PUBLISHED',
      estimatedMinutes: 20,
      briefing:
        'Sarah Jenkins, owner of "The Antique Shop", arrived at her store at 9 AM on October 15th to find the back door unlocked and her most valuable item missing—a diamond necklace worth $50,000. The display case was shattered, but there were no signs of forced entry. Three people had access and possible motives. Your task is to examine the evidence, interview witnesses, and determine who committed the burglary.',
      contentWarning: null,
      editorialNote: 'Fictional case created for CASEFILE platform.',
      coverImage: null,
      tags: ['fictional', 'burglary', 'mystery'],
      solution: {
        type: 'PERSON',
        acceptedAnswerIds: [], // Will be populated after creating Person
        scoringVersion: '1.0',
        partialCreditRules: [],
      },
    });

    console.log('Created case:', newCase.title);

    // Create locations
    const shopLocation = await Location.create({
      caseId: newCase._id,
      name: 'The Antique Shop',
      description:
        'A small antique store on Main Street specializing in vintage jewelry and collectibles.',
      approximateCoordinates: 'Main Street, downtown',
    });

    console.log('Created location:', shopLocation.name);

    // Create persons
    const sarah = await Person.create({
      caseId: newCase._id,
      displayName: 'Sarah Jenkins',
      role: 'Shop Owner',
      description:
        'Owner of The Antique Shop for 5 years. Recently experiencing financial difficulties.',
      statusLabel: 'Victim',
    });

    const david = await Person.create({
      caseId: newCase._id,
      displayName: 'David Torres',
      role: 'Former Employee',
      description:
        'Worked at the shop for 2 years. Fired 2 days before the burglary due to alleged theft.',
      statusLabel: 'Suspect',
    });

    const mike = await Person.create({
      caseId: newCase._id,
      displayName: 'Mike Chen',
      role: 'Neighbor',
      description:
        'Lives in the apartment above the shop. Has a criminal record for burglary.',
      statusLabel: 'Suspect',
    });

    const officer = await Person.create({
      caseId: newCase._id,
      displayName: 'Officer Miller',
      role: 'Police Officer',
      description: 'Responding officer to the burglary report.',
      statusLabel: 'Witness',
    });

    console.log('Created 4 persons');

    // Update solution with David's ID (the culprit)
    newCase.solution.acceptedAnswerIds = [david._id];
    await newCase.save();

    // Create evidence
    const brokenDisplay = await Evidence.create({
      caseId: newCase._id,
      title: 'Broken Display Case',
      type: 'Physical Evidence',
      description:
        'The glass display case containing the necklace was shattered. Glass shards were found scattered outward from the case.',
      fullContent:
        'The display case is made of tempered glass. Analysis of the break pattern shows the glass shattered outward, suggesting the break came from inside rather than outside. This could indicate someone inside the store broke it to simulate a break-in.',
      importance: 'HIGH',
      discoveryWeight: 5,
      isHidden: false,
      relatedLocationIds: [shopLocation._id],
    });

    const unlockedDoor = await Evidence.create({
      caseId: newCase._id,
      title: 'Unlocked Back Door',
      type: 'Physical Evidence',
      description:
        'The back door was found unlocked with no signs of forced entry.',
      fullContent:
        'The back door has a standard deadbolt. There are no pry marks or damage to the door frame. This suggests the person who entered had a key or knew the lock combination.',
      importance: 'HIGH',
      discoveryWeight: 5,
      isHidden: false,
      relatedLocationIds: [shopLocation._id],
    });

    const fingerprint = await Evidence.create({
      caseId: newCase._id,
      title: 'Partial Fingerprint',
      type: 'Forensic Evidence',
      description:
        'A partial fingerprint was found on the edge of the display case.',
      fullContent:
        'Forensic analysis matched the partial fingerprint to David Torres, the former employee who was fired 2 days ago.',
      importance: 'HIGH',
      discoveryWeight: 5,
      isHidden: false,
      relatedPersonIds: [david._id],
    });

    const securityFootage = await Evidence.create({
      caseId: newCase._id,
      title: 'Security Camera Footage',
      type: 'Digital Evidence',
      description:
        'Security footage shows a figure near the shop at 2:30 AM.',
      fullContent:
        'Grainy footage shows a person wearing a dark jacket with a distinctive red patch on the sleeve entering the back of the shop at 2:30 AM. The face is obscured. This jacket matches one David was seen wearing recently.',
      importance: 'HIGH',
      discoveryWeight: 5,
      isHidden: false,
      relatedTimelineEventIds: [], // Will add after creating timeline
    });

    const financialRecords = await Evidence.create({
      caseId: newCase._id,
      title: 'Financial Records',
      type: 'Document',
      description:
        'Store financial records show significant debt and an insurance policy on the necklace.',
      fullContent:
        'The shop has been operating at a loss for the past 6 months. Sarah Jenkins took out a $100,000 insurance policy on valuable items including the necklace 3 months ago. However, the timing suggests this might be a red herring.',
      importance: 'MEDIUM',
      discoveryWeight: 3,
      isHidden: false,
      relatedPersonIds: [sarah._id],
    });

    const terminationLetter = await Evidence.create({
      caseId: newCase._id,
      title: 'Termination Letter',
      type: 'Document',
      description:
        'Letter terminating David Torres for alleged theft 2 days before the burglary.',
      fullContent:
        'David was terminated after an expensive watch went missing. He denied the accusation but no evidence was found. He was angry about being fired and made threatening comments about "getting what he was owed."',
      importance: 'HIGH',
      discoveryWeight: 5,
      isHidden: false,
      relatedPersonIds: [david._id],
    });

    const mikeAlibi = await Evidence.create({
      caseId: newCase._id,
      title: "Mike Chen's Statement",
      type: 'Statement',
      description:
        'Mike claims he was at home asleep at the time of the burglary.',
      fullContent:
        'Mike Chen claims he was home alone asleep from 10 PM to 6 AM. No witnesses can confirm his alibi. His building has no security cameras.',
      importance: 'MEDIUM',
      discoveryWeight: 3,
      isHidden: false,
      relatedPersonIds: [mike._id],
    });

    const insuranceClaim = await Evidence.create({
      caseId: newCase._id,
      title: 'Insurance Claim',
      type: 'Document',
      description:
        'Insurance claim filed at 10 AM on the day of the burglary.',
      fullContent:
        'Sarah filed an insurance claim at 10 AM, 30 minutes after discovering the theft and calling the police at 9:30 AM. The timing suggests the claim was prepared promptly, not suspiciously early.',
      importance: 'LOW',
      discoveryWeight: 2,
      isHidden: false,
      relatedPersonIds: [sarah._id],
    });

    console.log('Created 8 evidence items');

    // Create timeline events
    const event1 = await TimelineEvent.create({
      caseId: newCase._id,
      title: 'David Torres Fired',
      description: 'David was terminated from his position at the antique shop.',
      eventDate: new Date('2026-10-13T14:00:00'),
      displayDate: 'October 13, 2:00 PM',
      evidenceIds: [terminationLetter._id],
      personIds: [david._id],
      locationId: shopLocation._id,
      order: 1,
    });

    const event2 = await TimelineEvent.create({
      caseId: newCase._id,
      title: 'Shop Closes',
      description: 'The antique shop closed at 6 PM as usual.',
      eventDate: new Date('2026-10-15T18:00:00'),
      displayDate: 'October 15, 6:00 PM',
      personIds: [sarah._id],
      locationId: shopLocation._id,
      order: 2,
    });

    const event3 = await TimelineEvent.create({
      caseId: newCase._id,
      title: 'Sarah Leaves Shop',
      description: 'Sarah Jenkins left the shop for the evening.',
      eventDate: new Date('2026-10-15T18:15:00'),
      displayDate: 'October 15, 6:15 PM',
      personIds: [sarah._id],
      locationId: shopLocation._id,
      order: 3,
    });

    const event4 = await TimelineEvent.create({
      caseId: newCase._id,
      title: 'Mike Seen Nearby',
      description: 'A neighbor reported seeing Mike Chen near the shop.',
      eventDate: new Date('2026-10-15T22:00:00'),
      displayDate: 'October 15, 10:00 PM',
      personIds: [mike._id],
      locationId: shopLocation._id,
      order: 4,
    });

    const event5 = await TimelineEvent.create({
      caseId: newCase._id,
      title: 'Figure on Security Camera',
      description: 'Security footage shows a figure near the back door.',
      eventDate: new Date('2026-10-16T02:30:00'),
      displayDate: 'October 16, 2:30 AM',
      evidenceIds: [securityFootage._id],
      locationId: shopLocation._id,
      order: 5,
    });

    const event6 = await TimelineEvent.create({
      caseId: newCase._id,
      title: 'Burglary Occurs',
      description: 'The necklace was stolen from the display case.',
      eventDate: new Date('2026-10-16T02:45:00'),
      displayDate: 'October 16, 2:45 AM (estimated)',
      evidenceIds: [brokenDisplay._id, unlockedDoor._id],
      locationId: shopLocation._id,
      order: 6,
    });

    const event7 = await TimelineEvent.create({
      caseId: newCase._id,
      title: 'Sarah Arrives at Shop',
      description: 'Sarah arrived at 9 AM and discovered the burglary.',
      eventDate: new Date('2026-10-16T09:00:00'),
      displayDate: 'October 16, 9:00 AM',
      personIds: [sarah._id],
      locationId: shopLocation._id,
      order: 7,
    });

    const event8 = await TimelineEvent.create({
      caseId: newCase._id,
      title: 'Police Respond',
      description: 'Officer Miller arrived to investigate.',
      eventDate: new Date('2026-10-16T09:30:00'),
      displayDate: 'October 16, 9:30 AM',
      personIds: [officer._id, sarah._id],
      locationId: shopLocation._id,
      order: 8,
    });

    console.log('Created 8 timeline events');

    // Update security footage to reference timeline event
    securityFootage.relatedTimelineEventIds = [event5._id];
    await securityFootage.save();

    // Create witness statements
    const sarahStatement = await WitnessStatement.create({
      caseId: newCase._id,
      personId: sarah._id,
      title: 'Sarah Jenkins Statement',
      statement:
        'I closed the shop at 6 PM and locked all doors. When I returned at 9 AM, the back door was unlocked and the necklace was gone. I immediately called the police.',
      dateLabel: 'October 16, 9:30 AM',
      evidenceIds: [unlockedDoor._id],
    });

    const officerStatement = await WitnessStatement.create({
      caseId: newCase._id,
      personId: officer._id,
      title: 'Officer Miller Statement',
      statement:
        'Arrived at 9:30 AM. Found no signs of forced entry on the back door. Display case was shattered outward. Took fingerprints and secured security footage.',
      dateLabel: 'October 16, 9:30 AM',
      evidenceIds: [brokenDisplay._id, fingerprint._id, securityFootage._id],
    });

    console.log('Created 2 witness statements');

    // Create source (fictional case source)
    const source = await Source.create({
      caseId: newCase._id,
      title: 'CASEFILE Internal Case File',
      publisher: 'CASEFILE Platform',
      url: null,
      publishedAt: new Date('2026-10-16'),
      accessedAt: new Date(),
      sourceType: 'OTHER',
      notes: 'Fictional case created for the CASEFILE platform demonstration.',
    });

    console.log('Created source');

    // Update evidence with source reference
    await Evidence.updateMany(
      { caseId: newCase._id },
      { $push: { sourceIds: source._id } }
    );

    // Update persons with evidence references
    await Person.updateOne(
      { _id: sarah._id },
      { $push: { evidenceIds: [financialRecords._id, insuranceClaim._id] } }
    );
    await Person.updateOne(
      { _id: david._id },
      {
        $push: {
          evidenceIds: [fingerprint._id, terminationLetter._id, securityFootage._id],
        },
      }
    );
    await Person.updateOne(
      { _id: mike._id },
      { $push: { evidenceIds: [mikeAlibi._id] } }
    );

    // Update case with source reference
    await Case.updateOne(
      { _id: newCase._id },
      { $push: { sourceIds: source._id } }
    );

    console.log('\n✅ Successfully seeded "The Midnight Burglary" case!');
    console.log(`Case ID: ${newCase._id}`);
    console.log(`Slug: ${newCase.slug}`);
    console.log('\nSummary:');
    console.log('- 1 case');
    console.log('- 1 location');
    console.log('- 4 persons');
    console.log('- 8 evidence items');
    console.log('- 8 timeline events');
    console.log('- 2 witness statements');
    console.log('- 1 source');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding case:', error);
    process.exit(1);
  }
};

seedCase();
