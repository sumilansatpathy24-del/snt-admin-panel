import { defaultWebsiteData } from '../data/defaultData';

const CMS_KEY = 'snt_cms_data';
const AUTH_KEY = 'snt_admin_auth';
const MEDIA_KEY = 'snt_media_uploads';
const CONTACT_KEY = 'snt_contact_submissions';
const CAREER_KEY = 'snt_career_applications';

// ─── Default Mock Data Setup ───────────────────────────────────────────────────

const defaultMediaUploads = [
  {
    id: 1001,
    title: 'Cinematic Highway Tripper',
    category: 'Homepage Banner',
    description: 'Heavy industrial dumper driving on highway at night, showcasing custom orange and blue light streaks.',
    imageUrl: '/images/hero_truck_bg.png',
    createdAt: '2026-05-28T10:15:00.000Z'
  },
  {
    id: 1002,
    title: 'Kharagpur Yard Operations',
    category: 'Office',
    description: 'Cargo fleet loading iron ore and slag at our main Kharagpur industrial yard hub.',
    imageUrl: '/images/about_truck.png',
    createdAt: '2026-05-27T14:30:00.000Z'
  },
  {
    id: 1003,
    title: 'Tata Signa 4825.T Heavy Dumper',
    category: 'Fleet',
    description: 'Articulated flatbed dumper configured to haul heavy multi-axle plant slag.',
    imageUrl: '/images/heavy_cargo.png',
    createdAt: '2026-05-26T11:00:00.000Z'
  },
  {
    id: 1004,
    title: 'BharatBenz Closed Container',
    category: 'Fleet',
    description: 'Weatherproof container fleet for secure industrial logistics and retail cargo.',
    imageUrl: '/images/container_fleet.png',
    createdAt: '2026-05-25T14:20:00.000Z'
  },
  {
    id: 1005,
    title: 'Express Delivery Vehicle',
    category: 'Fleet',
    description: 'Light commercial vehicle optimized for priority metropolitan freight distributions.',
    imageUrl: '/images/express_delivery.png',
    createdAt: '2026-05-24T09:00:00.000Z'
  },
  {
    id: 1006,
    title: 'Slag Transport Dispatch Yard',
    category: 'Fleet',
    description: 'Dumpers loading metal dust inside specialized plant logistics operations.',
    imageUrl: '/images/industrial_transport.png',
    createdAt: '2026-05-23T16:45:00.000Z'
  }
];

const defaultContactSubmissions = [
  {
    id: 2001,
    name: 'Sunil Sen (Rashmi Group)',
    email: 'sunil.sen@rashmigroup.com',
    phone: '9834567890',
    message: 'Need to coordinate next week\'s slag transport from Kharagpur Metaliks Plant 2. Please share Amit-ji\'s direct schedule.',
    status: 'unread',
    createdAt: '2026-05-28T10:15:00.000Z'
  },
  {
    id: 2002,
    name: 'Deepak Mehta (L&T Construction)',
    email: 'deepak.mehta@lntecc.com',
    phone: '9433112345',
    message: 'Inquiring about bulk supply rates and delivery timelines for 5,000 tonnes of Slag Dust and ESP dust for the highway land filling project.',
    status: 'read',
    createdAt: '2026-05-27T14:30:00.000Z'
  },
  {
    id: 2003,
    name: 'Rajesh Sharma (Tata Steel)',
    email: 'rajesh.sharma@tata.com',
    phone: '8584098765',
    message: 'Urgent requirement: Need 15 heavy-duty dumpers (16-wheel or 18-wheel) for intra-plant material logistics at Haldia Yard next month. Please share quotation.',
    status: 'unread',
    createdAt: '2026-05-29T09:00:00.000Z'
  }
];

