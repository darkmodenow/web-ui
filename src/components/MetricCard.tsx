interface MetricCardProps {
  icon: string;
  value: string;
  label: string;
}

export const MetricCard = ({ icon, value, label }: MetricCardProps) => {
  return (
    <div className="metric-card">
      <div className="metric-icon">
        <i className={`fas ${icon} fa-2x`} />
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
    </div>
  );
}; 