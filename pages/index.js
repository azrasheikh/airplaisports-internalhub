import React, { useState, useMemo, useEffect } from 'react';
import { FileText, Users, Settings, BookOpen, Home, Edit2, Save, X, Search, Type, List, AlertCircle, Code, Plus, ChevronRight, ChevronDown, Play, LogOut, History, Activity, Loader } from 'lucide-react';
import { createClient } from '../lib/supabase/client';
import { getAllPages, createPage, updatePage, getNavigationItems, createNavigationItem } from '../lib/db/pages';
import { getActivityLogs, createActivityLog } from '../lib/db/activity';
import { getVersionHistory, createVersion } from '../lib/db/versions';

export default function CompanyHub() {
  const [supabase, setSupabase] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState('home');
  const [editingPage, setEditingPage] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPageModal, setShowNewPageModal] = useState(false);
  const [showActivityLog, setShowActivityLog] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageIcon, setNewPageIcon] = useState('FileText');
  const [newPageParent, setNewPageParent] = useState(null);
  const [expandedPages, setExpandedPages] = useState({});

  const [activityLog, setActivityLog] = useState([]);
  const [versionHistory, setVersionHistory] = useState({});
  const [pages, setPages] = useState({});
  const [editComponents, setEditComponents] = useState([]);
  const [draggedComponent, setDraggedComponent] = useState(null);
  const [navItems, setNavItems] = useState([]);

  const iconOptions = { Home, BookOpen, FileText, Users, Settings, AlertCircle, Code, List };

  const componentTypes = [
    { type: 'heading', label: 'Heading', icon: Type, default: { content: 'New Heading', level: 2 } },
    { type: 'text', label: 'Text', icon: FileText, default: { content: 'New text paragraph' } },
    { type: 'list', label: 'List', icon: List, default: { items: ['Item 1', 'Item 2'] } },
    { type: 'alert', label: 'Alert', icon: AlertCircle, default: { content: 'Important info' } },
    { type: 'code', label: 'Code', icon: Code, default: { content: '// Code here' } }
  ];

  // Initialize Supabase client and auth
  useEffect(() => {
    // Initialize Supabase client only on client-side
    const client = createClient();
    if (!client) {
      setLoading(false);
      return;
    }
    setSupabase(client);

    const initializeAuth = async () => {
      const { data: { session } } = await client.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id, client);
        await loadData(client);
      }

      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id, client);
        await loadData(client);
      } else {
        setUser(null);
        setProfile(null);
        setPages({});
        setNavItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserProfile = async (userId, client) => {
    const supabaseClient = client || supabase;
    if (!supabaseClient) return;

    try {
      const { data, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadData = async (client) => {
    const supabaseClient = client || supabase;
    if (!supabaseClient) return;

    try {
      // Load pages
      const pagesData = await getAllPages(supabaseClient);
      const pagesMap = {};
      pagesData.forEach(page => {
        pagesMap[page.id] = {
          title: page.title,
          parent: page.parent_id,
          icon: page.icon,
          components: page.components
        };
      });
      setPages(pagesMap);

      // Load navigation items
      const navData = await getNavigationItems(supabaseClient);
      setNavItems(navData.map(item => ({
        id: item.id,
        label: item.label,
        icon: item.icon
      })));

      // Load activity logs
      const logs = await getActivityLogs(supabaseClient);
      setActivityLog(logs.map(log => ({
        id: log.id,
        user: log.user_name,
        action: log.action,
        timestamp: new Date(log.created_at)
      })));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadVersionHistoryForPage = async (pageId) => {
    if (!supabase) return;

    try {
      const versions = await getVersionHistory(supabase, pageId);
      setVersionHistory(prev => ({
        ...prev,
        [pageId]: versions.map(v => ({
          id: v.id,
          user: v.user_name,
          timestamp: new Date(v.created_at),
          components: v.components
        }))
      }));
    } catch (error) {
      console.error('Error loading version history:', error);
    }
  };

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      alert('Supabase is not initialized. Please check your environment variables.');
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}`
        }
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in:', error.message);
      alert('Error signing in: ' + error.message);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;

    try {
      await createActivityLog(supabase, 'Signed out');
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const addActivityLog = async (action, pageId = null) => {
    if (!supabase) return;

    try {
      const log = await createActivityLog(supabase, action, pageId);
      if (log) {
        setActivityLog(prev => [{
          id: log.id,
          user: log.user_name,
          action: log.action,
          timestamp: new Date(log.created_at)
        }, ...prev]);
      }
    } catch (error) {
      console.error('Error adding activity log:', error);
    }
  };

  const saveVersion = async (pageId, components) => {
    if (!supabase) return;

    try {
      const version = await createVersion(supabase, pageId, components);
      if (version) {
        setVersionHistory(prev => ({
          ...prev,
          [pageId]: [{
            id: version.id,
            user: version.user_name,
            timestamp: new Date(version.created_at),
            components: version.components
          }, ...(prev[pageId] || [])].slice(0, 10)
        }));
      }
    } catch (error) {
      console.error('Error saving version:', error);
    }
  };

  const restoreVersion = async (pageId, versionId) => {
    if (!supabase) return;

    const version = versionHistory[pageId]?.find(v => v.id === versionId);
    if (version) {
      try {
        await updatePage(supabase, pageId, { components: version.components });
        setPages(prev => ({
          ...prev,
          [pageId]: {
            ...prev[pageId],
            components: JSON.parse(JSON.stringify(version.components))
          }
        }));
        await addActivityLog(`Restored "${pages[pageId].title}" to previous version`, pageId);
        setShowVersionHistory(false);
      } catch (error) {
        console.error('Error restoring version:', error);
        alert('Error restoring version: ' + error.message);
      }
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const results = [];
    const query = searchQuery.toLowerCase();
    Object.entries(pages).forEach(([pageId, page]) => {
      let matches = 0;
      page.components?.forEach(c => {
        const text = c.content || c.items?.join(' ') || '';
        if (text.toLowerCase().includes(query)) matches++;
      });
      if (matches > 0 || page.title.toLowerCase().includes(query)) {
        results.push({ pageId, title: page.title, matches });
      }
    });
    return results;
  }, [searchQuery, pages]);

  const getSubpages = (parentId) => navItems.filter(item => pages[item.id]?.parent === parentId);

  const toggleExpanded = (pageId) => {
    setExpandedPages(prev => ({ ...prev, [pageId]: !prev[pageId] }));
  };

  const startEditing = (pageId) => {
    if (!profile || profile.role === 'viewer') {
      alert('You need edit permissions');
      return;
    }
    setEditingPage(pageId);
    setEditComponents([...pages[pageId].components]);
    addActivityLog(`Started editing "${pages[pageId].title}"`, pageId);
  };

  const saveEdit = async () => {
    if (!supabase) return;

    try {
      await saveVersion(editingPage, pages[editingPage].components);
      await updatePage(supabase, editingPage, { components: editComponents });
      setPages(prev => ({
        ...prev,
        [editingPage]: { ...prev[editingPage], components: editComponents }
      }));
      await addActivityLog(`Saved "${pages[editingPage].title}"`, editingPage);
      setEditingPage(null);
    } catch (error) {
      console.error('Error saving page:', error);
      alert('Error saving page: ' + error.message);
    }
  };

  const cancelEdit = () => {
    setEditingPage(null);
    setEditComponents([]);
  };

  const addComponent = (type) => {
    const ct = componentTypes.find(c => c.type === type);
    setEditComponents([...editComponents, { id: Date.now(), type, ...ct.default }]);
  };

  const updateComponent = (id, updates) => {
    setEditComponents(editComponents.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteComponent = (id) => {
    setEditComponents(editComponents.filter(c => c.id !== id));
  };

  const handleDragStart = (e, index) => {
    setDraggedComponent(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedComponent === null || draggedComponent === index) return;
    const newComponents = [...editComponents];
    const item = newComponents[draggedComponent];
    newComponents.splice(draggedComponent, 1);
    newComponents.splice(index, 0, item);
    setEditComponents(newComponents);
    setDraggedComponent(index);
  };

  const createNewPage = async () => {
    if (!supabase) return;
    if (!newPageTitle.trim()) return;
    const pageId = newPageTitle.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (pages[pageId]) {
      alert('Page already exists!');
      return;
    }

    try {
      const newPage = {
        id: pageId,
        title: newPageTitle,
        parent: newPageParent,
        icon: newPageIcon,
        components: [{ id: 1, type: 'heading', content: newPageTitle, level: 1 }]
      };

      await createPage(supabase, newPage);

      const position = navItems.length + 1;
      await createNavigationItem(supabase, {
        id: pageId,
        label: newPageTitle,
        icon: newPageIcon,
        page_id: pageId,
        position
      });

      setPages(prev => ({ ...prev, [pageId]: newPage }));
      setNavItems(prev => [...prev, { id: pageId, label: newPageTitle, icon: newPageIcon }]);

      if (newPageParent) setExpandedPages(prev => ({ ...prev, [newPageParent]: true }));

      await addActivityLog(`Created "${newPageTitle}"`, pageId);

      setNewPageTitle('');
      setNewPageIcon('FileText');
      setNewPageParent(null);
      setShowNewPageModal(false);
      setActivePage(pageId);
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Error creating page: ' + error.message);
    }
  };

  const renderComponent = (c) => {
    switch (c.type) {
      case 'heading':
        const Tag = `h${c.level || 2}`;
        const classes = {
          1: 'text-3xl font-bold mb-4 mt-6 bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent',
          2: 'text-2xl font-semibold mb-3 mt-5 text-white',
          3: 'text-xl font-semibold mb-2 mt-4 text-blue-300'
        };
        return React.createElement(Tag, { className: classes[c.level || 2] }, c.content);
      case 'text':
        return <p className="mb-3 text-gray-300">{c.content}</p>;
      case 'list':
        return <ul className="mb-3 ml-6 list-disc">{c.items?.map((item, i) => <li key={i} className="mb-1 text-gray-300">{item}</li>)}</ul>;
      case 'alert':
        return (
          <div className="mb-3 p-4 bg-gradient-to-r from-pink-500/20 to-blue-300/20 border-l-4 border-pink-500 rounded">
            <div className="flex items-start">
              <AlertCircle className="text-pink-400 mr-2 mt-0.5" size={20} />
              <p className="text-white">{c.content}</p>
            </div>
          </div>
        );
      case 'code':
        return <pre className="mb-3 p-4 bg-black text-blue-300 rounded-lg overflow-x-auto border border-pink-500/30"><code>{c.content}</code></pre>;
      default:
        return null;
    }
  };

  const renderNavItem = (item, level = 0) => {
    const Icon = iconOptions[item.icon];
    const subpages = getSubpages(item.id);
    const hasSubpages = subpages.length > 0;
    const isExpanded = expandedPages[item.id];

    return (
      <div key={item.id}>
        <div className="flex items-center gap-1">
          {hasSubpages && (
            <button onClick={() => toggleExpanded(item.id)} className="p-1 hover:bg-gray-700/50 rounded text-gray-400">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <button
            onClick={() => setActivePage(item.id)}
            className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${hasSubpages ? '' : 'ml-6'} ${
              activePage === item.id ? 'bg-gradient-to-r from-pink-500/20 to-blue-300/20 text-white border border-pink-500/50' : 'text-gray-300 hover:bg-gray-700/50'
            }`}
            style={{ marginLeft: hasSubpages ? 0 : `${level * 24}px` }}
          >
            <Icon size={20} />
            <span className="font-medium">{item.label}</span>
          </button>
          {profile && profile.role !== 'viewer' && (
            <button onClick={() => { setNewPageParent(item.id); setShowNewPageModal(true); }} className="p-2 text-gray-400 hover:text-blue-300 hover:bg-gray-700/50 rounded">
              <Plus size={16} />
            </button>
          )}
        </div>
        {hasSubpages && isExpanded && <div className="ml-6">{subpages.map(s => renderNavItem(s, level + 1))}</div>}
      </div>
    );
  };

  const formatTime = (t) => {
    const diff = Date.now() - t;
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 60) return `${m}m ago`;
    if (h < 24) return `${h}h ago`;
    return `${d}d ago`;
  };

  // Load version history when modal opens
  useEffect(() => {
    if (showVersionHistory && activePage) {
      loadVersionHistoryForPage(activePage);
    }
  }, [showVersionHistory, activePage]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader className="animate-spin text-pink-400" size={48} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-blue-400 flex items-center justify-center">
              <Play size={32} className="text-white ml-1" fill="white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent mb-2">AIRPLAI</h1>
          <p className="text-center text-gray-400 mb-8">Sports Hub - Sign in to continue</p>
          <button onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white text-gray-900 rounded-lg hover:bg-gray-100 font-medium">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!pages[activePage]) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Loading...</h2>
          <Loader className="animate-spin text-pink-400 mx-auto" size={32} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-blue-400 flex items-center justify-center">
              <Play size={20} className="text-white ml-1" fill="white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">AIRPLAI</h1>
              <p className="text-xs text-gray-400">Sports Hub</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-800 rounded-lg">
            <img src={profile?.avatar_url || user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=default'} alt="" className="w-8 h-8 rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{profile?.name || user.user_metadata?.name || user.email}</p>
              <p className="text-xs text-gray-400 capitalize">{profile?.role || 'viewer'}</p>
            </div>
            <button onClick={handleSignOut} className="p-1 text-gray-400 hover:text-pink-400">
              <LogOut size={16} />
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={18} />
            <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          {searchResults && searchResults.length > 0 && (
            <div className="mt-2 bg-gray-800 border border-gray-700 rounded-lg max-h-64 overflow-y-auto">
              {searchResults.map(r => (
                <button key={r.pageId} onClick={() => { setActivePage(r.pageId); setSearchQuery(''); }} className="w-full text-left p-3 hover:bg-gray-700/50 border-b border-gray-700 last:border-b-0">
                  <div className="font-medium text-white">{r.title}</div>
                  <div className="text-xs text-gray-400">{r.matches} matches</div>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="p-4 flex-1 overflow-y-auto">
          {navItems.filter(i => !pages[i.id]?.parent).map(i => renderNavItem(i))}
          {profile && profile.role !== 'viewer' && (
            <button onClick={() => { setNewPageParent(null); setShowNewPageModal(true); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border-2 border-dashed border-gray-700 text-gray-400 hover:border-blue-400 hover:text-blue-300 mt-4">
              <Plus size={20} />
              <span className="font-medium">New Page</span>
            </button>
          )}
        </nav>

        <div className="p-4 border-t border-gray-800 space-y-2">
          <button onClick={() => setShowActivityLog(true)} className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg">
            <Activity size={18} />
            <span className="text-sm">Activity Log</span>
          </button>
          <button onClick={() => setShowVersionHistory(true)} className="w-full flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-700/50 rounded-lg">
            <History size={18} />
            <span className="text-sm">Version History</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">{pages[activePage].title}</h1>
            {editingPage !== activePage && (
              <button onClick={() => startEditing(activePage)} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-400 text-white rounded-lg hover:opacity-90 font-medium">
                <Edit2 size={18} />
                Edit Page
              </button>
            )}
          </div>

          {editingPage === activePage ? (
            <div className="flex gap-6">
              <div className="w-64 flex-shrink-0">
                <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 sticky top-0">
                  <h3 className="font-semibold text-white mb-3">Add Components</h3>
                  <div className="space-y-2">
                    {componentTypes.map(ct => {
                      const Icon = ct.icon;
                      return (
                        <button key={ct.type} onClick={() => addComponent(ct.type)} className="w-full flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700/50 rounded-lg border border-gray-700">
                          <Icon size={18} className="text-blue-400" />
                          <span className="text-sm font-medium text-gray-300">{ct.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-800 space-y-2">
                    <button onClick={saveEdit} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-400 text-white rounded-lg hover:opacity-90">
                      <Save size={18} />
                      Save
                    </button>
                    <button onClick={cancelEdit} className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700/50 border border-gray-700">
                      <X size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 bg-gray-900 rounded-lg border border-gray-800 p-8">
                <div className="mb-4 text-sm text-gray-400">Drag to reorder</div>
                {editComponents.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">Add components to start</div>
                ) : (
                  editComponents.map((c, i) => (
                    <div
                      key={c.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, i)}
                      onDragOver={(e) => handleDragOver(e, i)}
                      className={`mb-4 p-4 border-2 border-dashed rounded-lg ${draggedComponent === i ? 'opacity-50 border-pink-500' : 'border-gray-600'}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-400 uppercase">{c.type}</span>
                        <button onClick={() => deleteComponent(c.id)} className="text-pink-400">
                          <X size={18} />
                        </button>
                      </div>
                      {c.type === 'heading' && (
                        <div className="space-y-2">
                          <select value={c.level || 2} onChange={(e) => updateComponent(c.id, { level: parseInt(e.target.value) })} className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white">
                            <option value={1}>H1</option>
                            <option value={2}>H2</option>
                            <option value={3}>H3</option>
                          </select>
                          <input type="text" value={c.content} onChange={(e) => updateComponent(c.id, { content: e.target.value })} className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white" />
                        </div>
                      )}
                      {(c.type === 'text' || c.type === 'alert') && (
                        <textarea value={c.content} onChange={(e) => updateComponent(c.id, { content: e.target.value })} className="w-full p-2 bg-gray-900 border border-gray-600 rounded text-white" rows={3} />
                      )}
                      {c.type === 'code' && (
                        <textarea value={c.content} onChange={(e) => updateComponent(c.id, { content: e.target.value })} className="w-full p-2 bg-gray-900 border border-gray-600 rounded font-mono text-sm text-blue-300" rows={4} />
                      )}
                      {c.type === 'list' && (
                        <div className="space-y-2">
                          {c.items?.map((item, idx) => (
                            <div key={idx} className="flex gap-2">
                              <input type="text" value={item} onChange={(e) => {
                                const items = [...c.items];
                                items[idx] = e.target.value;
                                updateComponent(c.id, { items });
                              }} className="flex-1 p-2 bg-gray-900 border border-gray-600 rounded text-white" />
                              <button onClick={() => {
                                const items = c.items.filter((_, i) => i !== idx);
                                updateComponent(c.id, { items });
                              }} className="text-pink-400">
                                <X size={18} />
                              </button>
                            </div>
                          ))}
                          <button onClick={() => updateComponent(c.id, { items: [...(c.items || []), 'New item'] })} className="text-blue-400 text-sm">+ Add item</button>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-8">
              {pages[activePage].components?.map((c, i) => <div key={i}>{renderComponent(c)}</div>)}
            </div>
          )}
        </div>
      </div>

      {showNewPageModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent mb-4">{newPageParent ? 'Create Subpage' : 'Create Page'}</h2>
            {newPageParent && (
              <div className="mb-4 p-3 bg-gradient-to-r from-pink-500/10 to-blue-300/10 border border-pink-500/30 rounded-lg">
                <p className="text-sm text-gray-300">Under: <strong className="text-white">{pages[newPageParent]?.title}</strong></p>
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Page Title</label>
                <input type="text" value={newPageTitle} onChange={(e) => setNewPageTitle(e.target.value)} placeholder="e.g., Policies" className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500" autoFocus />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.entries(iconOptions).map(([name, Icon]) => (
                    <button key={name} onClick={() => setNewPageIcon(name)} className={`p-3 rounded-lg border-2 ${newPageIcon === name ? 'border-pink-500 bg-pink-500/20' : 'border-gray-700'}`}>
                      <Icon size={24} className={newPageIcon === name ? 'text-pink-400' : 'text-gray-400'} />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={createNewPage} disabled={!newPageTitle.trim()} className="flex-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-blue-400 text-white rounded-lg hover:opacity-90 disabled:opacity-50 font-medium">
                Create {newPageParent ? 'Subpage' : 'Page'}
              </button>
              <button onClick={() => { setShowNewPageModal(false); setNewPageTitle(''); setNewPageIcon('FileText'); setNewPageParent(null); }} className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 border border-gray-700">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showActivityLog && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">Activity Log</h2>
              <button onClick={() => setShowActivityLog(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {activityLog.map(log => (
                <div key={log.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-white font-medium">{log.action}</p>
                      <p className="text-sm text-gray-400 mt-1">by {log.user}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatTime(log.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showVersionHistory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-300 bg-clip-text text-transparent">Version History</h2>
              <button onClick={() => setShowVersionHistory(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2">
              {versionHistory[activePage]?.length > 0 ? (
                versionHistory[activePage].map(version => (
                  <div key={version.id} className="p-4 bg-gray-800 rounded-lg border border-gray-700">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium">Version from {formatTime(version.timestamp)}</p>
                        <p className="text-sm text-gray-400 mt-1">by {version.user}</p>
                      </div>
                      <button onClick={() => restoreVersion(activePage, version.id)} className="px-3 py-1 bg-gradient-to-r from-pink-500 to-blue-400 text-white rounded text-sm hover:opacity-90">
                        Restore
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-gray-500">No version history for this page yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
