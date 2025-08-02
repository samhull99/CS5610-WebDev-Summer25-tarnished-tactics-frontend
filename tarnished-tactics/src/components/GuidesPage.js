import React, { useState, useEffect } from 'react';

function GuidesPage() {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) {
    return (
      <div className="guides-page">
        <h1>Guides</h1>
        <p>Loading guides...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guides-page">
        <h1>Guides</h1>
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="guides-page">
      <h1>Guides</h1>
      
      {guides.length === 0 ? (
        <p>No guides found.</p>
      ) : (
        <div className="guides-list">
          {guides.map((guide) => (
            <div key={guide._id} className="guide-item">
              <h3>{guide.title}</h3>
              <p><strong>Category:</strong> {guide.category}</p>
              <p><strong>Difficulty:</strong> {guide.difficulty}</p>
              {guide.recommendedLevel && (
                <p><strong>Recommended Level:</strong> {guide.recommendedLevel}</p>
              )}
              <p><strong>Description:</strong> {guide.description}</p>
              
              <div className="content">
                <h4>Content:</h4>
                <p>{guide.content}</p>
              </div>

              {guide.tags && guide.tags.length > 0 && (
                <div className="tags">
                  <strong>Tags:</strong> {guide.tags.join(', ')}
                </div>
              )}

              <div className="meta">
                <small>Created: {new Date(guide.createdAt).toLocaleDateString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GuidesPage;