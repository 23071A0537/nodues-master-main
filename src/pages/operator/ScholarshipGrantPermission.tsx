import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api";
import "./ScholarshipGrantPermission.css";

const ScholarshipGrantPermission: React.FC = () => {
  const { dueId } = useParams<{ dueId: string }>();
  const navigate = useNavigate();
  const [due, setDue] = useState<any>(null);
  const [description, setDescription] = useState("");
  const [documentationUrl, setDocumentationUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user") || "{}");
    if (user.department !== "SCHOLARSHIP") {
      setError("Only Scholarship Department can access this page ❌");
      return;
    }
    fetchDueDetails();
  }, [dueId]);

  const fetchDueDetails = async () => {
    try {
      const res = await api.get(`/operator/scholarship/${dueId}`);
      setDue(res.data);
      setDescription(res.data.description || "");
    } catch (err) {
      setError("Failed to fetch due details ❌");
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setError("Due description is mandatory ❌");
      return;
    }

    if (!documentationUrl.trim()) {
      setError("Supporting documentation URL is mandatory ❌");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.put(`/operator/scholarship/grant-permission/${dueId}`, {
        description,
        documentationUrl,
      });

      setSuccess("✅ Special permission granted successfully!");
      setTimeout(() => {
        navigate("/operator/scholarship-dues");
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to grant permission ❌");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!due) {
    return <div className="scholarship-grant-container">Loading...</div>;
  }

  return (
    <div className="scholarship-grant-container">
      <div className="scholarship-grant-card">
        <h2>🎓 Grant Special Permission</h2>

        {error && <div className="scholarship-grant-error">{error}</div>}
        {success && <div className="scholarship-grant-success">{success}</div>}

        {/* Due Details Summary */}
        <div className="scholarship-grant-summary">
          <div>
            <strong>Student:</strong> {due.personName}
          </div>
          <div>
            <strong>Roll Number:</strong> {due.personId}
          </div>
          <div>
            <strong>Amount:</strong> ₹{due.amount}
          </div>
          <div>
            <strong>Due Date:</strong>{" "}
            {new Date(due.dueDate).toLocaleDateString()}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="scholarship-grant-form">
          {/* Description */}
          <div className="form-group">
            <label>
              Due Description <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide clear description of the scholarship issue and the special permission reason"
              rows={4}
              required
              disabled={loading}
              className="scholarship-grant-textarea"
            />
            <small>
              This will be recorded in the system and must be mandatory.
            </small>
          </div>

          {/* Documentation */}
          <div className="form-group">
            <label>
              Supporting Documentation URL{" "}
              <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              type="url"
              value={documentationUrl}
              onChange={(e) => setDocumentationUrl(e.target.value)}
              placeholder="https://drive.google.com/... or document link"
              required
              disabled={loading}
              className="scholarship-grant-input"
            />
            <small>
              Upload supporting documents (e.g., government delay letter, proof,
              etc.)
            </small>
          </div>

          {/* Info Box */}
          <div className="scholarship-grant-info">
            <p>
              <strong>ℹ️ What happens after approval:</strong>
            </p>
            <ul>
              <li>✅ Certificate eligibility will be cleared</li>
              <li>
                💰 Financial amount will still show in total dues (not waived)
              </li>
              <li>📋 Description and documentation will be recorded</li>
              <li>👤 Only Scholarship Department can grant this permission</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="scholarship-grant-submit-btn"
            style={{
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Granting Permission..." : "✅ Grant Permission"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ScholarshipGrantPermission;
