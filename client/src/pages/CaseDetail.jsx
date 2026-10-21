import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { caseAPI } from '../lib/api.jsx';

function CaseDetail() {
  const { slug } = useParams();
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('briefing');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const fetchCase = async () => {
    try {
      setLoading(true);
      const response = await caseAPI.getCaseBySlug(slug);
      setCaseData(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load case');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading case...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  if (!caseData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Case Not Found
          </h2>
          <button
            onClick={() => navigate('/cases')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Cases
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">CASEFILE</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/cases')}
                className="text-gray-700 hover:text-gray-900"
              >
                Back to Cases
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Case Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800">
                {caseData.category}
              </span>
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                {caseData.difficulty}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              ~{caseData.estimatedMinutes} minutes
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {caseData.title}
          </h1>
          <p className="text-gray-600 mb-4">{caseData.shortDescription}</p>
          {caseData.tags && caseData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {caseData.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-6">
            <button
              onClick={() => navigate(`/investigate/${slug}`)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Start Investigation
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {['briefing', 'evidence', 'persons', 'timeline', 'witnesses'].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`${
                      activeTab === tab
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
                  >
                    {tab}
                  </button>
                )
              )}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'briefing' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Case Briefing
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {caseData.briefing}
                </p>
                {caseData.contentWarning && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
                    <strong>Content Warning:</strong> {caseData.contentWarning}
                  </div>
                )}
                {caseData.editorialNote && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
                    <strong>Editorial Note:</strong> {caseData.editorialNote}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'evidence' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Evidence ({caseData.evidence?.length || 0})
                </h3>
                {caseData.evidence && caseData.evidence.length > 0 ? (
                  <div className="space-y-4">
                    {caseData.evidence.map((evidence) => (
                      <div
                        key={evidence._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {evidence.title}
                          </h4>
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-700">
                            {evidence.importance}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {evidence.description}
                        </p>
                        <p className="text-sm text-gray-700">
                          {evidence.fullContent}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No evidence available.</p>
                )}
              </div>
            )}

            {activeTab === 'persons' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Persons of Interest ({caseData.persons?.length || 0})
                </h3>
                {caseData.persons && caseData.persons.length > 0 ? (
                  <div className="space-y-4">
                    {caseData.persons.map((person) => (
                      <div
                        key={person._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {person.displayName}
                          </h4>
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-purple-100 text-purple-700">
                            {person.statusLabel}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          <strong>Role:</strong> {person.role}
                        </p>
                        <p className="text-sm text-gray-700">
                          {person.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No persons of interest listed.
                  </p>
                )}
              </div>
            )}

            {activeTab === 'timeline' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Timeline ({caseData.timelineEvents?.length || 0})
                </h3>
                {caseData.timelineEvents &&
                caseData.timelineEvents.length > 0 ? (
                  <div className="space-y-4">
                    {caseData.timelineEvents.map((event) => (
                      <div
                        key={event._id}
                        className="border-l-4 border-indigo-500 pl-4"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {event.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {event.displayDate}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">
                          {event.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No timeline events listed.</p>
                )}
              </div>
            )}

            {activeTab === 'witnesses' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Witness Statements ({caseData.witnessStatements?.length || 0})
                </h3>
                {caseData.witnessStatements &&
                caseData.witnessStatements.length > 0 ? (
                  <div className="space-y-4">
                    {caseData.witnessStatements.map((statement) => (
                      <div
                        key={statement._id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {statement.title}
                          </h4>
                          <span className="text-sm text-gray-500">
                            {statement.dateLabel}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          &quot;{statement.statement}&quot;
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">
                    No witness statements available.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CaseDetail;
