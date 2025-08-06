import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const STARTING_CLASSES = [
  'Vagabond', 'Warrior', 'Hero', 'Bandit', 'Astrologer', 
  'Prophet', 'Samurai', 'Prisoner', 'Confessor', 'Wretch'
];

const EQUIPMENT_SLOTS = {
  rightHand: [],
  leftHand: [],
  armor: {
    helmet: '',
    chest: '',
    gauntlets: '',
    legs: ''
  },
  talismans: []
};

function BuildCreator({ onBuildCreated, onCancel }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [buildData, setBuildData] = useState({
    name: '',
    description: '',
    class: 'Vagabond',
    level: 10,
    stats: {
      vigor: 10,
      mind: 10,
      endurance: 10,
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      faith: 10,
      arcane: 10
    },
    equipment: { ...EQUIPMENT_SLOTS },
    spells: [],
    isPublic: true,
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  const handleInputChange = (field, value) => {
    setBuildData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatChange = (stat, value) => {
    const numValue = Math.max(1, Math.min(99, parseInt(value) || 1));
    setBuildData(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        [stat]: numValue
      }
    }));
  };

  const handleEquipmentChange = (category, slot, value) => {
    setBuildData(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [category]: typeof prev.equipment[category] === 'object' && !Array.isArray(prev.equipment[category])
          ? {
              ...prev.equipment[category],
              [slot]: value
            }
          : category === 'rightHand' || category === 'leftHand' || category === 'talismans'
          ? value.split(',').map(item => item.trim()).filter(item => item)
          : prev.equipment[category]
      }
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !buildData.tags.includes(tagInput.trim())) {
      setBuildData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setBuildData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const calculateTotalLevel = () => {
    const baseLevel = 1;
    const statsSum = Object.values(buildData.stats).reduce((sum, stat) => sum + stat, 0);
    const baseStats = 80; // Sum of all stats at level 1 for most classes
    return baseLevel + (statsSum - baseStats);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be signed in to create builds');
      return;
    }

    if (!buildData.name.trim()) {
      setError('Build name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      const buildPayload = {
        ...buildData,
        userId: user.id,
        level: calculateTotalLevel()
      };

      const response = await fetch(`${API_URL}/api/v1/builds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create build');
      }

      const result = await response.json();
      
      if (onBuildCreated) {
        onBuildCreated(result);
      }
      
      // Reset form
      setBuildData({
        name: '',
        description: '',
        class: 'Vagabond',
        level: 10,
        stats: {
          vigor: 10,
          mind: 10,
          endurance: 10,
          strength: 10,
          dexterity: 10,
          intelligence: 10,
          faith: 10,
          arcane: 10
        },
        equipment: { ...EQUIPMENT_SLOTS },
        spells: [],
        isPublic: true,
        tags: []
      });
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="build-creator">
        <p>Please sign in to create builds.</p>
      </div>
    );
  }

  return (
    <div className="build-creator">
      <h2>Create New Build</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="build-form">
        {/* Basic Info */}
        <div className="form-section">
          <h3>Basic Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">Build Name *</label>
            <input
              type="text"
              id="name"
              value={buildData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Enter build name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={buildData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe your build..."
              rows="3"
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="class">Starting Class</label>
              <select
                id="class"
                value={buildData.class}
                onChange={(e) => handleInputChange('class', e.target.value)}
              >
                {STARTING_CLASSES.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Calculated Level: {calculateTotalLevel()}</label>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="form-section">
          <h3>Stats</h3>
          <div className="stats-grid">
            {Object.entries(buildData.stats).map(([stat, value]) => (
              <div key={stat} className="form-group">
                <label htmlFor={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                <input
                  type="number"
                  id={stat}
                  min="1"
                  max="99"
                  value={value}
                  onChange={(e) => handleStatChange(stat, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Equipment */}
        <div className="form-section">
          <h3>Equipment</h3>
          
          <div className="form-group">
            <label htmlFor="rightHand">Right Hand (comma-separated)</label>
            <input
              type="text"
              id="rightHand"
              value={buildData.equipment.rightHand.join(', ')}
              onChange={(e) => handleEquipmentChange('rightHand', null, e.target.value)}
              placeholder="e.g. Uchigatana, Bloodhound's Fang"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="leftHand">Left Hand (comma-separated)</label>
            <input
              type="text"
              id="leftHand"
              value={buildData.equipment.leftHand.join(', ')}
              onChange={(e) => handleEquipmentChange('leftHand', null, e.target.value)}
              placeholder="e.g. Brass Shield, Parrying Dagger"
            />
          </div>
          
          <div className="armor-grid">
            <div className="form-group">
              <label htmlFor="helmet">Helmet</label>
              <input
                type="text"
                id="helmet"
                value={buildData.equipment.armor.helmet}
                onChange={(e) => handleEquipmentChange('armor', 'helmet', e.target.value)}
                placeholder="e.g. Knight Helm"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="chest">Chest</label>
              <input
                type="text"
                id="chest"
                value={buildData.equipment.armor.chest}
                onChange={(e) => handleEquipmentChange('armor', 'chest', e.target.value)}
                placeholder="e.g. Knight Armor"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="gauntlets">Gauntlets</label>
              <input
                type="text"
                id="gauntlets"
                value={buildData.equipment.armor.gauntlets}
                onChange={(e) => handleEquipmentChange('armor', 'gauntlets', e.target.value)}
                placeholder="e.g. Knight Gauntlets"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="legs">Legs</label>
              <input
                type="text"
                id="legs"
                value={buildData.equipment.armor.legs}
                onChange={(e) => handleEquipmentChange('armor', 'legs', e.target.value)}
                placeholder="e.g. Knight Greaves"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="talismans">Talismans (comma-separated)</label>
            <input
              type="text"
              id="talismans"
              value={buildData.equipment.talismans.join(', ')}
              onChange={(e) => handleEquipmentChange('talismans', null, e.target.value)}
              placeholder="e.g. Erdtree's Favor, Radagon's Scarseal"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="form-section">
          <h3>Tags</h3>
          <div className="form-group">
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
            
            {buildData.tags.length > 0 && (
              <div className="tags-display">
                {buildData.tags.map(tag => (
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
                checked={buildData.isPublic}
                onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              />
              Make this build public
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-button">
            {loading ? 'Creating Build...' : 'Create Build'}
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

export default BuildCreator;