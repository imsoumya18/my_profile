// Describes every top-level section of profile.json so the admin panel can
// render a generic editor for each, instead of hand-building 14 bespoke
// forms. Each top-level entry is either:
//   { kind: 'object', fields: [...] }        — a single record (e.g. personal)
//   { kind: 'array', itemSchema: [...] }      — a list of records (e.g. nav)
//
// Field types: text, textarea, number, boolean, select, icon, image,
// array-strings, object (nested fields), array (nested itemSchema).

const trekItemSchema = [
  { key: 'name', label: 'Name', type: 'text' },
  { key: 'status', label: 'Status', type: 'select', options: ['done', 'future', 'planned'] },
  { key: 'difficultyScore', label: 'Difficulty score (1-10)', type: 'number' },
  { key: 'altitude', label: 'Altitude (m)', type: 'number' },
  { key: 'altitudeFt', label: 'Altitude (ft)', type: 'number' },
  { key: 'location', label: 'Location', type: 'text' },
  { key: 'description', label: 'Description', type: 'textarea' },
  { key: 'completedDate', label: 'Completed date', type: 'text' },
  { key: 'plannedDate', label: 'Planned date', type: 'text' },
  { key: 'photo', label: 'Photo', type: 'image' },
  { key: 'photoFit', label: 'Photo fit', type: 'select', options: ['cover', 'contain'] },
  { key: 'photoBrightness', label: 'Photo brightness', type: 'number' },
]

const watchingTitleSchema = [
  { key: 'title', label: 'Title', type: 'text' },
  { key: 'type', label: 'Type', type: 'select', options: ['Movie', 'Series', 'Documentary', 'Podcast'] },
  { key: 'language', label: 'Language', type: 'text' },
  { key: 'watched', label: 'Watched (e.g. Jun 2026)', type: 'text' },
  { key: 'url', label: 'URL', type: 'text' },
  { key: 'poster', label: 'Poster', type: 'image' },
  { key: 'rating', label: 'Rating (1-5)', type: 'number' },
  { key: 'note', label: 'Note', type: 'textarea' },
]

