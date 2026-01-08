import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Form, Link } from "react-router-dom";
import customFetch from "../utils/customFetch.js";
import { useLoaderData } from "react-router-dom";
import { toast } from "react-toastify";
import Wrapper from "../assets/wrappers/Dashboard.js";

// Blog Card Component
const BlogCard = ({ blog, user, onLike }) => {
  const [isLiked, setIsLiked] = useState(blog.isLiked || false);
  const [likeCount, setLikeCount] = useState(blog.likes?.length || 0);

  const handleLike = async () => {
    if (!user) {
      toast.error("Please login to like blogs");
      return;
    }

    try {
      const response = await customFetch.post(`/blogs/${blog._id}/like`);
      setIsLiked(response.data.isLiked);
      setLikeCount(response.data.likeCount);
      onLike &&
        onLike(blog._id, response.data.isLiked, response.data.likeCount);
    } catch (error) {
      console.error("Error liking blog:", error);
      toast.error("Failed to update like");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="bg-[var(--background-secondary-color)] rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      {blog.featuredImage && (
        <div className="h-48 overflow-hidden">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-[var(--primary-100)] text-[var(--primary-700)] text-sm rounded-full">
            {blog.category}
          </span>
          <span className="text-[var(--text-secondary-color)] text-sm">
            {formatDate(blog.createdAt)}
          </span>
        </div>

        <h2 className="text-xl font-bold text-[var(--text-color)] mb-3 hover:text-[var(--primary-500)] transition-colors">
          <Link to={`/blogs/${blog._id}`}>{blog.title}</Link>
        </h2>

        <p className="text-[var(--text-secondary-color)] mb-4 line-clamp-3">
          {blog.excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary-color)]">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path
                  fillRule="evenodd"
                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                  clipRule="evenodd"
                />
              </svg>
              {blog.viewCount} views
            </div>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
              {blog.comments?.length || 0} comments
            </div>
          </div>

          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isLiked
                ? "bg-[var(--danger-dark)] text-[var(--danger-light)] hover:bg-[var(--primary-200)]"
                : "bg-[var(--primary-100)] text-[var(--primary-700)] hover:bg-[var(--primary-200)]"
            }`}
          >
            <svg
              className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`}
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                clipRule="evenodd"
              />
            </svg>
            {likeCount}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {blog.author?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {blog.author?.name} {blog.author?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
            </div>
          </div>

          <Link
            to={`/blogs/${blog._id}`}
            className="text-[var(--primary-500)] hover:text-[var(--primary-700)] font-medium text-sm"
          >
            Read More →
          </Link>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[var(--primary-100)] text-[var(--primary-700)] text-xs rounded"
              >
                #{tag}
              </span>
            ))}
            {blog.tags.length > 3 && (
              <span className="px-2 py-1 bg-[var(--primary-100)] text-[var(--primary-700)] text-xs rounded">
                +{blog.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
};

// PropTypes to satisfy linter for BlogCard props
BlogCard.propTypes = {
  blog: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string,
    excerpt: PropTypes.string,
    category: PropTypes.string,
    createdAt: PropTypes.string,
    featuredImage: PropTypes.string,
    viewCount: PropTypes.number,
    likes: PropTypes.array,
    comments: PropTypes.array,
    author: PropTypes.object,
    isLiked: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  user: PropTypes.object,
  onLike: PropTypes.func.isRequired,
};

// Main Blogs Component
const Blogs = () => {
  const { user } = useLoaderData();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [debouncedSearchTerm, selectedCategory, sortBy, currentPage]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        search: debouncedSearchTerm,
        category: selectedCategory,
        sort: sortBy,
        page: currentPage,
        limit: 3,
      });
      //
      const response = await customFetch.get(`/blogs?${params}`);
      setBlogs(response.data.blogs);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to fetch blogs");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await customFetch.get("/blogs/categories");
      setCategories(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleLike = (blogId, isLiked, likeCount) => {
    setBlogs((prevBlogs) =>
      prevBlogs.map((blog) =>
        blog._id === blogId
          ? { ...blog, isLiked, likes: new Array(likeCount) }
          : blog
      )
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchBlogs();
  };



  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (sort) => {
    setSortBy(sort);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background-color)] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--primary-500)]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Wrapper className="min-h-screen bg-[var(--background-color)] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--text-color)] mb-4">
            Medical Career Blog
          </h1>
          <p className="text-xl text-[var(--text-secondary-color)] max-w-3xl mx-auto">
            Stay updated with the latest insights, career advice, and industry
            trends in the medical field.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <Form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 pr-4 text-[var(--text-color)] bg-[var(--background-secondary-color)] border border-[var(--primary-300)] rounded-lg focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-5 w-5 text-[var(--text-secondary-color)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </Form>

          {/* Category and Sort Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[var(--text-color)]">
                Category:
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="px-3 py-2 text-sm border border-[var(--primary-300)] rounded-lg bg-[var(--background-secondary-color)] text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-500)]"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-[var(--text-color)]">
                Sort by:
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-2 text-sm border border-[var(--primary-300)] rounded-lg bg-[var(--background-secondary-color)] text-[var(--text-color)] focus:ring-2 focus:ring-[var(--primary-500)]"
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="popular">Most Popular</option>
                <option value="trending">Most Viewed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-[var(--text-secondary-color)] text-6xl mb-4">
              📝
            </div>
            <h3 className="text-xl font-medium text-[var(--text-color)] mb-2">
              No blogs found
            </h3>
            <p className="text-[var(--text-secondary-color)]">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {blogs.map((blog) => (
              <BlogCard
                key={blog._id}
                blog={blog}
                user={user}
                onLike={handleLike}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <nav className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm font-medium text-[var(--text-secondary-color)] bg-[var(--background-secondary-color)] border border-[var(--primary-300)] rounded-lg hover:bg-[var(--primary-100)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-lg ${
                      page === currentPage
                        ? "bg-[var(--primary-500)] text-[var(--white)]"
                        : "text-[var(--text-secondary-color)] bg-[var(--background-secondary-color)] border border-[var(--primary-300)] hover:bg-[var(--primary-100)]"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm font-medium text-[var(--text-secondary-color)] bg-[var(--background-secondary-color)] border border-[var(--primary-300)] rounded-lg hover:bg-[var(--primary-100)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default Blogs;
