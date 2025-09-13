// import styled from "styled-components";

// const Wrapper = styled.nav`
//   height: var(--nav-height);
//   display: flex;
//   line-height: 1rem;
//   margin: 0 1rem 1rem;

//   align-items: center;
//   justify-content: space-between;
//   box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
//   background: var(--background-secondary-color);
//   .nav-center {
//     display: flex;
//     width: 90vw;
//     align-items: center;
//     justify-content: space-between;
//   }
//   .toggle-btn {
//     background: transparent;
//     border-color: transparent;
//     font-size: 1.75rem;
//     color: var(--primary-500);
//     cursor: pointer;
//     display: flex;
//     align-items: center;
//   }
//   .logo-text {
//     display: none;
//   }
//   .logo {
//     display: flex;
//     align-items: center;
//     width: 100px;
//   }
//   .btn-container {
//     display: flex;
//     align-items: center;
//   }
//   @media (min-width: 992px) {
//     position: sticky;
//     top: 0;
//     .nav-center {
//       width: 90%;
//     }
//     .logo {
//       display: none;
//     }
//     .logo-text {
//       display: block;
//     }
//   }
// `;
// export default Wrapper;

// client/src/assets/wrappers/Navbar.js
import styled from "styled-components";

const Wrapper = styled.nav`
  height: var(--nav-height);
  display: flex;
  line-height: 1rem;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.1);
  background: var(--background-secondary-color);

  .nav-center {
    display: flex;
    width: 90vw;
    align-items: center;
    justify-content: space-between;
    margin: 0 auto;
  }

  .toggle-btn {
    background: transparent;
    border-color: transparent;
    font-size: 1.75rem;
    color: var(--primary-500);
    cursor: pointer;
    display: flex;
    align-items: center;
  }

  .logo-text {
    display: none;
  }

  .logo {
    display: flex;
    align-items: center;
    width: 100px;
  }

  .btn-container {
    display: flex;
    align-items: center;
  }

  .nav-links {
    display: none;
  }

  .mobile-menu {
    display: none;
    position: absolute;
    top: var(--nav-height);
    left: 0;
    right: 0;
    background: var(--background-secondary-color);
    padding: 1rem;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

    &.show {
      display: block;
    }

    a {
      display: block;
      padding: 0.5rem 1rem;
      color: var(--text-color);
      text-decoration: none;
      transition: all 0.3s ease;

      &:hover {
        color: var(--primary-500);
        background: var(--background-color);
      }
    }
  }

  @media (min-width: 992px) {
    position: sticky;
    top: 0;

    .nav-center {
      width: 90%;
    }

    .logo {
      display: none;
    }

    .logo-text {
      display: block;
    }

    .nav-links {
      display: flex;
      gap: 2rem;
      align-items: center;

      a {
        color: var(--text-color);
        text-decoration: none;
        transition: all 0.3s ease;

        &:hover {
          color: var(--primary-500);
        }
      }
    }

    .toggle-btn {
      display: none;
    }

    .mobile-menu {
      display: none !important;
    }
  }
`;

export default Wrapper;
