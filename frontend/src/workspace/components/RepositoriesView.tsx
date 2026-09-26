import { useState } from 'react';
import { Badge } from '../../components/Badge/Badge';
import { Button } from '../../components/Button/Button';
import type { Repository } from '../types';
import styles from './RepositoriesView.module.css';

interface RepositoriesViewProps {
  repositories: Repository[];
  selectedRepo: Repository;
  onSelectRepo: (repo: Repository) => void;
  onNewTaskWithRepo: (repo: Repository) => void;
}

export function RepositoriesView({
  repositories,
  selectedRepo,
  onSelectRepo,
  onNewTaskWithRepo,
}: RepositoriesViewProps) {
  const [search, setSearch] = useState('');

  const filtered = repositories.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <div className={styles.headerArea}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Repositories</h1>
          <p className={styles.subtitle}>
            Connected local codebases ready for autonomous investigation and repair.
          </p>
        </div>

        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search repositories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyTitle}>No repositories found</div>
          <p className={styles.emptySubtitle}>Try adjusting your search query.</p>
          {search && (
            <Button variant="ghost" size="sm" onClick={() => setSearch('')}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className={styles.repoList}>
          {filtered.map((repo) => {
          const isSelected = repo.id === selectedRepo.id;
          return (
            <div
              key={repo.id}
              className={`${styles.repoRow} ${isSelected ? styles.selected : ''}`}
              onClick={() => onSelectRepo(repo)}
            >
              <div className={styles.repoLeft}>
                <span className={styles.repoIcon}>◫</span>
                <div className={styles.repoMeta}>
                  <span className={styles.repoName}>{repo.name}</span>
                  <span className={styles.repoDetails}>
                    {repo.language} &bull; branch: {repo.branch} &bull; {repo.filesCount} files
                  </span>
                </div>
              </div>

              <div className={styles.repoRight}>
                <Badge variant={isSelected ? 'verified' : 'neutral'}>
                  {isSelected ? 'Active' : repo.status}
                </Badge>
                <div className={styles.actionButtons}>
                  <Button
                    variant={isSelected ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRepo(repo);
                    }}
                  >
                    Open
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRepo(repo);
                      onNewTaskWithRepo(repo);
                    }}
                  >
                    New Task
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      )}
    </div>
  );
}
