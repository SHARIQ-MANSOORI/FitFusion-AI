import { useState, useEffect } from 'react';
import api from '../services/api';

const Progress = () => {
  const [records, setRecords] = useState([]);
  const [weight, setWeight] = useState('');
  const [notes, setNotes] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch all user progress records on mount
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/progress/my');
        setRecords(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const resetForm = () => {
    setWeight('');
    setNotes('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        weight: Number(weight),
        notes,
      };

      if (editingId) {
        const res = await api.put(`/progress/${editingId}`, payload);
        setRecords((prev) => prev.map((r) => (r._id === editingId ? res.data : r)));
        resetForm();
      } else {
        const res = await api.post('/progress/add', payload);
        setRecords((prev) => [res.data, ...prev]);
        resetForm();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (record) => {
    setError('');
    setEditingId(record._id);
    setWeight(record.weight);
    setNotes(record.notes || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    setError('');

    try {
      await api.delete(`/progress/${id}`);
      setRecords((prev) => prev.filter((r) => r._id !== id));
      if (editingId === id) resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const latestWeight = records.length > 0 ? records[0]?.weight : null;
  const initialWeight = records.length > 0 ? records[records.length - 1]?.weight : null;

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2>Progress Tracker</h2>
          <p className="card-subtitle">
            Log your daily or weekly weight changes and notes to visualize your fitness transformation.
          </p>
        </div>

        {error && <p className="error-text">⚠️ {error}</p>}

        {records.length > 0 && (
          <div className="stats-row">
            <div className="stat-box">
              <div className="stat-label">Latest Weight</div>
              <div className="stat-value">{latestWeight} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>kg</span></div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Initial Weight</div>
              <div className="stat-value">{initialWeight} <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>kg</span></div>
            </div>
            <div className="stat-box">
              <div className="stat-label">Total Entries</div>
              <div className="stat-value">{records.length}</div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid-2">
            <div>
              <label htmlFor="weight">Weight (kg)</label>
              <input
                id="weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="e.g. 74.5"
                required
              />
            </div>
            <div>
              <label htmlFor="notes">Notes / Observations</label>
              <input
                id="notes"
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Morning fasted weigh-in, felt energetic"
              />
            </div>
          </div>

          <div style={{ marginTop: '0.5rem' }}>
            <button type="submit" disabled={saving}>
              {editingId
                ? saving
                  ? 'Updating...'
                  : 'Update'
                : saving
                ? 'Adding...'
                : 'Add'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {loading ? (
        <p className="loading-text">Loading records...</p>
      ) : records.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📊</div>
          <p style={{ fontWeight: 600, fontSize: '1.1rem', color: '#f8fafc', marginBottom: '0.25rem' }}>No records yet</p>
          <p style={{ margin: 0 }}>Add your first weight log using the form above to start tracking your transformation.</p>
        </div>
      ) : (
        <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <h3 style={{ margin: 0 }}>History Log</h3>
          </div>
          <div className="table-container" style={{ margin: 0, border: 'none', borderRadius: 0 }}>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r) => (
                  <tr key={r._id}>
                    <td>{new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td><strong style={{ color: '#10b981' }}>{r.weight} kg</strong></td>
                    <td style={{ color: r.notes ? '#e2e8f0' : '#64748b' }}>{r.notes || '—'}</td>
                    <td>
                      <button type="button" onClick={() => handleEdit(r)}>
                        Edit
                      </button>
                      <button type="button" onClick={() => handleDelete(r._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Progress;