const defaultCareerApplications = [
  {
    id: 3001,
    name: 'Ramesh Yadav',
    email: 'ramesh.yadav92@gmail.com',
    phone: '7001234567',
    position: 'Heavy Dumper Driver',
    experience: '8 Years',
    coverLetter: 'I have 8 years of experience driving 16-wheel dumpers and heavy trippers across West Bengal and Odisha. Clean driving record, valid heavy commercial vehicle license.',
    resumeUrl: 'data:text/plain;charset=utf-8,Resume - Ramesh Yadav\nPosition: Heavy Dumper Driver\nExperience: 8 Years driving commercial HCVs (Tata/Leyland).\nLicense: Valid Heavy License, clean records.',
    status: 'shortlisted',
    createdAt: '2026-05-26T11:00:00.000Z'
  },
  {
    id: 3002,
    name: 'Ananya Ghosh',
    email: 'ananya.ghosh@outlook.com',
    phone: '9836045678',
    position: 'Logistics Operations Manager',
    experience: '4 Years',
    coverLetter: 'MBA in Supply Chain Management. 4 years of experience coordinating fleet logistics, vehicle tracking operations, and plant delivery dispatch logs.',
    resumeUrl: 'data:text/plain;charset=utf-8,Resume - Ananya Ghosh\nPosition: Logistics Manager\nEducation: MBA Supply Chain\nExperience: 4 Years at Haldia Freight Corp.',
    status: 'pending',
    createdAt: '2026-05-28T16:45:00.000Z'
  },
  {
    id: 3003,
    name: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    phone: '8240098123',
    position: 'Fleet Dispatcher',
    experience: '2 Years',
    coverLetter: 'Expedient dispatcher experienced in managing real-time GPS telemetry and driver duty schedules for dumpers. Highly organized.',
    resumeUrl: 'data:text/plain;charset=utf-8,Resume - Vikram Singh\nPosition: Fleet Dispatcher\nExperience: 2 Years handling 50+ dumpers telemetry.',
    status: 'rejected',
    createdAt: '2026-05-25T14:20:00.000Z'
  }
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStorageItem(key, defaults) {
  try {
    const item = localStorage.getItem(key);
    if (item) return JSON.parse(item);
    // Initialize defaults if not present
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  } catch (e) {
    console.error(`[CMS] Failed to read ${key}:`, e);
    return defaults;
  }
}

function setStorageItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error(`[CMS] Failed to write ${key}:`, e);
    return false;
  }
}

export function generateId() {
  return Date.now() + Math.floor(Math.random() * 1000);
}

// ── CMS Website Content ────────────────────────────────────────────────────────

export function getWebsiteData() {
  try {
    const stored = localStorage.getItem(CMS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return deepMerge(defaultWebsiteData, parsed);
    }
  } catch (e) {
    console.error('[CMS] Failed to parse stored data:', e);
  }
  return { ...defaultWebsiteData };
}

export function updateWebsiteData(newData) {
  try {
    localStorage.setItem(CMS_KEY, JSON.stringify(newData));
    return true;
  } catch (e) {
    console.error('[CMS] Failed to save data:', e);
    return false;
  }
}

export function updateSection(sectionKey, sectionData) {
  const current = getWebsiteData();
  const updated = { ...current, [sectionKey]: sectionData };
  return updateWebsiteData(updated);
}

export function resetToDefaults() {
  localStorage.removeItem(CMS_KEY);
}

// ─── Image Upload (Base64) ────────────────────────────────────────────────────

export function uploadImage(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return reject(new Error('Image must be under 5MB'));
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowed.includes(file.type)) {
      return reject(new Error('Only JPG, PNG, WEBP, GIF allowed'));
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result); // returns base64 data URL
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

// ─── Resume / File Upload Validation ──────────────────────────────────────────

export function uploadResume(file) {
  return new Promise((resolve, reject) => {
    if (!file) return reject(new Error('No file provided'));

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return reject(new Error('Resume must be under 10MB'));
    }

    const allowed = [
      'application/pdf', 
      'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];
    if (!allowed.includes(file.type)) {
      return reject(new Error('Only PDF, DOC, DOCX, and TXT files allowed'));
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result); // returns base64 data URL
    reader.onerror = () => reject(new Error('Failed to read resume file'));
    reader.readAsDataURL(file);
  });
}

