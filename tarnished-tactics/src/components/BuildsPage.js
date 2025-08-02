import React, { useState, useEffect } from 'react';

function BuildsPage() {
  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBuilds();
  }, []);

  const fetchBuilds = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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

  if (loading) {
    return (
      <div className="builds-page">
        <h1>Builds</h1>
        <p>Loading builds...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="builds-page">
        <h1>Builds</h1>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="builds-page">
      <h1>Builds</h1>
      
      {builds.length === 0 ? (
        <p>No builds found.</p>
      ) : (
        <div className="builds-list">
          {builds.map((build) => (
            <div key={build._id} className="build-item">
              <h3>{build.name}</h3>
              <p><strong>Class:</strong> {build.class}</p>
              <p><strong>Level:</strong> {build.level}</p>
              <p><strong>Description:</strong> {build.description}</p>
              
              <div className="stats">
                <h4>Stats:</h4>
                <ul>
                  <li>Vigor: {build.stats.vigor}</li>
                  <li>Mind: {build.stats.mind}</li>
                  <li>Endurance: {build.stats.endurance}</li>
                  <li>Strength: {build.stats.strength}</li>
                  <li>Dexterity: {build.stats.dexterity}</li>
                  <li>Intelligence: {build.stats.intelligence}</li>
                  <li>Faith: {build.stats.faith}</li>
                  <li>Arcane: {build.stats.arcane}</li>
                </ul>
              </div>

              <div className="equipment">
                <h4>Equipment:</h4>
                <p><strong>Right Hand:</strong> {build.equipment.rightHand.join(', ') || 'None'}</p>
                <p><strong>Helmet:</strong> {build.equipment.armor.helmet || 'None'}</p>
                <p><strong>Chest:</strong> {build.equipment.armor.chest || 'None'}</p>
                <p><strong>Gauntlets:</strong> {build.equipment.armor.gauntlets || 'None'}</p>
                <p><strong>Legs:</strong> {build.equipment.armor.legs || 'None'}</p>
              </div>

              {build.tags && build.tags.length > 0 && (
                <div className="tags">
                  <strong>Tags:</strong> {build.tags.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BuildsPage;