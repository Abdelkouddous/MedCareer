// src/assets/wrappers/AllJobsWrapper.js
import styled from "styled-components";

export const JobCardWrapper = styled.article`
  background: var(--background-secondary-color);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-3);
  }

  header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .main-icon {
    width: 60px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    font-size: 1.5rem;
    font-weight: 700;
    background: var(--primary-500);
    color: var(--white);
  }

  .info {
    h5 {
      font-size: 1.2rem;
      margin-bottom: 0.5rem;
      color: var(--text-color);
    }

    p {
      color: var(--text-secondary-color);
      margin: 0;
    }
  }

  .content-center {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .job-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: var(--background-color);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: var(--primary-50);
    }

    .job-icon {
      color: var(--primary-500);
      font-size: 1rem;
    }

    span:last-child {
      color: var(--text-color);
      font-size: 0.9rem;
    }
  }

  .status {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 500;
    text-transform: capitalize;

    &.pending {
      background: var(--warning-light);
      color: var(--warning-dark);
    }
    &.interview {
      background: var(--primary-100);
      color: var(--primary-500);
    }
    &.assessment {
      background: var(--info-light);
      color: var(--info-dark);
    }
    &.offered {
      background: var(--success-light);
      color: var(--success-dark);
    }
    &.declined {
      background: var(--error-light);
      color: var(--error-dark);
    }
  }

  .actions {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;

    button {
      flex: 1;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }

    .edit-btn {
      background: var(--primary-100);
      color: var(--primary-500);
      &:hover {
        background: var(--primary-500);
        color: var(--white);
      }
    }

    .delete-btn {
      background: var(--error-light);
      color: var(--error-dark);
      &:hover {
        background: var(--error-dark);
        color: var(--white);
      }
    }
  }
`;

export const SearchFormWrapper = styled.div`
  background: var(--background-secondary-color);
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-2);

  .form-center {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    align-items: end;
  }

  .form-row {
    margin-bottom: 0;
  }

  .form-label {
    display: block;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
    color: var(--text-color);
  }

  .form-input,
  .form-select {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    background: var(--background-color);
    border: 1px solid var(--grey-200);
    color: var(--text-color);
    transition: all 0.3s ease;

    &:focus {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 2px var(--primary-100);
      outline: none;
    }
  }

  .btn-block {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 0.75rem;
    background: var(--primary-500);
    color: var(--white);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background: var(--primary-700);
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    .form-center {
      grid-template-columns: 1fr;
    }
  }
`;

export const PageWrapper = styled.section`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;

  .page-title {
    font-size: 1.75rem;
    margin-bottom: 2rem;
    color: var(--text-color);
  }

  .jobs-count {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    color: var(--text-secondary-color);
  }

  .jobs {
    display: grid;
    gap: 2rem;
  }

  .no-jobs {
    text-align: center;
    padding: 3rem;
    background: var(--background-secondary-color);
    border-radius: 12px;
    color: var(--text-secondary-color);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;