// ─── Media Manager CMS ────────────────────────────────────────────────────────

export function getMediaUploads() {
  return getStorageItem(MEDIA_KEY, defaultMediaUploads);
}

export function saveMediaUpload({ title, category, description, imageUrl }) {
  const list = getMediaUploads();
  const newMedia = {
    id: generateId(),
    title: title || 'Untitled Media',
    category: category || 'Other',
    description: description || '',
    imageUrl,
    createdAt: new Date().toISOString()
  };
  list.unshift(newMedia);
  setStorageItem(MEDIA_KEY, list);
  return newMedia;
}

export function updateMediaUpload(id, updatedFields) {
  const list = getMediaUploads();
  const index = list.findIndex(m => m.id === Number(id));
  if (index !== -1) {
    list[index] = { ...list[index], ...updatedFields };
    setStorageItem(MEDIA_KEY, list);
    return true;
  }
  return false;
}

export function deleteMediaUpload(id) {
  const list = getMediaUploads();
  const filtered = list.filter(m => m.id !== Number(id));
  return setStorageItem(MEDIA_KEY, filtered);
}

// ─── Contact Form Submissions ─────────────────────────────────────────────────

export function getContactSubmissions() {
  return getStorageItem(CONTACT_KEY, defaultContactSubmissions);
}

export function saveContactSubmission({ name, email, phone, message }) {
  const list = getContactSubmissions();
  const newSubmission = {
    id: generateId(),
    name,
    email,
    phone,
    message,
    status: 'unread',
    createdAt: new Date().toISOString()
  };
  list.unshift(newSubmission);
  setStorageItem(CONTACT_KEY, list);
  return newSubmission;
}

export function deleteContactSubmission(id) {
  const list = getContactSubmissions();
  const filtered = list.filter(s => s.id !== Number(id));
  return setStorageItem(CONTACT_KEY, filtered);
}

export function updateContactSubmissionStatus(id, status) {
  const list = getContactSubmissions();
  const index = list.findIndex(s => s.id === Number(id));
  if (index !== -1) {
    list[index].status = status;
    setStorageItem(CONTACT_KEY, list);
    return true;
  }
  return false;
}

// ─── Career Applications ──────────────────────────────────────────────────────

export function getCareerApplications() {
  return getStorageItem(CAREER_KEY, defaultCareerApplications);
}

export function saveCareerApplication({ name, email, phone, position, experience, coverLetter, resumeUrl }) {
  const list = getCareerApplications();
  const newApp = {
    id: generateId(),
    name,
    email,
    phone,
    position,
    experience,
    coverLetter,
    resumeUrl,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  list.unshift(newApp);
  setStorageItem(CAREER_KEY, list);
  return newApp;
}

export function deleteCareerApplication(id) {
  const list = getCareerApplications();
  const filtered = list.filter(a => a.id !== Number(id));
  return setStorageItem(CAREER_KEY, filtered);
}

export function updateCareerApplicationStatus(id, status) {
  const list = getCareerApplications();
  const index = list.findIndex(a => a.id === Number(id));
  if (index !== -1) {
    list[index].status = status;
    setStorageItem(CAREER_KEY, list);
    return true;
  }
  return false;
}

// ── Auth Functions ────────────────────────────────────────────────────────────

const ADMIN_CREDENTIALS = { username: 'admin', password: 'admin123' };

export function login(username, password) {
  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    const session = { username, loggedInAt: Date.now() };
    localStorage.setItem(AUTH_KEY, JSON.stringify(session));
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated() {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    // Session valid for 24 hours
    const hoursDiff = (Date.now() - parsed.loggedInAt) / (1000 * 60 * 60);
    return hoursDiff < 24;
  } catch {
    return false;
  }
}

export function getAdminUser() {
  try {
    const session = localStorage.getItem(AUTH_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

function deepMerge(target, source) {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
}
