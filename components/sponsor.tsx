import React from 'react';

interface Sponsor {
  name: string;
  logo: string;
}

const sponsors: Sponsor[] = Array.from({ length: 17}, (_, i) => {
  const num = i + 50; 
  return {
    name: `Sponsor ${num}`,
    logo: `/assets/logos/image ${num}.png`,
  };
});

const SponsorsGrid: React.FC = () => {
  const columns = 3;
  const fullRowsCount = Math.floor(sponsors.length / columns);
  const itemsInLastRow = sponsors.length % columns;

  const fullRows = sponsors.slice(0, fullRowsCount * columns);
  const lastRow = sponsors.slice(fullRowsCount * columns);

  return (
    <div 
  className="min-h-screen bg-black py-16 px-4 bg-[url('/assets/logos/bg.png')] bg-cover bg-center bg-no-repeat"
>
  <div className="max-w-7xl mx-auto">
    <h1 className="text-5xl md:text-6xl font-bold text-white text-center mb-16">
      Sponsors
    </h1>

    {/* FULL ROWS */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {fullRows.map((sponsor, index) => (
        <div
          key={index}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 flex items-center justify-center hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105"
        >
          <img src={sponsor.logo} alt={sponsor.name} className="max-w-full h-auto object-contain" />
        </div>
      ))}
    </div>

    {/* LAST ROW — CENTERED */}
    {itemsInLastRow > 0 && (
      <div className="flex justify-center gap-6 mt-6">
        {lastRow.map((sponsor, index) => (
          <div
            key={`last-${index}`}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-8 flex items-center justify-center hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105"
          >
            <img src={sponsor.logo} alt={sponsor.name} className="max-w-full h-auto object-contain" />
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
};


export default SponsorsGrid;