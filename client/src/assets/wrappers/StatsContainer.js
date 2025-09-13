import styled from "styled-components";

const Wrapper = styled.section`
  padding: 2rem;

  .dashboard-header {
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text-color);
  }

  .section-title {
    font-size: 1.25rem;
    font-weight: 500;
    margin-bottom: 1.5rem;
    color: var(--text-color);
  }

  .stats-grid {
    display: grid;
    gap: 1.5rem;
    margin-bottom: 2rem;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  .stat-card {
    background: var(--background-secondary-color);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow-1);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-2);
    }
  }

  .stat-header {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .stat-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    font-size: 1.5rem;
  }

  .stat-info {
    flex: 1;
  }

  .stat-count {
    font-size: 1.75rem;
    font-weight: 600;
    color: var(--text-color);
    display: block;
    margin-bottom: 0.25rem;
  }

  .stat-title {
    font-size: 0.9rem;
    color: var(--text-secondary-color);
    margin: 0;
  }

  .charts-container {
    background: var(--background-secondary-color);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow-1);
    margin-bottom: 2rem;
  }

  .chart-wrapper {
    height: 350px;
  }

  .insights-section {
    margin-top: 2rem;
  }

  .insights-grid {
    display: grid;
    gap: 1.5rem;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .insight-card {
    background: var(--background-secondary-color);
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: var(--shadow-1);
  }

  .insight-title {
    font-size: 0.9rem;
    color: var(--text-secondary-color);
    margin-bottom: 0.5rem;
  }

  .insight-value {
    font-size: 1.25rem;
    font-weight: 500;
    color: var(--text-color);
    margin: 0;
  }

  @media (max-width: 768px) {
    padding: 1rem;

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .insights-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default Wrapper;
