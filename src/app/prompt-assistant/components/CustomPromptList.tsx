"use client";

import { useState } from 'react'

interface PromptTemplate {
  title: string
  description: string
  template: string
  category: string
}

interface CustomPromptListProps {
  templates: PromptTemplate[]
  onSelect: (template: PromptTemplate) => void
}

export default function CustomPromptList({ templates, onSelect }: CustomPromptListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const categories = ['all', ...new Set(templates.map(t => t.category))]

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search templates..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-white"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.map((template) => (
          <div
            key={template.title}
            onClick={() => onSelect(template)}
            className="cursor-pointer rounded-lg border border-gray-600 bg-gray-700 p-4 transition-all hover:border-blue-500 hover:bg-gray-600"
          >
            <h3 className="mb-2 text-lg font-semibold text-white">{template.title}</h3>
            <p className="text-sm text-gray-300">{template.description}</p>
            <div className="mt-2">
              <span className="inline-block rounded-full bg-blue-500/20 px-2 py-1 text-xs text-blue-300">
                {template.category}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center text-gray-400">
          No templates found. Try adjusting your search or category filter.
        </div>
      )}
    </div>
  )
} 