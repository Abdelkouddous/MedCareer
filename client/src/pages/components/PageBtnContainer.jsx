import { HiChevronDoubleLeft, HiChevronDoubleRight } from "react-icons/hi";
import Wrapper from "../../assets/wrappers/PageBtnContainer";
import { useAllJobsContext } from "../jobs-operations/AllJobs";

const PageBtnContainer = () => {
  const { numOfPages, page, changePage } = useAllJobsContext();

  // handle page change
  const handlePageChange = (pageNumber) => {
    changePage(pageNumber);
  };

  // page button to switch between pages
  const addPageButton = ({ pageNumber, activeClass }) => {
    return (
      <button
        className={`page-btn ${
          activeClass ? "active" : ""
        } hover:bg-primary-500 transition-colors`}
        key={pageNumber}
        onClick={() => handlePageChange(pageNumber)}
      >
        {pageNumber}
      </button>
    );
  };

  // render page buttons
  const renderPageButtons = () => {
    const pageButtons = [];
    for (let i = 1; i <= numOfPages; i++) {
      pageButtons.push(
        addPageButton({ pageNumber: i, activeClass: i === page })
      );
    }
    return pageButtons;
  };

  return (
    <Wrapper>
      <div className="nav-row">
        <button
          className="btn btn-primary rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
          onClick={() => handlePageChange(page - 10)}
          disabled={page === 1}
        >
          {page - 10 < 1 ? 1 : page - 10}
        </button>

        <button
          className="prev-btn"
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
        >
          <HiChevronDoubleLeft className="w-5 h-5" />
        </button>

        <div className="btn-container">{renderPageButtons()}</div>

        <button
          className="next-btn"
          onClick={() => handlePageChange(page + 1)}
          disabled={page === numOfPages}
        >
          <HiChevronDoubleRight className="w-5 h-5" />
        </button>

        <button
          className="btn btn-primary rounded-full px-4 py-2 hover:opacity-90 transition-opacity"
          onClick={() => handlePageChange(page + 10)}
          disabled={page === numOfPages || page + 10 > numOfPages}
        >
          {Math.min(page + 10, numOfPages)}
        </button>
      </div>
    </Wrapper>
  );
};

export default PageBtnContainer;
