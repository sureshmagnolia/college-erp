'use client';

import { useState, useEffect } from 'react';
import { getNaacCategories, submitNaacRecord } from '@/app/actions/naac';

// Hardcoded for demo
const FACULTY_ID = 'faculty_1';

export default function SubmitNaacData() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadCategories() {
      const { categories } = await getNaacCategories();
      if (categories) setCategories(categories);
    }
    loadCategories();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    
    const formData = new FormData(event.currentTarget);
    formData.append('faculty_id', FACULTY_ID);
    
    const result = await submitNaacRecord(formData);
    
    if (result.error) {
      setMessage(`Error: ${result.error}`);
    } else {
      setMessage('Achievement successfully submitted to IQAC!');
      (event.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow sm:rounded-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Submit NAAC / IQAC Data</h1>
        
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">NAAC Criteria Category</label>
            <select name="category_id" required className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border">
              <option value="">Select Category...</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.criteria_number} - {cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title of Activity / Publication</label>
            <input type="text" name="title" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="date" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description (Optional)</label>
            <textarea name="description" rows={3} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Link to Evidence (DOI, Certificate URL)</label>
            <input type="url" name="evidence_link" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://" />
          </div>

          <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400">
            {loading ? 'Submitting...' : 'Submit to IQAC'}
          </button>

          {message && (
            <div className={`mt-4 text-sm text-center ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
