import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { investigationAPI } from '../lib/api';

export default function EvidenceBoard() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [error, setError] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    loadBoard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Autosave with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        saveBoard();
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, edges]);

  const loadBoard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await investigationAPI.getBoard(id);
      const boardData = response.data.data;

      if (boardData.nodes) {
        setNodes(boardData.nodes);
      }
      if (boardData.edges) {
        setEdges(boardData.edges);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        // Board doesn't exist yet, that's ok
        setNodes([]);
        setEdges([]);
      } else {
        setError(err.response?.data?.error?.message || 'Failed to load board');
      }
    } finally {
      setLoading(false);
    }
  };

  const saveBoard = async () => {
    try {
      setSaving(true);
      setError(null);

      const board = {
        nodes,
        edges,
        version: '1.0',
      };

      await investigationAPI.saveBoard(id, board);
      setLastSaved(new Date());
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to save board');
    } finally {
      setSaving(false);
    }
  };

  const addNoteNode = () => {
    const newNode = {
      id: `note-${Date.now()}`,
      type: 'noteNode',
      position: { x: 100, y: 100 },
      data: {
        title: 'Note',
        notes: '',
      },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleSave = () => {
    saveBoard();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading Evidence Board...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-full px-4 py-8">
        {/* Header */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white mb-2"
            >
              ← Back
            </button>
            <h1 className="text-2xl font-bold">Evidence Board</h1>
          </div>
          <div className="flex gap-4 items-center">
            {lastSaved && (
              <span className="text-sm text-gray-400">
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            {saving && (
              <span className="text-sm text-yellow-400">Saving...</span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={addNoteNode}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* React Flow Canvas */}
        <div
          className="bg-gray-800 rounded-lg border border-gray-700"
          style={{ height: '70vh' }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background color="#374151" gap={16} />
            <Controls />
            <MiniMap />
          </ReactFlow>
        </div>

        {/* Instructions */}
        <div className="mt-4 bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold mb-2">Instructions</h3>
          <ul className="text-gray-400 text-sm list-disc list-inside space-y-1">
            <li>
              Drag evidence cards from the investigation page to add them to the
              board
            </li>
            <li>Click &quot;Add Note&quot; to create custom notes</li>
            <li>
              Connect nodes by dragging from the edge of one node to another
            </li>
            <li>The board auto-saves every 2 seconds</li>
            <li>Coordinates must be between -5000 and 5000</li>
            <li>Maximum 100 nodes and 200 edges</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
