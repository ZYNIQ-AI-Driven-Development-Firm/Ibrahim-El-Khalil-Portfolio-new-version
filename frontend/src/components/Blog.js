import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as API from '../services/apiService';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadBlogs();
  }, [filter]);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const status = filter === 'all' ? null : filter;
      const blogData = await API.getBlogs(status);
      setBlogs(blogData || []);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(blogData.map(blog => blog.category).filter(Boolean))];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBlog = async (blogId) => {
    try {
      const blog = await API.getBlog(blogId);
      setSelectedBlog(blog);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading blog:', error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedBlog(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  if (loading) {
    return (
      <section id="blog" className="mb-16">
        <div className="glass-card rounded-2xl p-6 md:p-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-white/10 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="h-48 bg-white/10 rounded-xl"></div>
                  <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="mb-16">
      <div className="glass-card rounded-2xl p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
              <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <span className="bg-gradient-to-r from-primary-500 to-primary-300 bg-clip-text text-transparent">
                Blog & Insights
              </span>
            </h2>
            <p className="text-gray-400">
              Thoughts on technology, development, and innovation
            </p>
          </div>
          <Link
            to="/blog"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            All Posts
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'published'
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            Published
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === category
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <svg className="w-20 h-20 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.slice(0, 6).map((blog) => (
              <div
                key={blog.id}
                onClick={() => openBlog(blog.id)}
                className="group cursor-pointer bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-primary-500/50 transition-all hover:transform hover:scale-105"
              >
                {/* Featured Image */}
                {blog.featured_image ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={blog.featured_image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-primary-500/20 to-primary-900/20 flex items-center justify-center">
                    <svg className="w-16 h-16 text-primary-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  {/* Category & Date */}
                  <div className="flex items-center gap-3 mb-3 text-sm">
                    {blog.category && (
                      <span className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded-md">
                        {blog.category}
                      </span>
                    )}
                    <span className="text-gray-500">
                      {formatDate(blog.published_date || blog.created_at)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-2 text-white group-hover:text-primary-400 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {blog.excerpt}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      {blog.reading_time && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {blog.reading_time} min read
                        </span>
                      )}
                      {blog.views > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {blog.views} views
                        </span>
                      )}
                    </div>
                    {blog.ai_generated && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-md flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        AI
                      </span>
                    )}
                  </div>

                  {/* Tags */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {blog.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Blog Detail Modal */}
      {showModal && selectedBlog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-2xl border border-primary-500/30 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur-sm border-b border-white/10 p-6 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {selectedBlog.category && (
                    <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-md text-sm">
                      {selectedBlog.category}
                    </span>
                  )}
                  <span className="text-gray-500 text-sm">
                    {formatDate(selectedBlog.published_date || selectedBlog.created_at)}
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedBlog.title}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                  <span>By {selectedBlog.author}</span>
                  {selectedBlog.reading_time && <span>• {selectedBlog.reading_time} min read</span>}
                  {selectedBlog.views && <span>• {selectedBlog.views} views</span>}
                </div>
              </div>
              <button
                onClick={closeModal}
                className="ml-4 p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Featured Image */}
            {selectedBlog.featured_image && (
              <div className="w-full h-64 md:h-96 overflow-hidden">
                <img
                  src={selectedBlog.featured_image}
                  alt={selectedBlog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Modal Content */}
            <div className="p-6 md:p-8">
              {/* Excerpt */}
              {selectedBlog.excerpt && (
                <p className="text-lg text-gray-300 italic mb-6 pb-6 border-b border-white/10">
                  {selectedBlog.excerpt}
                </p>
              )}

              {/* Main Content */}
              <div className="prose prose-invert prose-primary max-w-none">
                <div
                  className="text-gray-300 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: selectedBlog.content.replace(/\n/g, '<br />') }}
                />
              </div>

              {/* Tags */}
              {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                <div className="mt-8 pt-6 border-t border-white/10">
                  <h4 className="text-sm font-semibold text-gray-400 mb-3">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedBlog.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Blog;
