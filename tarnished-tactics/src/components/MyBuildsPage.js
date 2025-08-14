import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BuildCreator from './BuildCreator';

function MyBuildsPage() {
  const { user, isAuthenticated } = useAuth();
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingBuild, setEditingBuild] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserBuilds();
    }
  }, [isAuthenticated, user]);

  const fetchUserBuilds = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://tarnished-tactics-backend.uc.r.appspot.com';
      const response = await fetch(`${API_URL}/api/v1/builds/user/${user.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch your builds');
      }
      
      const userBuilds = await response.json();
      setBuilds(userBuilds);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildCreated = (newBuild) => {
    setShowCreateForm(false);
    setEditingBuild(null);
    fetchUserBuilds(); // Refresh the list
  };

  const handleEditBuild = (build) => {
    setEditingBuild(build);
    setShowCreateForm(true);
  };

  const handleDeleteBuild = async (buildId) => {
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

  if (!isAuthenticated) {
    return (
      <div className="my-builds-page">
        <h1>My Builds</h1>
        <div className="auth-prompt">
          <p>Please sign in to view and create your builds.</p>
        </div>
      </div>
    );
  }

  if (showCreateForm) {
    return (
      <div className="my-builds-page">
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
    <div className="my-builds-page">
      <div className="page-header">
        <h1>My Builds</h1>
        <div className="page-actions">
          <button 
            onClick={() => setShowCreateForm(true)}
            className="create-button"
          >
            Create New Build
          </button>
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
          <p>Loading your builds...</p>
        </div>
      ) : (
        <div className="builds-content">
          {builds.length === 0 ? (
            <div className="empty-state">
              <h2>No builds yet</h2>
              <p>Create your first build to get started!</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="create-button primary"
              >
                Create Your First Build
              </button>
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
                    </div>
                  </div>
                  
                  <div className="build-meta">
                    <span className="build-class">{build.class}</span>
                    <span className="build-level">Level {build.level}</span>
                    <span className={`visibility ${build.isPublic ? 'public' : 'private'}`}>
                      {build.isPublic ? '🌐 Public' : '🔒 Private'}
                    </span>
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

                  {build.equipment.rightHand.length > 0 && (
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

export default MyBuildsPage;