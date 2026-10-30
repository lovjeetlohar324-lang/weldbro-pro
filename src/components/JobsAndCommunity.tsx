import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { JobPosting, CommunityPost } from '../types';
import {
  Briefcase,
  Users,
  MessageSquare,
  ThumbsUp,
  Plus,
  Send,
  MapPin,
  Clock,
  Sparkles,
  PhoneCall,
  Flame,
  CheckCircle2,
  Paperclip,
  Share2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const JobsAndCommunity: React.FC = () => {
  const {
    jobs,
    postJob,
    communityPosts,
    addCommunityPost,
    likeCommunityPost,
    chatMessages,
    sendChatMessage,
    currentUser,
    playSparkSound
  } = useApp();

  const [activeTab, setActiveTab] = useState<'jobs' | 'community' | 'chat'>('jobs');

  // Job Posting Form Modal
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [jobTitle, setJobTitle] = useState('');
  const [jobWage, setJobWage] = useState('₹22,000 - ₹26,000 / month');
  const [jobType, setJobType] = useState<JobPosting['type']>('Full-time');
  const [jobLocation, setJobLocation] = useState('Barmer, Rajasthan');
  const [jobSkills, setJobSkills] = useState('TIG Welding, SS-304 Railings');
  const [jobDesc, setJobDesc] = useState('');

  // Community Post Form
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostCategory, setNewPostCategory] = useState<CommunityPost['category']>('Welding Tips');

  // Chat message state
  const [chatInput, setChatInput] = useState('');

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    playSparkSound();
    confetti({ particleCount: 30, spread: 60 });
    const newJ: JobPosting = {
      id: `job-${Date.now()}`,
      title: jobTitle,
      shopName: currentUser.shopName || 'WeldBro Workshop Network',
      location: jobLocation,
      wage: jobWage,
      type: jobType,
      skillsRequired: jobSkills.split(',').map((s) => s.trim()),
      contactPhone: currentUser.phone,
      postedDate: 'Just now',
      description: jobDesc
    };
    postJob(newJ);
    setJobModalOpen(false);
  };

  const handlePostCommunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    playSparkSound();
    addCommunityPost(newPostContent, newPostCategory);
    setNewPostContent('');
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    playSparkSound();
    sendChatMessage({
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      text: chatInput
    });
    setChatInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>GLOBAL WELDING ECOSYSTEM</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-wide mt-1">
            JOBS, CONTRACTORS &amp; COMMUNITY
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Hire skilled fabricators, apply for high-wage welding openings, discuss steel rates, and direct chat with clients.
          </p>
        </div>

        {/* Sub-tab pills */}
        <div className="flex items-center p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('jobs');
              playSparkSound();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors ${
              activeTab === 'jobs'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Welding Jobs ({jobs.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('community');
              playSparkSound();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors ${
              activeTab === 'community'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Community Hub
          </button>
          <button
            onClick={() => {
              setActiveTab('chat');
              playSparkSound();
            }}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-colors ${
              activeTab === 'chat'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Direct Messages
          </button>
        </div>
      </div>

      {/* View 1: Jobs Portal */}
      {activeTab === 'jobs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Showing verified welding career openings &amp; contractor gigs:
            </span>
            <button
              onClick={() => {
                setJobModalOpen(true);
                playSparkSound();
              }}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-600 hover:from-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Post a Welding Job</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300">
                        {job.type}
                      </span>
                      <h3 className="text-lg font-bold font-heading text-white mt-2 leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs text-amber-400 font-mono font-semibold mt-0.5">
                        {job.shopName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{job.location}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 mb-3">
                    <span className="text-[10px] text-slate-500 font-mono block">Remuneration / Wage:</span>
                    <span className="text-base font-bold font-mono text-emerald-400">{job.wage}</span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skillsRequired.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Posted {job.postedDate}
                  </span>
                  <a
                    href={`tel:${job.contactPhone}`}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 border border-slate-700"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Apply / Call</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 2: Community Forum */}
      {activeTab === 'community' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Feed */}
          <div className="lg:col-span-8 space-y-4">
            {/* Post creator */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block mb-2">
                Share a Technique, Machine Setup, or Rate Card
              </span>
              <form onSubmit={handlePostCommunity} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="Share electrode tips, argon shielding tricks, or daily steel prices..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-400"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <select
                    value={newPostCategory}
                    onChange={(e) => setNewPostCategory(e.target.value as CommunityPost['category'])}
                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300"
                  >
                    <option value="Welding Tips">Welding Tips</option>
                    <option value="Machine Setup">Machine Setup &amp; Gas</option>
                    <option value="Design Showcase">Design Showcase</option>
                    <option value="Safety">Safety &amp; Protective Gear</option>
                    <option value="Rate Card Discussion">Rate Card Discussion</option>
                  </select>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Publish Post</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Posts List */}
            {communityPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white text-sm block">{post.authorName}</span>
                    <span className="text-[11px] text-amber-400 font-mono">
                      {post.authorRole} · {post.authorShop}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {post.category}
                  </span>
                </div>

                <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  {post.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => likeCommunityPost(post.id)}
                      className={`flex items-center gap-1.5 transition-colors ${
                        post.hasLiked ? 'text-amber-400 font-bold' : 'hover:text-white'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{post.likes} Likes</span>
                    </button>
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{post.commentsCount} Comments</span>
                    </span>
                  </div>
                  <span>{post.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Technical Reference Box */}
          <div className="lg:col-span-4 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>ELECTRODE QUICK GUIDE</span>
            </h3>

            <div className="space-y-2.5 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-amber-400 font-bold block">E6013 (Rutile):</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Best for thin sheet metal, grills, gates. Easy strike, low spatter, smooth bead.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-cyan-400 font-bold block">E7018 (Low Hydrogen):</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Heavy structural steel, trusses, sheds, load-bearing joints. Crack resistant.
                </p>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-emerald-400 font-bold block">SS-308L / 316L (TIG):</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Stainless steel handrails, architectural gates. Pure Argon shielding gas.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 3: In-App Chat */}
      {activeTab === 'chat' && (
        <div className="max-w-3xl mx-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden flex flex-col h-[520px]">
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold">
                WB
              </div>
              <div>
                <p className="text-xs font-bold text-white">Project Consultation Room</p>
                <p className="text-[10px] text-emerald-400 font-mono">Connected &amp; Encrypted</p>
              </div>
            </div>
            <span className="text-xs font-mono text-slate-500">Live Socket</span>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/40">
            {chatMessages.map((msg) => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <span className="text-[10px] font-mono text-slate-500 mb-0.5 px-1">
                    {msg.senderName} ({msg.senderRole.toUpperCase()})
                  </span>
                  <div
                    className={`max-w-md rounded-2xl px-4 py-2.5 text-xs shadow-md ${
                      isMe
                        ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none'
                        : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <span
                      className={`block text-[9px] font-mono text-right mt-1 ${
                        isMe ? 'text-slate-800' : 'text-slate-400'
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type message, measurement query, or quotation details..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      )}

      {/* Post a Job Modal */}
      {jobModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setJobModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold font-heading text-white mb-1">
              POST A WELDING RECRUITMENT NOTICE
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Reach thousands of skilled fabricators across India.
            </p>

            <form onSubmit={handleCreateJob} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Job Designation</label>
                <input
                  type="text"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g. Senior Argon TIG Welder for Luxury Railings"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Wage / Salary</label>
                  <input
                    type="text"
                    required
                    value={jobWage}
                    onChange={(e) => setJobWage(e.target.value)}
                    placeholder="e.g. ₹850 / day or ₹25,000 / month"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Job Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as JobPosting['type'])}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Daily Wage">Daily Wage</option>
                    <option value="Project Based">Project Based</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Location (City, State)</label>
                <input
                  type="text"
                  required
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  placeholder="e.g. Barmer, Rajasthan"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Skills Required (Comma separated)</label>
                <input
                  type="text"
                  value={jobSkills}
                  onChange={(e) => setJobSkills(e.target.value)}
                  placeholder="e.g. TIG, ARC, SS-304, Blueprint Reading"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Job Description &amp; Benefits</label>
                <textarea
                  rows={3}
                  required
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                  placeholder="Accommodation, lunch, overtime details..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/20"
                >
                  Publish Welding Opening
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
