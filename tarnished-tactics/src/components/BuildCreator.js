import React, { useState, useEffect } from 'react';
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

function BuildCreator({ onBuildCreated, onCancel, editingBuild = null }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const isEditing = editingBuild !== null;
  
  const [buildData, setBuildData] = useState({
    name: '',
    description: '',
    class: 'Vagabond',
    level: 10,
    stats: {
      vigor: '',
      mind: '',
      endurance: '',
      strength: '',
      dexterity: '',
      intelligence: '',
      faith: '',
      arcane: ''
    },
    equipment: { ...EQUIPMENT_SLOTS },
    spells: [],
    isPublic: true,
    tags: []
  });

  const [tagInput, setTagInput] = useState('');

  // Load existing build data when editing
  useEffect(() => {
    if (isEditing && editingBuild) {
      setBuildData({
        name: editingBuild.name || '',
        description: editingBuild.description || '',
        class: editingBuild.class || 'Vagabond',
        level: editingBuild.level || 10,
        stats: {
          vigor: editingBuild.stats?.vigor || '',
          mind: editingBuild.stats?.mind || '',
          endurance: editingBuild.stats?.endurance || '',
          strength: editingBuild.stats?.strength || '',
          dexterity: editingBuild.stats?.dexterity || '',
          intelligence: editingBuild.stats?.intelligence || '',
          faith: editingBuild.stats?.faith || '',
          arcane: editingBuild.stats?.arcane || ''
        },
        equipment: {
          rightHand: editingBuild.equipment?.rightHand || [],
          leftHand: editingBuild.equipment?.leftHand || [],
          armor: {
            helmet: editingBuild.equipment?.armor?.helmet || '',
            chest: editingBuild.equipment?.armor?.chest || '',
            gauntlets: editingBuild.equipment?.armor?.gauntlets || '',
            legs: editingBuild.equipment?.armor?.legs || ''
          },
          talismans: editingBuild.equipment?.talismans || []
        },
        spells: editingBuild.spells || [],
        isPublic: editingBuild.isPublic !== undefined ? editingBuild.isPublic : true,
        tags: editingBuild.tags || []
      });
    }
  }, [isEditing, editingBuild]);

  const handleInputChange = (field, value) => {
    setBuildData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatChange = (stat, value) => {
    // Allow empty string, or parse to number between 0-99
    if (value === '') {
      setBuildData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: ''
        }
      }));
    } else {
      const numValue = Math.max(0, Math.min(99, parseInt(value) || 0));
      setBuildData(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [stat]: numValue
        }
      }));
    }
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
    // Treat empty strings as 0 for calculation
    const statsSum = Object.values(buildData.stats).reduce((sum, stat) => {
      const numStat = stat === '' ? 0 : parseInt(stat) || 0;
      return sum + numStat;
    }, 0);
    const baseStats = 0;
    const calculatedLevel = baseLevel + (statsSum - baseStats);
    return Math.max(1, calculatedLevel);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be signed in to save builds');
      return;
    }

    if (!buildData.name.trim()) {
      setError('Build name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://tarnished-tactics-backend.uc.r.appspot.com';
      
      const buildPayload = {
        ...buildData,
        userId: user.id,
        level: calculateTotalLevel()
      };

      let response;
      if (isEditing) {
        // Update existing build
        response = await fetch(`${API_URL}/api/v1/builds/${editingBuild._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(buildPayload)
        });
      } else {
        // Create new build
        response = await fetch(`${API_URL}/api/v1/builds`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(buildPayload)
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditing ? 'update' : 'create'} build`);
      }

      const result = await response.json();
      
      if (onBuildCreated) {
        onBuildCreated(result);
      }
      
      // Reset form if creating new build
      if (!isEditing) {
        setBuildData({
          name: '',
          description: '',
          class: 'Vagabond',
          level: 10,
          stats: {
            vigor: 0,
            mind: 0,
            endurance: 0,
            strength: 0,
            dexterity: 0,
            intelligence: 0,
            faith: 0,
            arcane: 0
          },
          equipment: { ...EQUIPMENT_SLOTS },
          spells: [],
          isPublic: true,
          tags: []
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
        <p>Please sign in to {isEditing ? 'edit' : 'create'} builds.</p>
      </div>
    );
  }

  return (
    <div className="build-creator">
      <h2>{isEditing ? 'Edit Build' : 'Create New Build'}</h2>
      
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
                  min="0"
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
            {loading ? `${isEditing ? 'Updating' : 'Creating'} Build...` : `${isEditing ? 'Update' : 'Create'} Build`}
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