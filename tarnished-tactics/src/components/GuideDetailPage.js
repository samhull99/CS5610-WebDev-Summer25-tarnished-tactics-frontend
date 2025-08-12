import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import GuideCreator from './GuideCreator';

function GuideDetailPage() {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchGuide();
  }, [guideId]);

  const fetchGuide = async () => {
    setLoading(true);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const url = `${API_URL}/api/v1/guides/${guideId}`;
      console.log('Fetching guide from:', url);
      
      const response = await fetch(url);
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`Guide not found: ${response.status} - ${errorText}`);
      }
      
      const guideData = await response.json();
      console.log('Guide data received:', guideData);
      setGuide(guideData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGuide = async () => {
    if (!user || !guide) return;
    
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

      // Redirect back to guides page after deletion
      navigate('/guides');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEditGuide = () => {
    setShowEditForm(true);
  };

  const handleGuideUpdated = (updatedGuide) => {
    setShowEditForm(false);
    fetchGuide(); // Refresh the guide data
  };

  const isOwner = () => {
    return user && guide && guide.authorId === user.id;
  };

  const getGuideType = () => {
    if (!guide.authorId) return { label: 'Preset Guide', class: 'preset', icon: '📋' };
    return { label: 'User Guide', class: 'user', icon: '👤' };
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

  if (loading) {
    return (
      <div className="build-detail-page">
        <div className="loading-state">
          <p>Loading guide...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="build-detail-page">
        <div className="error-state">
          <h2>Guide Not Found</h2>
          <p>{error}</p>
          <Link to="/guides" className="create-button">
            Back to Guides
          </Link>
        </div>
      </div>
    );
  }

  if (!guide) {
    return null;
  }

  // If editing, show the GuideCreator
  if (showEditForm) {
    return (
      <div className="build-detail-page">
        <GuideCreator 
          onGuideCreated={handleGuideUpdated}
          onCancel={() => setShowEditForm(false)}
          editingGuide={guide}
        />
      </div>
    );
  }

  const guideType = getGuideType();

  return (
    <div className="build-detail-page">
      {/* Header */}
      <div className="build-detail-header">
        <div className="breadcrumb">
          <Link to="/guides">Guides</Link> / <span>{guide.title}</span>
        </div>
        
        <div className="build-detail-actions">
          {isOwner() && (
            <>
              <button 
                onClick={handleEditGuide}
                className="edit-button-large"
                title="Edit guide"
              >
                ✏️ Edit Guide
              </button>
              <button 
                onClick={handleDeleteGuide}
                className="delete-button-large"
                title="Delete guide"
              >
                🗑️ Delete Guide
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="build-detail-content">
        {/* Guide Info Section */}
        <div className="build-info-section">
          <h1 className="build-title">{guide.title}</h1>
          
          <div className="build-meta-large">
            <span 
              className="guide-category-large"
              style={{ backgroundColor: getCategoryColor(guide.category) }}
            >
              {guide.category}
            </span>
            <span 
              className="guide-difficulty-large"
              style={{ backgroundColor: getDifficultyColor(guide.difficulty) }}
            >
              {guide.difficulty}
            </span>
            {guide.recommendedLevel && (
              <span className="build-level-large">Level {guide.recommendedLevel}+</span>
            )}
            <span className={`visibility-large ${guide.isPublic ? 'public' : 'private'}`}>
              {guide.isPublic ? '🌐 Public' : '🔒 Private'}
            </span>
            <span className={`build-type-large ${guideType.class}`}>
              {guideType.icon} {guideType.label}
            </span>
          </div>

          {guide.description && (
            <div className="build-description-large">
              <h3>Description</h3>
              <p>{guide.description}</p>
            </div>
          )}
        </div>

        {/* Guide Content Section */}
        <div className="build-section">
          <h2>Guide Content</h2>
          <div className="guide-content-detailed">
            {guide.content.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>

        {/* Associated Builds Section */}
        {guide.associatedBuilds && guide.associatedBuilds.length > 0 && (
          <div className="build-section">
            <h2>Associated Builds</h2>
            <div className="associated-builds">
              <p>This guide references {guide.associatedBuilds.length} build{guide.associatedBuilds.length !== 1 ? 's' : ''}.</p>
              {/* TODO: In the future, you could fetch and display the actual build details here */}
            </div>
          </div>
        )}

        {/* Images Section */}
        {guide.images && guide.images.length > 0 && (
          <div className="build-section">
            <h2>Images</h2>
            <div className="guide-images">
              {guide.images.map((image, index) => (
                <img 
                  key={index} 
                  src={image} 
                  alt={`Guide image ${index + 1}`}
                  className="guide-image"
                />
              ))}
            </div>
          </div>
        )}

        {/* Tags Section */}
        {guide.tags && guide.tags.length > 0 && (
          <div className="build-section">
            <h2>Tags</h2>
            <div className="tags-large">
              {guide.tags.map(tag => (
                <span key={tag} className="tag-large">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="build-detail-footer">
          <div className="build-dates">
            <p><strong>Created:</strong> {new Date(guide.createdAt).toLocaleString()}</p>
            {guide.updatedAt !== guide.createdAt && (
              <p><strong>Last Updated:</strong> {new Date(guide.updatedAt).toLocaleString()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuideDetailPage;