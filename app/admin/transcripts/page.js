'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Filter, Download, ChevronDown, ChevronUp, Lock } from 'lucide-react';

export default function TranscriptsAdmin() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [transcripts, setTranscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPromptVersion, setSelectedPromptVersion] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false
  });

  // Check for existing authentication on mount
  useEffect(() => {
    const authStatus = sessionStorage.getItem('admin_authenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTranscripts();
    }
  }, [selectedPromptVersion, pagination.offset, isAuthenticated]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    try {
      const response = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.authenticated) {
        sessionStorage.setItem('admin_authenticated', 'true');
        setIsAuthenticated(true);
        setPassword('');
      } else {
        setAuthError('Incorrect password');
      }
    } catch (error) {
      setAuthError('Failed to authenticate');
    } finally {
      setAuthLoading(false);
    }
  };

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-900 rounded-lg border border-gray-800 p-8">
          <div className="text-center mb-6">
            <div className="inline-block p-4 bg-purple-900/50 rounded-full mb-4">
              <Lock className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Admin Access Required</h1>
            <p className="text-gray-400">Enter password to view transcripts</p>
          </div>

          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full p-3 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
              autoFocus
            />
            {authError && (
              <p className="text-red-400 text-sm mb-4">{authError}</p>
            )}
            <button
              type="submit"
              disabled={!password || authLoading}
              className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              {authLoading ? 'Verifying...' : 'Access Admin Portal'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const fetchTranscripts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        limit: pagination.limit.toString(),
        offset: pagination.offset.toString()
      });

      if (selectedPromptVersion !== 'all') {
        params.append('prompt_version', selectedPromptVersion);
      }

      const response = await fetch(`/api/transcripts?${params}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch transcripts: ${response.status}`);
      }

      const data = await response.json();
      setTranscripts(data.transcripts);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const calculateDuration = (startTime, endTime) => {
    if (!endTime) return 'N/A';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationMs = end - start;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  const exportTranscript = (transcript) => {
    const dataStr = JSON.stringify(transcript, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transcript_${transcript.session_id}_${transcript.prompt_version}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const exportAll = () => {
    const dataStr = JSON.stringify(transcripts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `all_transcripts_${selectedPromptVersion}_${new Date().toISOString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const uniquePromptVersions = [...new Set(transcripts.map(t => t.prompt_version))];

  return (
    <div className="min-h-screen bg-black text-gray-200 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Onboarding Transcripts</h1>
          <p className="text-gray-400">View and analyze conversation transcripts from onboarding sessions</p>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-purple-400" />
                <select
                  value={selectedPromptVersion}
                  onChange={(e) => {
                    setSelectedPromptVersion(e.target.value);
                    setPagination(prev => ({ ...prev, offset: 0 }));
                  }}
                  className="bg-gray-800 border border-gray-700 text-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Versions</option>
                  {uniquePromptVersions.map(version => (
                    <option key={version} value={version}>{version}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-gray-400">
                {pagination.total} total sessions
              </div>
            </div>
            <button
              onClick={exportAll}
              disabled={transcripts.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Export All
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="mt-4 text-gray-400">Loading transcripts...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {/* Transcripts List */}
        {!loading && !error && transcripts.length === 0 && (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <p className="text-gray-400">No transcripts found</p>
          </div>
        )}

        {!loading && !error && transcripts.length > 0 && (
          <div className="space-y-4">
            {transcripts.map((transcript) => (
              <div
                key={transcript.id}
                className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden"
              >
                {/* Transcript Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => toggleExpanded(transcript.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="inline-block px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full text-sm font-medium">
                          {transcript.prompt_version}
                        </span>
                        <span className="text-gray-500 text-sm">
                          Session: {transcript.session_id.slice(0, 8)}...
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(transcript.created_at)}
                        </span>
                        <span>
                          Duration: {calculateDuration(transcript.start_time, transcript.end_time)}
                        </span>
                        <span>
                          {transcript.conversation_history.length} messages
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          exportTranscript(transcript);
                        }}
                        className="p-2 hover:bg-gray-700 rounded transition-colors"
                        title="Export transcript"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      {expandedId === transcript.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Transcript Content */}
                {expandedId === transcript.id && (
                  <div className="border-t border-gray-800 p-4 bg-gray-950">
                    <h4 className="text-sm font-semibold text-gray-300 mb-3">Conversation History</h4>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {transcript.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded ${
                            msg.sender === 'agent'
                              ? 'bg-purple-950/40 border-l-2 border-purple-500'
                              : 'bg-gray-800 border-l-2 border-gray-600'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold uppercase text-gray-400">
                              {msg.sender}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(msg.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-200 whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      ))}
                    </div>
                    {transcript.user_metadata && (
                      <div className="mt-4 pt-4 border-t border-gray-800">
                        <h4 className="text-sm font-semibold text-gray-300 mb-2">Metadata</h4>
                        <pre className="text-xs text-gray-400 bg-gray-900 p-3 rounded overflow-x-auto">
                          {JSON.stringify(transcript.user_metadata, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && transcripts.length > 0 && (
          <div className="flex justify-between items-center mt-6 px-4">
            <button
              onClick={() => setPagination(prev => ({
                ...prev,
                offset: Math.max(0, prev.offset - prev.limit)
              }))}
              disabled={pagination.offset === 0}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 rounded-lg transition-colors"
            >
              Previous
            </button>
            <span className="text-gray-400 text-sm">
              Showing {pagination.offset + 1} - {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total}
            </span>
            <button
              onClick={() => setPagination(prev => ({
                ...prev,
                offset: prev.offset + prev.limit
              }))}
              disabled={!pagination.hasMore}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:text-gray-600 rounded-lg transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
