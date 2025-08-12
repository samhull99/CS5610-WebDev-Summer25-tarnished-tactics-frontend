import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import GuideCreator from './GuideCreator';

function GuidesPage() {
  const { user, isAuthenticated } = useAuth();
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/v1/guides`);
      if (!response.ok) {
        throw new Error('Failed to fetch guides');
      }
      const data = await response.json();
      setGuides(data.guides || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGuideCreated = (newGuide) => {
    setShowCreateForm(false);
    setEditingGuide(null);
    fetchGuides(); // Refresh the list to include the new guide
  };

  const handleEditGuide = (guide) => {
    setEditingGuide(guide);
    setShowCreateForm(true);
  };

  const handleDeleteGuide = async (guideId) => {
    if (!user) return;
    
    if (!window.confirm('Are you sure you want to delete this guide?')) {
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/v1/guides/${guideId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete guide');
      }

      // Remove guide from local state
      setGuides(guides.filter(guide => guide._id !== guideId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Check if current user owns the guide
  const isOwner = (guide) => {
    return user && guide.authorId === user.id;
  };

  // Helper function to truncate content
  const truncateContent = (content, maxLength = 150) => {
    if (!content) return '';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + '...';
  };

  // Helper function to get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return '#10b981'; // green
      case 'medium':
        return '#f59e0b'; // amber
      case 'hard':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  // Helper function to get category color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'boss guide':
        return '#dc3545'; // red
      case 'build guide':
        return '#7c3aed'; // purple
      case 'area guide':
        return '#059669'; // emerald
      case 'weapon guide':
        return '#f59e0b'; // amber
      case 'strategy guide':
        return '#3b82f6'; // blue
      default:
        return '#374151'; // gray
    }
  };

  if (showCreateForm) {
    return (
      <div className="guides-page">
        <GuideCreator 
          onGuideCreated={handleGuideCreated}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingGuide(null);
          }}
          editingGuide={editingGuide}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="guides-page">
        <div className="page-header">
          <h1>Guides</h1>
        </div>
        <div className="loading-state">
          <p>Loading guides...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guides-page">
        <div className="page-header">
          <h1>Guides</h1>
        </div>
        <div className="error-state">
          <h2>Error Loading Guides</h2>
          <p>{error}</p>
          <button 
            onClick={fetchGuides} 
            className="create-button"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="guides-page">
      <div className="page-header">
        <h1>Guides</h1>
        <div className="page-actions">
          {isAuthenticated && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="create-button"
            >
              Create New Guide
            </button>
          )}
          <span className="guides-count">
            {guides.length} guide{guides.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      {guides.length === 0 ? (
        <div className="empty-state">
          <h2>No Guides Available</h2>
          <p>Check back later for helpful Elden Ring guides and strategies.</p>
          {isAuthenticated && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="create-button primary"
            >
              Create First Guide
            </button>
          )}
          {!isAuthenticated && (
            <p>Sign in to create and share your own guides!</p>
          )}
        </div>
      ) : (
        <div className="guides-container grid">
          {guides.map((guide) => (
            <div key={guide._id} className="guide-card clickable-card">
              <div className="guide-header">
                <h3 className="guide-name">
                  <Link to={`/guides/${guide._id}`} className="guide-name-link">
                    {guide.title}
                  </Link>
                </h3>
                <div className="guide-actions">
                  {isOwner(guide) && (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditGuide(guide);
                        }}
                        className="edit-button"
                        title="Edit guide"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteGuide(guide._id);
                        }}
                        className="delete-button"
                        title="Delete guide"
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="guide-meta">
                <span 
                  className="guide-category"
                  style={{ backgroundColor: getCategoryColor(guide.category) }}
                >
                  {guide.category}
                </span>
                <span 
                  className="guide-difficulty"
                  style={{ backgroundColor: getDifficultyColor(guide.difficulty) }}
                >
                  {guide.difficulty}
                </span>
                {guide.recommendedLevel && (
                  <span className="guide-level">
                    Level {guide.recommendedLevel}+
                  </span>
                )}
                {/* Show guide type indicator */}
                {!guide.authorId && (
                  <span className="build-type preset">📋 Preset</span>
                )}
                {guide.authorId && (
                  <span className="build-type user">👤 User Guide</span>
                )}
              </div>

              <div className="guide-description">
                {truncateContent(guide.description)}
              </div>

              {guide.content && (
                <div className="guide-content-preview">
                  <h4>Preview:</h4>
                  <p>{truncateContent(guide.content, 100)}</p>
                </div>
              )}

              {guide.tags && guide.tags.length > 0 && (
                <div className="guide-tags">
                  {guide.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                  {guide.tags.length > 3 && (
                    <span className="tag">+{guide.tags.length - 3} more</span>
                  )}
                </div>
              )}

              {guide.associatedBuilds && guide.associatedBuilds.length > 0 && (
                <div className="guide-builds">
                  <h4>Associated Builds:</h4>
                  <p>{guide.associatedBuilds.length} build{guide.associatedBuilds.length !== 1 ? 's' : ''}</p>
                </div>
              )}

              <div className="guide-footer">
                <span>Created: {new Date(guide.createdAt).toLocaleDateString()}</span>
                {guide.updatedAt && guide.updatedAt !== guide.createdAt && (
                  <span>Updated: {new Date(guide.updatedAt).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuidesPage;