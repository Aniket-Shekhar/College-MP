const Evidence = require('../models/Evidence');
const Investigation = require('../models/Investigation');

/**
 * Validate Evidence Board payload according to D-004 requirements
 */
const validateBoard = async (req, res, next) => {
  try {
    const { board } = req.body;
    const { id: investigationId } = req.params;
    const userId = req.session.userId;

    if (!board) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_BOARD',
          message: 'Board data is required',
        },
      });
    }

    // Validate board structure
    if (!board.nodes || !Array.isArray(board.nodes)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_BOARD',
          message: 'Board must have a nodes array',
        },
      });
    }

    if (!board.edges || !Array.isArray(board.edges)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_BOARD',
          message: 'Board must have an edges array',
        },
      });
    }

    // Validate board version
    if (board.version && board.version !== '1.0') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_BOARD_VERSION',
          message: 'Unsupported board version',
        },
      });
    }

    // Validate resource limits
    if (board.nodes.length > 100) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BOARD_TOO_LARGE',
          message: 'Board cannot have more than 100 nodes',
        },
      });
    }

    if (board.edges.length > 200) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BOARD_TOO_LARGE',
          message: 'Board cannot have more than 200 edges',
        },
      });
    }

    // Validate payload size (approximate JSON string size)
    const payloadSize = JSON.stringify(board).length;
    if (payloadSize > 100000) {
      // 100 KB
      return res.status(400).json({
        success: false,
        error: {
          code: 'PAYLOAD_TOO_LARGE',
          message: 'Board payload cannot exceed 100 KB',
        },
      });
    }

    // Verify investigation ownership
    const investigation = await Investigation.findById(investigationId);

    if (!investigation) {
      return res.status(404).json({
        success: false,
        error: {
          code: 'INVESTIGATION_NOT_FOUND',
          message: 'Investigation not found',
        },
      });
    }

    if (investigation.userId.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FORBIDDEN',
          message: 'You do not own this investigation',
        },
      });
    }

    // Validate that investigation is not completed
    if (investigation.status === 'COMPLETED') {
      return res.status(409).json({
        success: false,
        error: {
          code: 'INVESTIGATION_COMPLETED',
          message: 'Cannot modify completed investigations',
        },
      });
    }

    // Validate nodes
    const nodeIds = new Set();
    const allowedNodeTypes = ['evidenceCard', 'noteNode'];
    const allowedRelationshipTypes = [
      'SUPPORTS',
      'CONTRADICTS',
      'CAUSES',
      'RELATED_TO',
      'SAME_TIME',
      'SAME_PERSON',
      'SAME_LOCATION',
    ];

    for (const node of board.nodes) {
      // Validate node ID uniqueness
      if (!node.id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_NODE',
            message: 'Node must have an ID',
          },
        });
      }

      if (nodeIds.has(node.id)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'DUPLICATE_NODE_ID',
            message: `Duplicate node ID: ${node.id}`,
          },
        });
      }

      nodeIds.add(node.id);

      // Validate node type
      if (node.type && !allowedNodeTypes.includes(node.type)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_NODE_TYPE',
            message: `Invalid node type: ${node.type}`,
          },
        });
      }

      // Validate coordinates
      if (
        !node.position ||
        typeof node.position.x !== 'number' ||
        typeof node.position.y !== 'number'
      ) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_COORDINATES',
            message: 'Node must have valid x, y coordinates',
          },
        });
      }

      if (
        node.position.x < -5000 ||
        node.position.x > 5000 ||
        node.position.y < -5000 ||
        node.position.y > 5000
      ) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'COORDINATES_OUT_OF_BOUNDS',
            message: 'Coordinates must be between -5000 and 5000',
          },
        });
      }

      // Validate evidenceCard data
      if (node.type === 'evidenceCard' && node.data.evidenceId) {
        // Verify evidence belongs to case and is discovered
        const evidence = await Evidence.findOne({
          _id: node.data.evidenceId,
          caseId: investigation.caseId,
        });

        if (!evidence) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_EVIDENCE',
              message: 'Evidence not found in this case',
            },
          });
        }

        // Check if evidence is discovered
        if (
          !investigation.discoveredEvidenceIds.includes(node.data.evidenceId)
        ) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'EVIDENCE_NOT_DISCOVERED',
              message: 'Evidence has not been discovered yet',
            },
          });
        }
      }

      // Validate note length
      if (node.type === 'noteNode' && node.data.notes) {
        if (node.data.notes.length > 500) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'NOTE_TOO_LONG',
              message: 'Notes cannot exceed 500 characters',
            },
          });
        }
      }
    }

    // Validate edges
    const edgeIds = new Set();
    for (const edge of board.edges) {
      // Validate edge ID uniqueness
      if (!edge.id) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EDGE',
            message: 'Edge must have an ID',
          },
        });
      }

      if (edgeIds.has(edge.id)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'DUPLICATE_EDGE_ID',
            message: `Duplicate edge ID: ${edge.id}`,
          },
        });
      }

      edgeIds.add(edge.id);

      // Validate source and target
      if (!edge.source || !edge.target) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EDGE',
            message: 'Edge must have source and target',
          },
        });
      }

      if (!nodeIds.has(edge.source)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EDGE_SOURCE',
            message: `Edge source node not found: ${edge.source}`,
          },
        });
      }

      if (!nodeIds.has(edge.target)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_EDGE_TARGET',
            message: `Edge target node not found: ${edge.target}`,
          },
        });
      }

      // Validate relationship type
      if (edge.data && edge.data.relationshipType) {
        if (!allowedRelationshipTypes.includes(edge.data.relationshipType)) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_RELATIONSHIP_TYPE',
              message: `Invalid relationship type: ${edge.data.relationshipType}`,
            },
          });
        }
      }
    }

    // Validate groups
    if (board.groups && Array.isArray(board.groups)) {
      for (const group of board.groups) {
        if (!group.id) {
          return res.status(400).json({
            success: false,
            error: {
              code: 'INVALID_GROUP',
              message: 'Group must have an ID',
            },
          });
        }

        if (group.nodeIds && Array.isArray(group.nodeIds)) {
          for (const nodeId of group.nodeIds) {
            if (!nodeIds.has(nodeId)) {
              return res.status(400).json({
                success: false,
                error: {
                  code: 'INVALID_GROUP_NODE',
                  message: `Group references non-existent node: ${nodeId}`,
                },
              });
            }
          }
        }
      }
    }

    // Attach investigation ID to request for controller use
    req.investigation = investigation;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Board validation failed',
      },
    });
  }
};

module.exports = { validateBoard };
