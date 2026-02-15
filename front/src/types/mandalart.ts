/**
 * 만다라트 도메인 타입 정의
 */

export interface MandalartCell {
  id: string;
  position: number; // 0-8 (블록 내 위치)
  isCenter: boolean;
  title: string;
  description?: string;
  completed: boolean;
  completedAt?: string; // ISO 8601 (완료 시각)
  deadline?: string;    // 'YYYY-MM-DD'
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
}

export interface MandalartBlock {
  id: string;
  position: number; // 0-8 (전체 그리드 내 위치)
  goalTitle: string;
  cells: MandalartCell[];
  notes?: string;
  color?: string;
}

export interface MandalartProject {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  blocks: MandalartBlock[];
}
