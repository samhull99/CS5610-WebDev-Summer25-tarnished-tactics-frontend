import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BuildCreator from './BuildCreator';

function BuildsPage() {
  const { user, isAuthenticated } = useAuth();
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBuild, setEditingBuild] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://tarnished-tactics-backend.uc.r.appspot.com';
      const response = await fetch(`${API_URL}/api/v1/builds`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch builds');
      }
      
      const data = await response.json();
      setBuilds(data.builds || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildCreated = (newBuild) => {
    setShowCreateForm(false);
    setEditingBuild(null);
    fetchBuilds(); // Refresh the list to include the new build
  };

  const handleEditBuild = (build) => {
    setEditingBuild(build);
    setShowCreateForm(true);
  };

  const handleDeleteBuild = async (buildId) => {
    if (!user) return;
    
    if (!window.confirm('Are you sure you want to delete this build?')) {
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://tarnished-tactics-backend.uc.r.appspot.com';
      const response = await fetch(`${API_URL}/api/v1/builds/${buildId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Failed to delete build');
      }

      // Remove build from local state
      setBuilds(builds.filter(build => build._id !== buildId));
    } catch (err) {
      setError(err.message);
    }
  };

  // Check if current user owns the build
  const isOwner = (build) => {
    return user && build.userId === user.id;
  };

  if (showCreateForm) {
    return (
      <div className="builds-page">
        <BuildCreator 
          onBuildCreated={handleBuildCreated}
          onCancel={() => {
            setShowCreateForm(false);
            setEditingBuild(null);
          }}
          editingBuild={editingBuild}
        />
      </div>
    );
  }

  return (
    <div className="builds-page">
      <div className="page-header">
        <h1>Builds</h1>
        <div className="page-actions">
          {isAuthenticated && (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="create-button"
            >
              Create New Build
            </button>
          )}
          <div className="view-toggle">
            <button 
              onClick={() => setView('grid')}
              className={`view-button ${view === 'grid' ? 'active' : ''}`}
            >
              Grid
            </button>
            <button 
              onClick={() => setView('list')}
              className={`view-button ${view === 'list' ? 'active' : ''}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      {loading ? (
        <div className="loading-state">
          <p>Loading builds...</p>
        </div>
      ) : (
        <div className="builds-content">
          {builds.length === 0 ? (
            <div className="empty-state">
              <h2>No builds available</h2>
              <p>Be the first to create a build!</p>
              {isAuthenticated && (
                <button 
                  onClick={() => setShowCreateForm(true)}
                  className="create-button primary"
                >
                  Create First Build
                </button>
              )}
              {!isAuthenticated && (
                <p>Sign in to create and share your own builds!</p>
              )}
            </div>
          ) : (
            <div className={`builds-container ${view}`}>
              {builds.map((build) => (
                <div key={build._id} className="build-card clickable-card">
                  <div className="build-header">
                    <h3 className="build-name">
                      <Link to={`/builds/${build._id}`} className="build-name-link">
                        {build.name}
                      </Link>
                    </h3>
                    <div className="build-actions">
                      {isOwner(build) && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditBuild(build);
                            }}
                            className="edit-button"
                            title="Edit build"
                          >
                            ✏️
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBuild(build._id);
                            }}
                            className="delete-button"
                            title="Delete build"
                          >
                            🗑️
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="build-meta">
                    <span className="build-class">{build.class}</span>
<span className="build-level">Level {build.level}</span>
                    <span className={`visibility ${build.isPublic ? 'public' : 'private'}`}>
                      {build.isPublic ? '🌐 Public' : '🔒 Private'}
                    </span>
                    {/* Show build type indicator */}
                    {!build.userId && (
                      <span className="build-type preset">📋 Preset</span>
                    )}
                    {build.userId && (
                      <span className="build-type user">👤 User Build</span>
                    )}
                  </div>
                  <p className="build-description">{build.description}</p>
                  
                  <div className="build-stats-summary">
                    <div className="stat-group">
                      <span className="stat-label">VIG</span>
                      <span className="stat-value">{build.stats.vigor}</span>
                    </div>
                    <div className="stat-group">
                      <span className="stat-label">STR</span>
                      <span className="stat-value">{build.stats.strength}</span>
                    </div>
                    <div className="stat-group">
                      <span className="stat-label">DEX</span>
                      <span className="stat-value">{build.stats.dexterity}</span>
                    </div>
                    <div className="stat-group">
                      <span className="stat-label">INT</span>
                      <span className="stat-value">{build.stats.intelligence}</span>
                    </div>
                    <div className="stat-group">
                      <span className="stat-label">FAI</span>
                      <span className="stat-value">{build.stats.faith}</span>
                    </div>
                  </div>

                  {build.equipment.rightHand && build.equipment.rightHand.length > 0 && (
                    <div className="build-equipment">
                      <strong>Main Weapon:</strong> {build.equipment.rightHand[0]}
                    </div>
                  )}

                  {build.tags && build.tags.length > 0 && (
                    <div className="build-tags">
                      {build.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <div className="build-footer">
                    <small>
                      Created: {new Date(build.createdAt).toLocaleDateString()}
                    </small>
                    {build.updatedAt !== build.createdAt && (
                      <small>
                        Updated: {new Date(build.updatedAt).toLocaleDateString()}
                      </small>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BuildsPage;