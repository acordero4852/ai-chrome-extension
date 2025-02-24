import { useState } from 'react';

function App() {
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [autoComplete, setAutoComplete] = useState(false);

  const aiModels = [
    { id: 'llama-3.3-70b-versatile 3.3', name: 'Llama 3.3' },
    { id: 'mixtral-8x7b-32768', name: 'Mixtral-8x' },
    { id: 'gemma2-9b-it2', name: 'Gemma 2' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Selected Model:', selectedModel);
    console.log('Autocompletion:', autoComplete);
  };

  return (
    <div className="w-full max-w-md bg-slate-900 shadow-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-slate-50 text-center">
        AI Configuration
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="model"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Select AI Model
          </label>
          <select
            id="model"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full bg-slate-800 text-slate-50 rounded-md px-3 py-2 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all"
          >
            {aiModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between">
          <label
            htmlFor="autocomplete"
            className="text-sm font-medium text-slate-300"
          >
            Enable Autocompletion
          </label>
          <button
            type="button"
            role="switch"
            aria-checked={autoComplete}
            onClick={() => setAutoComplete(!autoComplete)}
            className={`${
              autoComplete ? 'bg-cyan-500' : 'bg-slate-700'
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900`}
          >
            <span
              className={`${
                autoComplete ? 'translate-x-6' : 'translate-x-1'
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />
          </button>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-cyan-500 rounded-md hover:bg-cyan-600 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Save Configuration
        </button>
      </form>
    </div>
  );
}

export default App;
