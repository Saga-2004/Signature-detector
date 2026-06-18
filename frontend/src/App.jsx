import React, { useState } from 'react';

const SIGNAL_CONFIG = {
  buying_interest: { color: 'border-green-500', bg: 'bg-green-500', emoji: '💰' },
  objection: { color: 'border-red-500', bg: 'bg-red-500', emoji: '🚧' },
  confusion: { color: 'border-blue-500', bg: 'bg-blue-500', emoji: '😕' },
  positive_sentiment: { color: 'border-emerald-500', bg: 'bg-emerald-500', emoji: '😊' },
  negative_sentiment: { color: 'border-rose-500', bg: 'bg-rose-500', emoji: '😟' },
  follow_up_request: { color: 'border-purple-500', bg: 'bg-purple-500', emoji: '📋' },
};

function App() {
  const [transcript, setTranscript] = useState('');
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!transcript.trim()) {
      setError('Please enter a transcript first.');
      return;
    }

    setLoading(true);
    setError('');
    setSignals([]);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/analyse`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ transcript })
});

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyse transcript');
      }

      setSignals(data.signals || []);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 text-brown-900 flex flex-col items-center">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-display font-bold text-brown-500">Sales Insight Analyzer</h1>
        <p className="text-lg font-bold text-brown-600 uppercase tracking-widest mt-1">
          Sales Signal Detector
        </p>
      </header>

      <main className="w-full max-w-3xl flex flex-col gap-8">
        <div className="bg-brown-100 rounded-2xl shadow-sm p-8 border border-brown-200">
          <label className="block font-display text-2xl text-brown-500 font-bold mb-4">
            Paste Meeting Transcript
          </label>
          <textarea
            className="w-full min-h-48 p-4 bg-brown-50 border-2 border-brown-200 rounded-xl focus:outline-none focus:border-brown-400 focus:ring-2 focus:ring-brown-300 mb-6 font-body text-base"
            placeholder="Rep: Pricing is $499/seat/month.&#10;Prospect: That seems steep. We pay under $200 currently.&#10;Rep: If your team closes one extra deal, it pays itself 10x.&#10;Prospect: Send me a pricing deck and I'll get back to you."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-brown-500 hover:bg-brown-600 active:bg-brown-700 text-white font-body font-bold text-lg rounded-xl px-8 py-4 transition-colors disabled:bg-brown-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analysing...
              </>
            ) : (
              'Analyse Transcript →'
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl border-l-4 border-red-500 font-bold">
            {error}
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center py-8 text-brown-600">
            <div className="w-10 h-10 border-4 border-brown-200 border-t-brown-500 rounded-full animate-spin mb-4"></div>
            <p className="font-bold">Analysing signals...</p>
          </div>
        )}

        {!loading && signals.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-2xl font-bold text-brown-700">
              Detected Signals ({signals.length} found)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {signals.map((signal, index) => {
                const config = SIGNAL_CONFIG[signal.type] || { color: 'border-brown-400', bg: 'bg-brown-400', emoji: '📌' };
                
                return (
                  <div key={index} className={`bg-white rounded-2xl shadow p-5 border-l-4 ${config.color}`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{config.emoji}</span>
                      <span className={`${config.bg} text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}>
                        {signal.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="italic text-brown-600 bg-brown-50 rounded-lg p-3 my-3 border border-brown-100">
                      "{signal.quote}"
                    </p>
                    <div className="flex items-start gap-2 mt-4 text-brown-900 font-bold bg-brown-50 p-3 rounded-lg">
                      <span>💡</span>
                      <p>{signal.tip}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!loading && !error && signals.length === 0 && transcript && (
          <div className="text-center py-10 bg-white rounded-2xl shadow border border-dashed border-brown-300">
            <p className="text-brown-500 font-bold italic">No signals detected</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
