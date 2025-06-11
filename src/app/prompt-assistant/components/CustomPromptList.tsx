"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import styles from "./CustomPromptList.module.css";

interface CustomPrompt {
  id: string;
  title: string;
  fields: string[];
  template: string;
  created_at: string;
}

interface CustomPromptListProps {
  onSelect: (assistant: any) => void;
  selectedAssistant: any;
}

export default function CustomPromptList({ onSelect, selectedAssistant }: CustomPromptListProps) {
  const [prompts, setPrompts] = useState<CustomPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.replace('/login');
          return;
        }

        const { data, error } = await supabase
          .from('custom_prompt_builders')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPrompts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();
  }, [router, supabase]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this prompt assistant?')) return;

    try {
      const { error } = await supabase
        .from('custom_prompt_builders')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPrompts(prompts.filter(prompt => prompt.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading your prompt assistants...</div>;
  }

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  if (prompts.length === 0) {
    return (
      <div className={styles.empty}>
        <p>You haven't created any prompt assistants yet.</p>
        <button 
          className={styles.createButton}
          onClick={() => router.push('/prompt-assistant-builder')}
        >
          Create Your First Assistant
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Your Custom Assistants</h2>
        <button 
          className={styles.createButton}
          onClick={() => router.push('/prompt-assistant-builder')}
        >
          Create New
        </button>
      </div>
      <div className={styles.list}>
        {prompts.map((prompt) => (
          <div 
            key={prompt.id} 
            className={`${styles.card} ${selectedAssistant?.id === prompt.id ? styles.selectedAssistant : ''}`}
            onClick={() => onSelect(prompt)}
          >
            <div className={styles.cardHeader}>
              <h3 className={styles.promptTitle}>{prompt.title}</h3>
              <button
                className={styles.deleteButton}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(prompt.id);
                }}
              >
                Delete
              </button>
            </div>
            <div className={styles.fields}>
              {prompt.fields.map((field, index) => (
                <span key={index} className={styles.field}>
                  {field}
                </span>
              ))}
            </div>
            <p className={styles.template}>{prompt.template}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 