export const SECTIONS = [
  {
    key: 'personal',
    label: 'Personal',
    kind: 'object',
    fields: [
      { key: 'name', label: 'Full name', type: 'text' },
      { key: 'nickname', label: 'Nickname', type: 'text' },
      { key: 'email', label: 'Email', type: 'text' },
      { key: 'phone', label: 'Phone', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'currentRole', label: 'Current role', type: 'text' },
      { key: 'currentCompany', label: 'Current company', type: 'text' },
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      {
        key: 'links', label: 'Links', type: 'object', fields: [
          { key: 'github', label: 'GitHub', type: 'text' },
          { key: 'linkedin', label: 'LinkedIn', type: 'text' },
          { key: 'resume', label: 'Résumé', type: 'text' },
        ],
      },
    ],
  },
  {
    key: 'about',
    label: 'About',
    kind: 'object',
    fields: [
      { key: 'statement', label: 'Statement', type: 'textarea' },
      {
        key: 'facts', label: 'Facts', type: 'array',
        itemLabel: (item) => item.label || 'Fact',
        itemSchema: [
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'value', label: 'Value', type: 'text' },
          { key: 'sub', label: 'Subtext', type: 'text' },
        ],
      },
    ],
  },
  {
    key: 'experience',
    label: 'Experience',
    kind: 'array',
    itemLabel: (item) => item.company || 'Role',
    itemSchema: [
      { key: 'index', label: 'Index (e.g. 01)', type: 'text' },
      { key: 'company', label: 'Company', type: 'text' },
      { key: 'role', label: 'Role', type: 'text' },
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'location', label: 'Location', type: 'text' },
      { key: 'summary', label: 'Summary', type: 'textarea' },
      { key: 'bullets', label: 'Bullets', type: 'array-strings' },
      { key: 'tags', label: 'Tags', type: 'array-strings' },
    ],
  },
  {
    key: 'education',
    label: 'Education',
    kind: 'array',
    itemLabel: (item) => item.shortName || 'Education',
    itemSchema: [
      { key: 'institution', label: 'Institution (full name)', type: 'text' },
      { key: 'shortName', label: 'Short name', type: 'text' },
      { key: 'degree', label: 'Degree', type: 'text' },
      { key: 'period', label: 'Period', type: 'text' },
      { key: 'cgpa', label: 'CGPA', type: 'text' },
    ],
  },
  {
    key: 'skills',
    label: 'Skills',
    kind: 'object',
    fields: [
      {
        key: 'categories', label: 'Categories', type: 'array',
        itemLabel: (item) => item.label || 'Category',
        itemSchema: [
          { key: 'id', label: 'ID (e.g. 01)', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'skills', label: 'Skills', type: 'array-strings' },
        ],
      },
      {
        key: 'marquee', label: 'Marquee', type: 'object', fields: [
          { key: 'row1', label: 'Row 1', type: 'array-strings' },
          { key: 'row2', label: 'Row 2', type: 'array-strings' },
        ],
      },
      { key: 'exploring', label: 'Currently exploring', type: 'array-strings' },
    ],
  },
  {
    key: 'projects',
    label: 'Projects',
    kind: 'array',
    itemLabel: (item) => item.title || 'Project',
    itemSchema: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'date', label: 'Date', type: 'text' },
      { key: 'icon', label: 'Icon', type: 'icon' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'details', label: 'Details', type: 'array-strings' },
      { key: 'tags', label: 'Tags', type: 'array-strings' },
      {
        key: 'metric', label: 'Metric', type: 'object', fields: [
          { key: 'value', label: 'Value (e.g. 7.07%)', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
        ],
      },
      { key: 'githubUrl', label: 'GitHub URL', type: 'text' },
      { key: 'liveUrl', label: 'Live URL', type: 'text' },
    ],
  },
  {
    key: 'achievements',
    label: 'Achievements',
    kind: 'object',
    fields: [
      {
        key: 'stats', label: 'Stats', type: 'array',
        itemLabel: (item) => item.label || 'Stat',
        itemSchema: [
          { key: 'value', label: 'Value', type: 'number' },
          { key: 'suffix', label: 'Suffix (e.g. +)', type: 'text' },
          { key: 'label', label: 'Label', type: 'text' },
          { key: 'icon', label: 'Icon', type: 'icon' },
        ],
      },
      {
        key: 'awards', label: 'Awards', type: 'array',
        itemLabel: (item) => item.title || 'Award',
        itemSchema: [
          { key: 'year', label: 'Year', type: 'text' },
          { key: 'icon', label: 'Icon', type: 'icon' },
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'description', label: 'Description', type: 'textarea' },
        ],
      },
    ],
  },
  {
    key: 'treks',
    label: 'Treks',
    kind: 'object',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'subtitle', label: 'Subtitle', type: 'text' },
      {
        key: 'list', label: 'Treks', type: 'array',
        itemLabel: (item) => item.name || 'Trek',
        itemSchema: trekItemSchema,
      },
    ],
  },
  {
    key: 'clicks',
    label: 'Clicking',
    kind: 'object',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'instagram', label: 'Instagram URL', type: 'text' },
      { key: 'instagramHandle', label: 'Instagram handle', type: 'text' },
      {
        key: 'posts', label: 'Posts', type: 'array',
        itemLabel: (item) => item.url || 'Post',
        itemSchema: [{ key: 'url', label: 'Post URL', type: 'text' }],
      },
    ],
  },
  {
    key: 'reading',
    label: 'Reading',
    kind: 'object',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      {
        key: 'currentlyReading', label: 'Currently reading', type: 'object', fields: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'author', label: 'Author', type: 'text' },
          { key: 'type', label: 'Type', type: 'text' },
          { key: 'progress', label: 'Progress (e.g. 62%)', type: 'text' },
          { key: 'cover', label: 'Cover image', type: 'image' },
        ],
      },
      {
        key: 'books', label: 'Books', type: 'array',
        itemLabel: (item) => item.title || 'Book',
        itemSchema: [
          { key: 'title', label: 'Title', type: 'text' },
          { key: 'author', label: 'Author', type: 'text' },
          { key: 'type', label: 'Type', type: 'select', options: ['Novel', 'Nonfiction'] },
          { key: 'finished', label: 'Finished (e.g. Mar 2026)', type: 'text' },
          { key: 'cover', label: 'Cover image', type: 'image' },
        ],
      },
    ],
  },
  {
    key: 'watching',
    label: 'Watching',
    kind: 'object',
    fields: [
      { key: 'tagline', label: 'Tagline', type: 'textarea' },
      { key: 'nowWatching', label: 'Now watching', type: 'object', fields: watchingTitleSchema },
      {
        key: 'titles', label: 'Titles', type: 'array',
        itemLabel: (item) => item.title || 'Title',
        itemSchema: watchingTitleSchema,
      },
    ],
  },
  {
    key: 'contact',
    label: 'Contact',
    kind: 'array',
    itemLabel: (item) => item.label || 'Contact',
    itemSchema: [
      { key: 'label', label: 'Label', type: 'text' },
      { key: 'handle', label: 'Handle', type: 'text' },
      { key: 'href', label: 'Href', type: 'text' },
      { key: 'icon', label: 'Icon', type: 'icon' },
      { key: 'external', label: 'Opens externally', type: 'boolean' },
    ],
  },
]

export function sectionByKey(key) {
  return SECTIONS.find((s) => s.key === key)
}

// Builds a blank record matching a field list — used to seed a new array
// item so every key exists (undefined inputs render oddly as uncontrolled
// React inputs).
export function emptyValueForFields(fields) {
  const obj = {}
  for (const f of fields) {
    if (f.type === 'array-strings' || f.type === 'array') obj[f.key] = []
    else if (f.type === 'object') obj[f.key] = emptyValueForFields(f.fields)
    else if (f.type === 'number') obj[f.key] = 0
    else if (f.type === 'boolean') obj[f.key] = false
    else obj[f.key] = ''
  }
  return obj
}
