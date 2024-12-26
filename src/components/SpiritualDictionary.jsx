import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Input = ({ className, ...props }) => (
  <input 
    className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm ${className}`}
    {...props} 
  />
);

const SpiritualDictionary = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const highlightColors = [
    'bg-yellow-200 hover:bg-yellow-300',
    'bg-green-200 hover:bg-green-300',
    'bg-blue-200 hover:bg-blue-300',
    'bg-pink-200 hover:bg-pink-300',
    'bg-purple-200 hover:bg-purple-300'
  ];

  // Sample data for preview
  const baseEntries = [
    {
      id: 'karma',
      term: 'Karma',
      content: [
        {
          text: 'The universal law of cause and effect operating on mental, emotional, and physical planes.',
          sourceTerm: 'Karma'
        },
        {
          text: 'Creates patterns in consciousness that influence future experiences and outcomes.',
          sourceTerm: 'Karma'
        }
      ],
      compiledDate: '2024-01-15',
      editedDate: '2024-03-20'
    },
    {
      id: 'meditation',
      term: 'Meditation',
      content: [
        {
          text: 'A transformative practice involving focused attention and conscious awareness.',
          sourceTerm: 'Meditation'
        },
        {
          text: 'Present moment awareness leads to understanding karma and actions better.',
          sourceTerm: 'Karma'
        }
      ],
      compiledDate: '2024-02-01',
      editedDate: '2024-03-25'
    }
  ];

  const getHighlightColor = (index) => highlightColors[index % highlightColors.length];

  const { searchTerms, isMultiLineSearch } = useMemo(() => {
    if (!searchTerm) return { searchTerms: [], isMultiLineSearch: true };
    
    if (searchTerm.includes('||')) {
      const terms = searchTerm
        .split('||')
        .map(term => term.trim())
        .filter(term => term.length > 0);
      return { searchTerms: terms, isMultiLineSearch: false };
    }
    
    const terms = searchTerm
      .split('|')
      .map(term => term.trim())
      .filter(term => term.length > 0);
    return { searchTerms: terms, isMultiLineSearch: true };
  }, [searchTerm]);

  const highlightText = (text, terms, allEntries) => {
    if (!terms || terms.length === 0 || !text) return text;
    
    const pattern = terms
      .map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const parts = text.split(regex);
    
    return (
      <span>
        {parts.map((part, index) => {
          const matchingTermIndex = terms.findIndex(
            term => part.toLowerCase() === term.toLowerCase()
          );
          
          if (matchingTermIndex !== -1) {
            const colorClass = getHighlightColor(matchingTermIndex);
            const relatedEntries = allEntries.filter(entry =>
              entry.term.toLowerCase().includes(part.toLowerCase()) ||
              entry.content.some(content =>
                content.text.toLowerCase().includes(part.toLowerCase())
              )
            );
            
            return (
              <span key={index} className="relative group">
                <span className={`${colorClass} px-0.5 rounded cursor-pointer`}>
                  {part}
                </span>
                {relatedEntries.length > 0 && (
                  <div className="absolute z-10 invisible group-hover:visible bg-white shadow-lg rounded-md py-1 mt-1 min-w-48">
                    {relatedEntries.map((entry, idx) => (
                      <a
                        key={idx}
                        href={`#${entry.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(entry.id)?.scrollIntoView({
                            behavior: 'smooth'
                          });
                        }}
                      >
                        Go to: {entry.term}
                      </a>
                    ))}
                  </div>
                )}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </span>
    );
  };

  const filteredEntries = useMemo(() => {
    if (!searchTerm) {
      return [...baseEntries].sort((a, b) => a.term.localeCompare(b.term));
    }

    return baseEntries.filter(entry =>
      entry.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.some(item =>
        item.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Spiritual Dictionary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Use | for any match, || for same-line matches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Examples: "karma|action" for any matches, "karma||action" for same-line matches
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredEntries.map((entry) => (
          <Card
            key={entry.id}
            id={entry.id}
            className="hover:shadow-lg transition-shadow scroll-mt-6"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl font-semibold">
                  {highlightText(entry.term, searchTerms, filteredEntries)}
                </CardTitle>
                <div className="text-sm text-gray-500 text-right">
                  <div>Compiled: {formatDate(entry.compiledDate)}</div>
                  <div>Last edited: {formatDate(entry.editedDate)}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2">
                {entry.content.map(({ text, sourceTerm }, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {highlightText(text, searchTerms, filteredEntries)}
                    {sourceTerm && sourceTerm !== entry.term && (
                      <span className="text-gray-500 ml-2">[from: {sourceTerm}]</span>
                    )}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SpiritualDictionary;
