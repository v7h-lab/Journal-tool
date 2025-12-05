import { useState, useEffect } from 'react';
import { JournalCover } from './components/journal-cover';
import { PageEditor } from './components/page-editor';
import { TurnJsPreview } from './components/turnjs-preview';
import { Book, Edit3, Eye } from 'lucide-react';

export interface JournalPage {
  id: string;
  content: string;
  images: Array<{ id: string; url: string; x: number; y: number; width: number; height: number }>;
  videos: Array<{ id: string; url: string; x: number; y: number; width: number; height: number }>;
}

export interface CoverCustomization {
  color: string;
  stickers: Array<{ id: string; emoji: string; x: number; y: number; size: number; rotation: number }>;
  texture: string;
  title: {
    text: string;
    color: string;
    size: number;
    font: string;
    y: number;
  };
  previewBackground: string;
  coverType: 'soft' | 'hard';
}

export interface PageCustomization {
  color: string;
  material: string;
}

export default function App() {
  const [mode, setMode] = useState<'customize' | 'edit' | 'preview'>('edit');
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  
  // Fresh default state
  const [coverCustomization, setCoverCustomization] = useState<CoverCustomization>({
    color: '#8B4513',
    stickers: [],
    texture: 'leather',
    title: {
      text: 'My Journal',
      color: '#FFD700',
      size: 48,
      font: 'serif',
      y: 30
    },
    previewBackground: 'minimal',
    coverType: 'soft'
  });

  const [pageCustomization, setPageCustomization] = useState<PageCustomization>({
    color: '#FFF8DC',
    material: 'lined'
  });

  const [pages, setPages] = useState<JournalPage[]>([
    { id: '1', content: '', images: [], videos: [] },
    { id: '2', content: '', images: [], videos: [] }
  ]);

  // Note: localStorage saving removed for fresh state on each reload

  const updatePage = (pageId: string, updates: Partial<JournalPage>) => {
    setPages(pages.map(page => 
      page.id === pageId ? { ...page, ...updates } : page
    ));
  };

  const addPage = () => {
    const newPage: JournalPage = {
      id: Date.now().toString(),
      content: '',
      images: [],
      videos: []
    };
    setPages([...pages, newPage]);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 overflow-y-scroll">
      {/* Header Navigation */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-amber-700" />
            <h1>My Digital Journal</h1>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => setMode('edit')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                mode === 'edit'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setMode('customize')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                mode === 'customize'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Book className="w-4 h-4" />
              Customize
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                mode === 'preview'
                  ? 'bg-amber-600 text-white shadow-lg'
                  : 'bg-white text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Eye className="w-4 h-4" />
              Preview
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={mode === 'preview' ? 'flex-1 w-full' : 'max-w-7xl mx-auto px-6 py-8 w-full'}>
        {mode === 'customize' && (
          <JournalCover
            coverCustomization={coverCustomization}
            setCoverCustomization={setCoverCustomization}
            pageCustomization={pageCustomization}
            setPageCustomization={setPageCustomization}
          />
        )}

        {mode === 'edit' && (
          <PageEditor
            pages={pages}
            currentPageIndex={currentPageIndex}
            setCurrentPageIndex={setCurrentPageIndex}
            updatePage={updatePage}
            addPage={addPage}
            pageCustomization={pageCustomization}
          />
        )}

        {mode === 'preview' && (
          <TurnJsPreview
            pages={pages}
            coverCustomization={coverCustomization}
            pageCustomization={pageCustomization}
          />
        )}
      </main>
    </div>
  );
}
