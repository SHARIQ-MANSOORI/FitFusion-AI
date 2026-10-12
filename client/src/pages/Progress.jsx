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

  return (
    <div>
      <h2>Progress Tracker</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="notes">Notes</label>
          <input
            id="notes"
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
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
      </form>

      {loading ? (
        <p className="loading-text">Loading records...</p>
      ) : records.length === 0 ? (
        <p>No records yet</p>
      ) : (
        <div className="table-container">
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
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>{r.weight}</td>
                  <td>{r.notes}</td>
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
      )}
    </div>
  );
};

export default Progress;
