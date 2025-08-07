import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import BuildCreator from './BuildCreator';

function BuildDetailPage() {
  const { buildId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [build, setBuild] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchBuild();
  }, [buildId]);

  const fetchBuild = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const url = `${API_URL}/api/v1/builds/${buildId}`;
      console.log('Fetching build from:', url); // Debug log
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status); // Debug log
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText); // Debug log
        throw new Error(`Build not found: ${response.status} - ${errorText}`);
      }
      
      const buildData = await response.json();
      console.log('Build data received:', buildData); // Debug log
      setBuild(buildData);
    } catch (err) {
      console.error('Fetch error:', err); // Debug log
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBuild = async () => {
    if (!user || !build) return;
    
    if (!window.confirm('Are you sure you want to delete this build?')) {
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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

      // Redirect back to builds page after deletion
      navigate('/builds');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditBuild = () => {
    setShowEditForm(true);
  };

  const handleBuildUpdated = (updatedBuild) => {
    setShowEditForm(false);
    fetchBuild(); // Refresh the build data
  };

  const isOwner = () => {
    return user && build && build.userId === user.id;
  };

  const getBuildType = () => {
    if (!build.userId) return { label: 'Preset Build', class: 'preset', icon: '📋' };
    return { label: 'User Build', class: 'user', icon: '👤' };
  };

  if (loading) {
    return (
      <div className="build-detail-page">
        <div className="loading-state">
          <p>Loading build...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="build-detail-page">
        <div className="error-state">
          <h2>Build Not Found</h2>
          <p>{error}</p>
          <Link to="/builds" className="create-button">
            Back to Builds
          </Link>
        </div>
      </div>
    );
  }

  if (!build) {
    return null;
  }

  // If editing, show the BuildCreator
  if (showEditForm) {
    return (
      <div className="build-detail-page">
        <BuildCreator 
          onBuildCreated={handleBuildUpdated}
          onCancel={() => setShowEditForm(false)}
          editingBuild={build}
        />
      </div>
    );
  }

  const buildType = getBuildType();

  return (
    <div className="build-detail-page">
      {/* Header */}
      <div className="build-detail-header">
        <div className="breadcrumb">
          <Link to="/builds">Builds</Link> / <span>{build.name}</span>
        </div>
        
        <div className="build-detail-actions">
          {isOwner() && (
            <>
              <button 
                onClick={handleEditBuild}
                className="edit-button-large"
                title="Edit build"
              >
                ✏️ Edit Build
              </button>
              <button 
                onClick={handleDeleteBuild}
                className="delete-button-large"
                title="Delete build"
              >
                🗑️ Delete Build
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="build-detail-content">
        {/* Build Info Section */}
        <div className="build-info-section">
          <h1 className="build-title">{build.name}</h1>
          
          <div className="build-meta-large">
            <span className="build-class-large">{build.class}</span>
            <span className="build-level-large">Level {build.level}</span>
            <span className={`visibility-large ${build.isPublic ? 'public' : 'private'}`}>
              {build.isPublic ? '🌐 Public' : '🔒 Private'}
            </span>
            <span className={`build-type-large ${buildType.class}`}>
              {buildType.icon} {buildType.label}
            </span>
          </div>

          {build.description && (
            <div className="build-description-large">
              <h3>Description</h3>
              <p>{build.description}</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="build-section">
          <h2>Stats</h2>
          <div className="stats-detailed">
            {Object.entries(build.stats).map(([stat, value]) => (
              <div key={stat} className="stat-detailed">
                <span className="stat-name">{stat.charAt(0).toUpperCase() + stat.slice(1)}</span>
                <span className="stat-value-large">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Equipment Section */}
        <div className="build-section">
          <h2>Equipment</h2>
          
          {/* Weapons */}
          <div className="equipment-category">
            <h3>Weapons</h3>
            <div className="equipment-grid">
              {build.equipment.rightHand && build.equipment.rightHand.length > 0 && (
                <div className="equipment-slot">
                  <h4>Right Hand</h4>
                  <ul>
                    {build.equipment.rightHand.map((weapon, index) => (
                      <li key={index}>{weapon}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {build.equipment.leftHand && build.equipment.leftHand.length > 0 && (
                <div className="equipment-slot">
                  <h4>Left Hand</h4>
                  <ul>
                    {build.equipment.leftHand.map((weapon, index) => (
                      <li key={index}>{weapon}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Armor */}
          <div className="equipment-category">
            <h3>Armor</h3>
            <div className="equipment-grid">
              <div className="equipment-slot">
                <h4>Helmet</h4>
                <p>{build.equipment.armor.helmet || 'None'}</p>
              </div>
              <div className="equipment-slot">
                <h4>Chest</h4>
                <p>{build.equipment.armor.chest || 'None'}</p>
              </div>
              <div className="equipment-slot">
                <h4>Gauntlets</h4>
                <p>{build.equipment.armor.gauntlets || 'None'}</p>
              </div>
              <div className="equipment-slot">
                <h4>Legs</h4>
                <p>{build.equipment.armor.legs || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Talismans */}
          {build.equipment.talismans && build.equipment.talismans.length > 0 && (
            <div className="equipment-category">
              <h3>Talismans</h3>
              <div className="equipment-slot">
                <ul>
                  {build.equipment.talismans.map((talisman, index) => (
                    <li key={index}>{talisman}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Spells Section */}
        {build.spells && build.spells.length > 0 && (
          <div className="build-section">
            <h2>Spells</h2>
            <div className="spells-list">
              {build.spells.map((spell, index) => (
                <span key={index} className="spell-item">{spell}</span>
              ))}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {build.tags && build.tags.length > 0 && (
          <div className="build-section">
            <h2>Tags</h2>
            <div className="tags-large">
              {build.tags.map(tag => (
                <span key={tag} className="tag-large">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="build-detail-footer">
          <div className="build-dates">
            <p><strong>Created:</strong> {new Date(build.createdAt).toLocaleString()}</p>
            {build.updatedAt !== build.createdAt && (
              <p><strong>Last Updated:</strong> {new Date(build.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BuildDetailPage;