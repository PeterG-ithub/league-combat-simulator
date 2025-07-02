import React, { useState, useEffect } from 'react';

const ChampionSelectGrid = () => {
  const [selectedChampion, setSelectedChampion] = useState(null);
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load champion data from your JSON file
  useEffect(() => {
    const loadChampions = async () => {
      try {
        const response = await fetch('/data/champion.json');
        if (!response.ok) {
          throw new Error('Failed to load champion data');
        }
        const data = await response.json();
        
        // Convert the champion data object to an array
        const championArray = Object.values(data.data).map(champion => ({
          id: champion.id,
          name: champion.name,
          title: champion.title,
          // Use your local champion images
          image: `/img/champion/${champion.id}.png`,
          tags: champion.tags,
          stats: champion.stats
        }));
        
        // Sort alphabetically by name
        championArray.sort((a, b) => a.name.localeCompare(b.name));
        
        setChampions(championArray);
        setLoading(false);
      } catch (err) {
        console.error('Error loading champions:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadChampions();
  }, []);

  // Handle image load errors with fallback
  const handleImageError = (e) => {
    e.target.src = '/api/placeholder/64/64';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading champions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-red-400 text-xl">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Champion Select
        </h1>
        
        {/* Champion Grid */}
        <div className="grid grid-cols-12 gap-2 p-4 bg-gray-800/50 rounded-lg backdrop-blur-sm border border-gray-700/50">
          {champions.map((champion) => (
            <div
              key={champion.id}
              className={`
                relative group cursor-pointer transition-all duration-200 ease-in-out
                ${selectedChampion === champion.name 
                  ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-800 scale-105' 
                  : 'hover:scale-105 hover:ring-1 hover:ring-gray-400'
                }
              `}
              onClick={() => setSelectedChampion(champion.name)}
              title={`${champion.name} - ${champion.title}`}
            >
              {/* Champion Portrait */}
              <div className="aspect-square bg-gray-700 rounded border border-gray-600 overflow-hidden">
                <img
                  src={champion.image}
                  alt={champion.name}
                  className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-200"
                  onError={handleImageError}
                />
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
              
              {/* Champion Name */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                <p className="text-white text-xs font-medium text-center truncate">
                  {champion.name}
                </p>
              </div>
              
              {/* Selection indicator */}
              {selectedChampion === champion.name && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full border-2 border-gray-800" />
              )}
            </div>
          ))}
        </div>
        
        {/* Selected Champion Display */}
        {selectedChampion && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 bg-gray-800/70 px-6 py-3 rounded-lg border border-gray-700/50 backdrop-blur-sm">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-white font-medium">
                Selected: {selectedChampion}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChampionSelectGrid;