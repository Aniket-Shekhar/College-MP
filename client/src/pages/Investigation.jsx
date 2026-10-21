import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseAPI, investigationAPI } from '../lib/api';

export default function Investigation() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [investigation, setInvestigation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discoveredEvidence, setDiscoveredEvidence] = useState([]);

  useEffect(() => {
    const loadCaseAndInvestigation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load case
        const caseResponse = await caseAPI.getCaseBySlug(slug);
        setCaseData(caseResponse.data.data);

        // Check for existing investigation
        const existingResponse =
          await investigationAPI.getInvestigationsForCase(
            caseResponse.data.data._id
          );

        const existingInvestigation = existingResponse.data.data.find(
          (inv) => inv.status === 'IN_PROGRESS'
        );

        if (existingInvestigation) {
          setInvestigation(existingInvestigation);
          setDiscoveredEvidence(
            existingInvestigation.discoveredEvidenceIds || []
          );
        }
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to load case');
      } finally {
        setLoading(false);
      }
    };

    loadCaseAndInvestigation();
  }, [slug]);

  const startInvestigation = async () => {
    try {
      const response = await investigationAPI.createInvestigation(caseData._id);
      setInvestigation(response.data.data);
      setDiscoveredEvidence([]);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to start investigation'
      );
    }
  };

  const discoverEvidence = async (evidenceId) => {
    try {
      const response = await investigationAPI.discoverEvidence(
        investigation._id,
        evidenceId
      );
      setInvestigation(response.data.data);
      setDiscoveredEvidence(response.data.data.discoveredEvidenceIds || []);
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to discover evidence'
      );
    }
  };

  const abandonInvestigation = async () => {
    try {
      await investigationAPI.abandonInvestigation(investigation._id);
      navigate('/cases');
    } catch (err) {
      setError(
        err.response?.data?.error?.message || 'Failed to abandon investigation'
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Case not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cases')}
            className="text-gray-400 hover:text-white mb-4"
          >
            ← Back to Cases
          </button>
          <h1 className="text-4xl font-bold mb-2">{caseData.title}</h1>
          <p className="text-gray-400">{caseData.shortDescription}</p>
        </div>

        {/* Investigation Status */}
        {!investigation ? (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Start Investigation</h2>
            <p className="text-gray-400 mb-4">
              You are about to begin investigating this case. This will be
              attempt # {caseData._id ? '1' : 'N'}.
            </p>
            <button
              onClick={startInvestigation}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Start Investigation
            </button>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Investigation in Progress</h2>
              <button
                onClick={abandonInvestigation}
                className="text-red-400 hover:text-red-300"
              >
                Abandon Investigation
              </button>
            </div>
            <p className="text-gray-400">
              Attempt: {investigation.attemptNumber} | Evidence Discovered:{' '}
              {discoveredEvidence.length} / {caseData.evidence?.length || 0}
            </p>
          </div>
        )}

        {/* Briefing */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Briefing</h2>
          <p className="text-gray-300 whitespace-pre-wrap">
            {caseData.briefing}
          </p>
        </div>

        {/* Evidence List */}
        {investigation && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Evidence</h2>
            <div className="grid gap-4">
              {caseData.evidence?.map((evidence) => {
                const isDiscovered = discoveredEvidence.includes(evidence._id);
                return (
                  <div
                    key={evidence._id}
                    className={`p-4 rounded-lg border ${
                      isDiscovered
                        ? 'bg-gray-700 border-gray-600'
                        : 'bg-gray-800 border-gray-700 opacity-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">
                        {evidence.title}
                      </h3>
                      <span className="text-sm text-gray-400">
                        {evidence.importance}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                      {evidence.description}
                    </p>
                    {!isDiscovered ? (
                      <button
                        onClick={() => discoverEvidence(evidence._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Discover Evidence
                      </button>
                    ) : (
                      <div className="text-green-400 text-sm">✓ Discovered</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {investigation && discoveredEvidence.length > 0 && (
          <div className="flex gap-4">
            <button
              onClick={() =>
                navigate(`/investigations/${investigation._id}/board`)
              }
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Open Evidence Board
            </button>
            <button
              onClick={() =>
                navigate(`/investigations/${investigation._id}/conclusion`)
              }
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Submit Conclusion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
