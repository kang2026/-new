/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  ChevronRight,
  Plus,
  Trash2,
  Settings,
  X,
  Save,
  LogIn,
  LogOut,
  Globe,
  Image as ImageIcon,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect, useRef } from 'react';

// --- Helper Functions ---

const ensureHttp = (url: string) => {
  if (!url || url === '#' || url === 'https://') return '#';
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`;
  }
  return url;
};

// --- Types ---

interface SocialLink {
  id: string;
  name: string;
  url: string;
  platform: 'instagram' | 'youtube' | 'twitter' | 'linkedin' | 'other';
}

interface UpdateItem {
  id: string;
  category: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
  link?: string;
}

interface ProfileData {
  name: string;
  bio: string;
  avatar: string;
}

// --- Constants & Defaults ---

const DEFAULT_PROFILE: ProfileData = {
  name: '알렉스 킴',
  bio: '디지털 크리에이터 & 탐험가',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtpA3QU5a8TyNcTTDDHTBqj1K8swYgQxVWXbptBasYtcHceuyjm56WylSKDKxY0YQiP2Ht8LcgPpJj2nAyYO4amNGgSbVjOK0plpXOvwnyEXUZXQ7y0KVOHRrue3zDzdmNpRG7l2uVKfOTTprHPxFFslpjJCcnp6mZ4gZ28EwCHu21EIOg4xujpd-km-W7SEISyHyD2ws47et30erlDLWSKny81wqclB6c1Mrr5XJ__QRtAs1X_l9mVYVKKXTJVzz6nEIMpcy8F8xY'
};

const DEFAULT_SOCIALS: SocialLink[] = [
  { id: '1', name: '인스타그램', url: '#', platform: 'instagram' },
  { id: '2', name: '유튜브', url: '#', platform: 'youtube' },
  { id: '3', name: '트위터 / X', url: '#', platform: 'twitter' },
  { id: '4', name: '링크드인', url: '#', platform: 'linkedin' }
];

const DEFAULT_UPDATES: UpdateItem[] = [
  {
    id: '1',
    category: '여행',
    title: '도쿄 중심부에서 찾은 미니멀리즘 건축',
    description: '일본에서의 3주 동안 발견한 가장 멋진 숨은 보석들에 대한 시각적 여정...',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDbg5wtxpH3WXXtdFNYFkhhJub5AiMrv33z-reD6aUuL2N2fjgypmO6aNIm7CUhQudbJKAmAqn1rxhSsdNop_u9xWBo5MDXomN3qnvwOut0GlfIa47jcetSQ1sAR07VYnfiVLDjP5M-HKN6g4QVBdnW-_DfYT3OjyIgm2rJ4ZOPRZql7HodEgXO0TaaeoNRgEHZxuehaClUwRtmuudrdKTCqbFwfuFDNVIFJHB30QFftjabh6xrld_a0PfA2Slgj3JFzjK-X4VZMV3s',
    date: '2일 전',
    readTime: '4분 읽기'
  },
  {
    id: '2',
    category: '테크',
    title: '나의 데스크 셋업: 2024 생산성 에디션',
    description: '디지털 미니멀리즘의 원칙을 사용하여 집중력과 창의력을 위해 작업 공간을 최적화한 방법.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7ui6j0aomPmBP0FEAlGxjy6XZ9NtraeO4kMTQHyGwxL8lWNb7weZ6TzwYJ1B4mWw8tL_Rb0ObXGnelI-iVnGqMQmu8bNl9iv_vQqMeeX7PtNxBRUbw7hdZlyeL3CXZKO-HFyRd6A6RuDfDXJ_MknwGjDk5Q_JQhbt-QYffuG__sQH21m8znSCrgXo-tyQ28enpYGefvCMS5UCd3kcge0aVchZtsN-1MQXADVj5n_NGaWONqBTCuvQXueqJJBg3jJD4HaiAK9X0-qD',
    date: '1주일 전',
    readTime: '6분 읽기'
  }
];

// --- Components ---

const PlatformIcon = ({ platform }: { platform: SocialLink['platform'] }) => {
  switch (platform) {
    case 'instagram': return <Instagram size={20} />;
    case 'youtube': return <Youtube size={20} />;
    case 'twitter': return <Twitter size={20} />;
    case 'linkedin': return <Linkedin size={20} />;
    default: return <Globe size={20} />;
  }
};

export default function App() {
  // --- State ---
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const [profile, setProfile] = useState<ProfileData>(DEFAULT_PROFILE);
  const [socials, setSocials] = useState<SocialLink[]>(DEFAULT_SOCIALS);
  const [updates, setUpdates] = useState<UpdateItem[]>(DEFAULT_UPDATES);

  // --- Refs ---
  const profileInputRef = useRef<HTMLInputElement>(null);
  const updateInputRef = useRef<HTMLInputElement>(null);
  const [activeUpdateId, setActiveUpdateId] = useState<string | null>(null);

  // --- Persistence ---
  useEffect(() => {
    const savedProfile = localStorage.getItem('alex_profile');
    const savedSocials = localStorage.getItem('alex_socials');
    const savedUpdates = localStorage.getItem('alex_updates');

    if (savedProfile) setProfile(JSON.parse(savedProfile));
    if (savedSocials) setSocials(JSON.parse(savedSocials));
    if (savedUpdates) setUpdates(JSON.parse(savedUpdates));
  }, []);

  const handleSave = () => {
    localStorage.setItem('alex_profile', JSON.stringify(profile));
    localStorage.setItem('alex_socials', JSON.stringify(socials));
    localStorage.setItem('alex_updates', JSON.stringify(updates));
    alert('성공적으로 저장되었습니다!');
  };

  // --- Auth Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === '0930') {
      setIsAdmin(true);
      setShowLogin(false);
      setPassword('');
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  // --- Edit Handlers ---
  const addSocial = () => {
    const newSocial: SocialLink = {
      id: Date.now().toString(),
      name: '새 SNS',
      url: 'https://',
      platform: 'other'
    };
    setSocials([...socials, newSocial]);
  };

  const deleteSocial = (id: string) => {
    setSocials(socials.filter(s => s.id !== id));
  };

  const updateSocial = (id: string, field: keyof SocialLink, value: string) => {
    setSocials(socials.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addUpdate = () => {
    const newUpdate: UpdateItem = {
      id: Date.now().toString(),
      category: '카테고리',
      title: '새로운 소식 제목',
      description: '소식에 대한 설명을 입력하세요.',
      image: 'https://picsum.photos/seed/new/800/450',
      date: '방금 전',
      readTime: '1분 읽기'
    };
    setUpdates([newUpdate, ...updates]);
  };

  const deleteUpdate = (id: string) => {
    setUpdates(updates.filter(u => u.id !== id));
  };

  const updateUpdateItem = (id: string, field: keyof UpdateItem, value: string) => {
    setUpdates(updates.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  // --- File Upload Handlers ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'profile' | 'update') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (target === 'profile') {
        setProfile({ ...profile, avatar: base64String });
      } else if (target === 'update' && activeUpdateId) {
        updateUpdateItem(activeUpdateId, 'image', base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans selection:bg-blue-500/30">
      <main className="max-w-md mx-auto px-6 py-16 flex flex-col items-center">
        
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          ref={profileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'profile')}
        />
        <input 
          type="file" 
          ref={updateInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={(e) => handleImageUpload(e, 'update')}
        />

        {/* Admin Toggle Button (Hidden in Footer) */}
        {!isAdmin && (
          <button 
            onClick={() => setShowLogin(true)}
            className="fixed bottom-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-zinc-600 hover:text-zinc-400"
          >
            <Settings size={16} />
          </button>
        )}

        {/* Login Modal */}
        <AnimatePresence>
          {showLogin && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#1e1e1e] border border-zinc-800 p-8 rounded-2xl w-full max-w-sm shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">관리자 로그인</h2>
                  <button onClick={() => setShowLogin(false)} className="text-zinc-500 hover:text-white">
                    <X size={20} />
                  </button>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">비밀번호</label>
                    <input 
                      type="password" 
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="비밀번호를 입력하세요"
                      className={`w-full bg-zinc-900 border ${loginError ? 'border-red-500' : 'border-zinc-800'} rounded-xl p-3 text-white focus:outline-none focus:border-blue-500 transition-colors`}
                      autoFocus
                    />
                    {loginError && <p className="text-red-500 text-xs mt-2">비밀번호가 틀렸습니다.</p>}
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center space-x-2"
                  >
                    <LogIn size={18} />
                    <span>로그인</span>
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Admin Panel Header */}
        {isAdmin && (
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full bg-blue-600/10 border border-blue-500/20 rounded-2xl p-4 mb-12 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Settings size={18} className="text-white" />
              </div>
              <span className="font-bold text-blue-400">관리자 모드</span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-colors"
              >
                <Save size={16} />
                <span>저장하기</span>
              </button>
              <button 
                onClick={() => setIsAdmin(false)}
                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded-lg text-sm font-bold flex items-center space-x-2 transition-colors"
              >
                <LogOut size={16} />
                <span>종료</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* Profile Header */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 w-full"
        >
          <div className="relative w-32 h-32 mx-auto mb-6 group">
            <div className="absolute inset-0 bg-blue-600 rounded-full blur-2xl opacity-20"></div>
            <img 
              src={profile.avatar} 
              alt={profile.name} 
              className="relative w-32 h-32 rounded-full border-2 border-white/10 object-cover shadow-2xl"
              referrerPolicy="no-referrer"
            />
            {isAdmin && (
              <div 
                onClick={() => profileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <ImageIcon size={24} className="text-white" />
              </div>
            )}
          </div>
          
          {isAdmin ? (
            <div className="space-y-3 max-w-xs mx-auto">
              <input 
                type="text" 
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center text-xl font-bold focus:border-blue-500 outline-none"
                placeholder="이름"
              />
              <input 
                type="text" 
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center text-sm text-zinc-400 focus:border-blue-500 outline-none"
                placeholder="소개"
              />
              <input 
                type="text" 
                value={profile.avatar}
                onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-center text-xs text-zinc-500 focus:border-blue-500 outline-none"
                placeholder="프로필 이미지 URL"
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{profile.name}</h1>
              <p className="text-zinc-400 font-medium tracking-widest uppercase text-xs">
                {profile.bio}
              </p>
            </>
          )}
        </motion.section>

        {/* Social Links */}
        <section className="w-full space-y-3 mb-16">
          {socials.map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative group"
            >
              {isAdmin ? (
                <div className="bg-[#1e1e1e] border border-zinc-800 p-4 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 w-full">
                      <select 
                        value={link.platform}
                        onChange={(e) => updateSocial(link.id, 'platform', e.target.value as any)}
                        className="bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs text-zinc-400 outline-none"
                      >
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="twitter">Twitter / X</option>
                        <option value="linkedin">LinkedIn</option>
                        <option value="other">기타</option>
                      </select>
                      <input 
                        type="text" 
                        value={link.name}
                        onChange={(e) => updateSocial(link.id, 'name', e.target.value)}
                        className="flex-grow bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none p-1 text-sm font-medium"
                        placeholder="이름"
                      />
                    </div>
                    <button 
                      onClick={() => deleteSocial(link.id)}
                      className="text-zinc-600 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex items-center space-x-2 text-zinc-500">
                    <LinkIcon size={14} />
                    <input 
                      type="text" 
                      value={link.url}
                      onChange={(e) => updateSocial(link.id, 'url', e.target.value)}
                      className="w-full bg-transparent border-b border-zinc-800 focus:border-blue-500 outline-none p-1 text-xs"
                      placeholder="URL (https://...)"
                    />
                  </div>
                </div>
              ) : (
                <a href={ensureHttp(link.url)} className="block" target="_blank" rel="noopener noreferrer">
                  <div className="bg-[#1e1e1e] hover:bg-zinc-800 border border-zinc-800/50 p-4 rounded-xl transition-all duration-300 flex items-center justify-between group-hover:border-zinc-700">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-zinc-900 rounded-lg transition-colors duration-300 group-hover:text-blue-500">
                        <PlatformIcon platform={link.platform} />
                      </div>
                      <span className="font-medium text-zinc-200 group-hover:text-white transition-colors">
                        {link.name}
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </a>
              )}
            </motion.div>
          ))}
          
          {isAdmin && (
            <button 
              onClick={addSocial}
              className="w-full border-2 border-dashed border-zinc-800 hover:border-blue-500/50 hover:bg-blue-500/5 p-4 rounded-xl text-zinc-500 hover:text-blue-400 transition-all flex items-center justify-center space-x-2"
            >
              <Plus size={18} />
              <span className="font-bold text-sm">SNS 항목 추가</span>
            </button>
          )}
        </section>

        {/* Latest Updates Section */}
        <section className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">최신 소식</h2>
            <div className="h-px flex-grow ml-4 bg-zinc-800/50"></div>
            {isAdmin && (
              <button 
                onClick={addUpdate}
                className="ml-4 p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
              >
                <Plus size={16} />
              </button>
            )}
          </div>
          
          <div className="space-y-10">
            {updates.map((update, index) => (
              <motion.article 
                key={update.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {isAdmin && (
                  <button 
                    onClick={() => deleteUpdate(update.id)}
                    className="absolute -top-2 -right-2 z-10 p-2 bg-red-600 rounded-full shadow-lg hover:bg-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                )}

                <div className="overflow-hidden rounded-2xl mb-4 aspect-video relative bg-zinc-900">
                  <img 
                    src={update.image} 
                    alt={update.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {isAdmin && (
                    <div 
                      onClick={() => {
                        setActiveUpdateId(update.id);
                        updateInputRef.current?.click();
                      }}
                      className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <ImageIcon size={32} className="text-white" />
                    </div>
                  )}
                </div>
                
                <div className="px-1 space-y-3">
                  {isAdmin ? (
                    <div className="space-y-3 bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                      <div className="grid grid-cols-2 gap-2">
                        <input 
                          type="text" 
                          value={update.category}
                          onChange={(e) => updateUpdateItem(update.id, 'category', e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-[10px] font-bold uppercase tracking-widest text-blue-500 outline-none"
                          placeholder="카테고리"
                        />
                        <input 
                          type="text" 
                          value={update.readTime}
                          onChange={(e) => updateUpdateItem(update.id, 'readTime', e.target.value)}
                          className="bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-[10px] text-zinc-500 outline-none"
                          placeholder="읽기 시간"
                        />
                      </div>
                      <input 
                        type="text" 
                        value={update.title}
                        onChange={(e) => updateUpdateItem(update.id, 'title', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-lg font-bold outline-none focus:border-blue-500"
                        placeholder="제목"
                      />
                      <textarea 
                        value={update.description}
                        onChange={(e) => updateUpdateItem(update.id, 'description', e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-sm text-zinc-400 outline-none focus:border-blue-500 h-20 resize-none"
                        placeholder="설명"
                      />
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">이미지 URL (또는 사진 클릭하여 업로드)</label>
                        <input 
                          type="text" 
                          value={update.image}
                          onChange={(e) => updateUpdateItem(update.id, 'image', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-500 outline-none"
                          placeholder="이미지 URL"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] text-zinc-500 uppercase font-bold">연결 링크 (선택사항)</label>
                        <input 
                          type="text" 
                          value={update.link || ''}
                          onChange={(e) => updateUpdateItem(update.id, 'link', e.target.value)}
                          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-500 outline-none"
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  ) : (
                    <a href={ensureHttp(update.link || '#')} className="block" target="_blank" rel="noopener noreferrer">
                      <p className="text-[10px] text-blue-500 font-bold uppercase tracking-[0.2em] mb-2">
                        {update.category}
                      </p>
                      <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors mb-3 leading-tight">
                        {update.title}
                      </h3>
                      <p className="text-zinc-400 text-sm line-clamp-2 leading-relaxed mb-4">
                        {update.description}
                      </p>
                      <div className="flex items-center text-[11px] text-zinc-500 font-medium">
                        <span>{update.date}</span>
                        <span className="mx-2 text-zinc-800">•</span>
                        <span>{update.readTime}</span>
                      </div>
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 text-center w-full">
          <p className="text-zinc-600 text-xs tracking-wide">
            © 2024 {profile.name}. All rights reserved.
          </p>
          <div className="mt-6 flex justify-center space-x-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600/40"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600/40"></div>
          </div>
        </footer>
      </main>
    </div>
  );
}
