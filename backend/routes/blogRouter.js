import { Router } from "express";
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogLike,
  addBlogComment,
  deleteBlogComment,
  getBlogCategories,
  getPopularBlogs,
} from "../controllers/blogController.js";
import {
  authenticateUser,
  authorizePermissions,
  allowGuestForViewing,
} from "../middleware/authMiddleware.js";

const router = Router();

// Public routes (accessible by everyone)
router.get("/categories", getBlogCategories);
router.get("/popular", getPopularBlogs);
router.get("/", allowGuestForViewing, getAllBlogs);
router.get("/:id", allowGuestForViewing, getBlogById);

// Protected routes for authenticated users (like and comment)
router.post("/:id/like", authenticateUser, toggleBlogLike);
router.post("/:id/comments", authenticateUser, addBlogComment);
router.delete("/:id/comments/:commentId", authenticateUser, deleteBlogComment);

// Authenticated routes (employers, job seekers, and admins can create blogs)
router.post(
  "/",
  authenticateUser,
  authorizePermissions("employer", "admin", "jobseeker"),
  createBlog
);
router.patch(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  updateBlog
);
router.delete(
  "/:id",
  authenticateUser,
  authorizePermissions("admin"),
  deleteBlog
);

export default router;
