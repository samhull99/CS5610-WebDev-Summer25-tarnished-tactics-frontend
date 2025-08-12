import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const GUIDE_CATEGORIES = [
  'Boss Guide',
  'Build Guide', 
  'Area Guide',
  'Weapon Guide',
  'Strategy Guide'
];

const GUIDE_DIFFICULTIES = [
  'Easy',
  'Medium',
  'Hard'
];

function GuideCreator({ onGuideCreated, onCancel, editingGuide = null }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = editingGuide !== null;
  
  const [guideData, setGuideData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'Boss Guide',
    difficulty: 'Easy',
    recommendedLevel: '',
    associatedBuilds: [],
    tags: [],
    images: [],
    isPublic: true
  });

  const [tagInput, setTagInput] = useState('');

  // Load existing guide data when editing
  useEffect(() => {
    if (isEditing && editingGuide) {
      setGuideData({
        title: editingGuide.title || '',
        description: editingGuide.description || '',
        content: editingGuide.content || '',
        category: editingGuide.category || 'Boss Guide',
        difficulty: editingGuide.difficulty || 'Easy',
        recommendedLevel: editingGuide.recommendedLevel || '',
        associatedBuilds: editingGuide.associatedBuilds || [],
        tags: editingGuide.tags || [],
        images: editingGuide.images || [],
        isPublic: editingGuide.isPublic !== undefined ? editingGuide.isPublic : true
      });
    }
  }, [isEditing, editingGuide]);

  const handleInputChange = (field, value) => {
    setGuideData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !guideData.tags.includes(tagInput.trim())) {
      setGuideData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setGuideData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be signed in to save guides');
      return;
    }

    if (!guideData.title.trim()) {
      setError('Guide title is required');
      return;
    }

    if (!guideData.content.trim()) {
      setError('Guide content is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const guidePayload = {
        ...guideData,
        userId: user.id,
        recommendedLevel: guideData.recommendedLevel ? parseInt(guideData.recommendedLevel) : null
      };

      let response;
      if (isEditing) {
        // Update existing guide
        response = await fetch(`${API_URL}/api/v1/guides/${editingGuide._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(guidePayload)
        });
      } else {
        // Create new guide
        response = await fetch(`${API_URL}/api/v1/guides`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(guidePayload)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} guide`);
      }

      const result = await response.json();
      
      if (onGuideCreated) {
        onGuideCreated(result);
      }
      
      // Reset form if creating new guide
      if (!isEditing) {
        setGuideData({
          title: '',
          description: '',
          content: '',
          category: 'Boss Guide',
          difficulty: 'Easy',
          recommendedLevel: '',
          associatedBuilds: [],
          tags: [],
          images: [],
          isPublic: true
        });
      }
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="build-creator">
        <p>Please sign in to {isEditing ? 'edit' : 'create'} guides.</p>
      </div>
    );
  }

  return (
    <div className="build-creator">
      <h2>{isEditing ? 'Edit Guide' : 'Create New Guide'}</h2>
      
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="build-form">
        {/* Basic Info */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="title">Guide Title *</label>
            <input
              type="text"
              id="title"
              value={guideData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter guide title"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={guideData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Brief description of your guide..."
              rows="3"
              required
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={guideData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {GUIDE_CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={guideData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
              >
                {GUIDE_DIFFICULTIES.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="recommendedLevel">Recommended Level (optional)</label>
            <input
              type="number"
              id="recommendedLevel"
              min="1"
              max="200"
              value={guideData.recommendedLevel}
              onChange={(e) => handleInputChange('recommendedLevel', e.target.value)}
              placeholder="e.g. 50"
            />
          </div>
        </div>

        {/* Content */}
        <div className="form-section">
          <h3>Guide Content</h3>
          
          <div className="form-group">
            <label htmlFor="content">Guide Content *</label>
            <textarea
              id="content"
              value={guideData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your detailed guide content here..."
              rows="10"
              required
            />
          </div>
        </div>

        {/* Tags and Settings */}
        <div className="form-section">
          <h3>Tags and Settings</h3>
          
          <div className="form-group">
            <label>Tags</label>
            <div className="tag-input-container">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              />
              <button type="button" onClick={handleAddTag}>Add Tag</button>
            </div>
            
            {guideData.tags.length > 0 && (
              <div className="tags-display">
                {guideData.tags.map(tag => (
                  <span key={tag} className="tag">
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={guideData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              />
              Make this guide public
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? `${isEditing ? 'Updating' : 'Creating'} Guide...` : `${isEditing ? 'Update' : 'Create'} Guide`}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default GuideCreator;