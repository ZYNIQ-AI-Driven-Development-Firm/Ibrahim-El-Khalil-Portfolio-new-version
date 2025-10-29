import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import * as API from '../services/apiService';

const BlogPage = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadBlogs();
  }, [filter]);

  useEffect(() => {
    if (blogId) {
      loadBlog(blogId);
    }
  }, [blogId]);

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

  const loadBlog = async (id) => {
    try {
      const blog = await API.getBlog(id);
      setSelectedBlog(blog);
    } catch (error) {
      console.error('Error loading blog:', error);
      navigate('/blog');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || 
                         (filter === 'published' && blog.status === 'published') ||
                         blog.category === filter;
    return matchesSearch && matchesFilter;
  });

  // If viewing a single blog
  if (blogId && selectedBlog) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <Link to="/blog" className="flex items-center gap-2 text-white hover:text-primary-400 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Blog</span>
              </Link>
              <Link to="/portfolio" className="text-gray-400 hover:text-white transition-colors">
                Portfolio
              </Link>
            </div>
          </div>
        </header>

        {/* Blog Content */}
        <article className="container mx-auto px-4 py-12 max-w-4xl">
          {/* Blog Header */}
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {selectedBlog.category && (
                <span className="px-3 py-1 bg-primary-500/20 text-primary-300 rounded-lg text-sm font-medium">
                  {selectedBlog.category}
                </span>
              )}
              {selectedBlog.ai_generated && (
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-sm font-medium flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  AI Generated
                </span>
              )}
              <span className="text-gray-500 text-sm">
                {formatDate(selectedBlog.published_date || selectedBlog.created_at)}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {selectedBlog.title}
            </h1>
            
            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <span>By {selectedBlog.author || 'Ibrahim El Khalil'}</span>
              {selectedBlog.reading_time && <span>• {selectedBlog.reading_time} min read</span>}
              {selectedBlog.views && <span>• {selectedBlog.views} views</span>}
            </div>

            {selectedBlog.excerpt && (
              <p className="text-xl text-gray-300 italic leading-relaxed">
                {selectedBlog.excerpt}
              </p>
            )}
          </header>

          {/* Featured Image */}
          {selectedBlog.featured_image && (
            <div className="mb-12 rounded-2xl overflow-hidden">
              <img
                src={selectedBlog.featured_image}
                alt={selectedBlog.title}
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg prose-invert prose-primary max-w-none mb-12">
            <div
              className="text-gray-300 leading-relaxed blog-content"
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />
          </div>

          {/* Tags */}
          {selectedBlog.tags && selectedBlog.tags.length > 0 && (
            <div className="pt-8 border-t border-white/10">
              <h3 className="text-sm font-semibold text-gray-400 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {selectedBlog.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white/5 text-gray-400 rounded-lg text-sm hover:bg-white/10 transition-colors cursor-pointer">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    );
  }

  // Blog List View
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <Link to="/portfolio" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Portfolio
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-3">
                <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                Blog & Insights
              </h1>
              <p className="text-gray-400 mt-1">
                Thoughts on technology, development, and innovation
              </p>
            </div>
            
            {/* Search */}
            <div className="relative max-w-md w-full">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 mb-12">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            All Posts ({blogs.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              filter === 'published'
                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
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
                  ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-white/5 rounded-xl mb-4"></div>
                <div className="h-4 bg-white/5 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/5 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-24">
            <svg className="w-24 h-24 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p className="text-gray-400 text-xl mb-2">No blog posts found</p>
            <p className="text-gray-500">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog) => (
              <Link
                key={blog.id}
                to={`/blog/${blog.id}`}
                className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-primary-500/50 transition-all hover:transform hover:scale-105"
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
                          {blog.reading_time} min
                        </span>
                      )}
                      {blog.views > 0 && (
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          {blog.views}
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
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-24">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400 text-sm">
          © 2025 IEK Portfolio By ZYNIQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default BlogPage;
