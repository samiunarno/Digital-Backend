import React, { useState, useEffect } from 'react';
import { GitCommit, Calendar, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';

interface GitHubCommit {
  sha: string;
  message: string;
  author: string;
  date: string;
  url: string;
}

interface GitHubCommitsProps {
  className?: string;
  limit?: number;
  showAuthor?: boolean;
  compact?: boolean;
}

export default function GitHubCommits({ 
  className = "",
  limit = 5,
  showAuthor = true,
  compact = false
}: GitHubCommitsProps) {
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        // Fetch from the Digital-Backend repository
        const response = await fetch('https://api.github.com/repos/samiunarno/Digital-Backend/commits?per_page=' + limit);
        
        if (!response.ok) {
          throw new Error('Failed to fetch commits');
        }
        
        const data = await response.json();
        
        // Transform the API response to match our interface
        const formattedCommits: GitHubCommit[] = data.map((commit: any) => ({
          sha: commit.sha,
          message: commit.commit.message,
          author: commit.commit.author.name,
          date: commit.commit.author.date,
          url: commit.html_url
        }));
        
        setCommits(formattedCommits);
      } catch (err) {
        setError('Unable to load recent commits');
        console.error('Error fetching commits:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [limit]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className={cn("flex items-center gap-3 text-muted", className)}>
        <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Loading commits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("text-red-500 text-sm", className)}>
        {error}
      </div>
    );
  }

  if (commits.length === 0) {
    return (
      <div className={cn("text-muted text-sm", className)}>
        No commits found
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <GitCommit className="w-4 h-4 text-accent" />
        <h3 className="font-bold uppercase tracking-wider text-sm">
          Recent Commits
        </h3>
      </div>
      
      <div className="space-y-3">
        {commits.map((commit, index) => (
          <a
            key={commit.sha}
            href={commit.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group flex items-start gap-3 p-3 rounded-lg border border-border hover:border-accent/50 hover:bg-white/[0.02] transition-all duration-300",
              compact ? "p-2" : ""
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              <div className={cn(
                "w-2 h-2 rounded-full transition-colors",
                index === 0 ? "bg-accent animate-pulse" : "bg-accent/40"
              )} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "font-mono text-sm leading-tight truncate",
                    compact ? "text-xs" : ""
                  )}>
                    {truncateMessage(commit.message)}
                  </p>
                  
                  {showAuthor && (
                    <p className={cn(
                      "text-xs text-muted/60 mt-1",
                      compact ? "hidden" : ""
                    )}>
                      by {commit.author}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Calendar className="w-3 h-3 text-muted/60" />
                  <span className={cn(
                    "text-xs text-muted/60 font-mono",
                    compact ? "hidden" : ""
                  )}>
                    {formatDate(commit.date)}
                  </span>
                  <ExternalLink className="w-3 h-3 text-muted/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <a
        href="https://github.com/samiunarno/Digital-Backend/commits"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 text-accent hover:text-white transition-colors text-sm font-mono uppercase tracking-wider"
      >
        View all commits
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
}