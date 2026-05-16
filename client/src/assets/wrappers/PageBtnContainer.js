import styled from 'styled-components';

const Wrapper = styled.section`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;

  .btn-container {
    background: var(--background-secondary-color);
    border-radius: var(--border-radius);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25rem;
  }

  .page-btn {
    background: transparent;
    border-color: transparent;
    width: 44px;
    height: 40px;
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--primary-500);
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: var(--transition);
  }
  .page-btn:hover {
    background: var(--primary-100);
  }

  .active {
    background: var(--primary-500);
    color: var(--white);
  }
  .active:hover {
    background: var(--primary-500);
    color: var(--white);
  }

  .nav-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .prev-btn, .next-btn {
    background: var(--background-secondary-color);
    border-color: transparent;
    border-radius: var(--border-radius);
    width: 100px;
    height: 40px;
    color: var(--primary-500);
    text-transform: capitalize;
    letter-spacing: var(--letter-spacing);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: var(--transition);
  }

  .prev-btn:hover, .next-btn:hover {
    background: var(--primary-500);
    color: var(--white);
  }

  .dots {
    display: grid;
    place-items: center;
    cursor: text;
  }
`;

export default Wrapper;
