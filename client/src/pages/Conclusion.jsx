import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { investigationAPI, caseAPI } from '../lib/api';

export default function Conclusion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [answerId, setAnswerId] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    loadInvestigationAndCase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadInvestigationAndCase = async () => {
    try {
      setLoading(true);
      const invResponse = await investigationAPI.getInvestigation(id);
      setInvestigation(invResponse.data.data);

      const caseResponse = await caseAPI.getCaseBySlug(
        invResponse.data.data.caseId.slug
      );
      setCaseData(caseResponse.data.data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await investigationAPI.submitConclusion(id, {
        answerId,
        explanation,
        selectedEvidenceIds: investigation?.discoveredEvidenceIds || [],
      });

      setScore(response.data.data.score);
      setSubmitted(true);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to submit conclusion'
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted && score) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-8">Investigation Complete</h1>

          <div className="bg-gray-800 rounded-lg p-8 mb-8">
            <div className="text-center mb-8">
              <div className="text-6xl font-bold text-green-400 mb-2">
                {score.total}
              </div>
              <div className="text-xl text-gray-400">Total Score</div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {score.evidence}
                </div>
                <div className="text-sm text-gray-400">Evidence</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {score.conclusion}
                </div>
                <div className="text-sm text-gray-400">Conclusion</div>
              </div>
              <div className="bg-gray-700 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400">
                  {score.reasoning}
                </div>
                <div className="text-sm text-gray-400">Reasoning</div>
              </div>
            </div>

            <div className="text-sm text-gray-400 mb-8">
              Scoring Version: {score.scoringVersion}
            </div>

            <button
              onClick={() => navigate('/cases')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Return to Cases
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white mb-4"
        >
          ← Back
        </button>

        <h1 className="text-4xl font-bold mb-8">Submit Conclusion</h1>

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mb-8">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Answer Selection */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Who is the culprit?</h2>
            {caseData && caseData.persons ? (
              <div className="space-y-3">
                {caseData.persons.map((person) => (
                  <label
                    key={person._id}
                    className="flex items-center space-x-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={person._id}
                      checked={answerId === person._id}
                      onChange={(e) => setAnswerId(e.target.value)}
                      className="w-5 h-5"
                    />
                    <span>
                      {person.displayName} ({person.role})
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">Loading suspects...</div>
            )}
          </div>

          {/* Explanation */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Your Explanation</h2>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain your reasoning and how you reached your conclusion..."
              className="w-full h-40 bg-gray-700 border border-gray-600 rounded-lg p-4 text-white focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          {/* Selected Evidence */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">
              Evidence ({investigation?.discoveredEvidenceIds?.length || 0}{' '}
              discovered)
            </h2>
            <p className="text-gray-400 mb-4">
              All discovered evidence will be used to evaluate your reasoning
            </p>
            {investigation && investigation.discoveredEvidenceIds && (
              <div className="text-sm text-gray-500">
                You have discovered {investigation.discoveredEvidenceIds.length}{' '}
                pieces of evidence
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !answerId || !explanation}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-lg font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : 'Submit Conclusion'}
          </button>
        </form>
      </div>
    </div>
  );
}
