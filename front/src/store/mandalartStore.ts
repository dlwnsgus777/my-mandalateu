/**
 * 만다라트 Zustand 스토어
 */

import { create } from 'zustand';
import { MandalartProject } from '../types/mandalart';

// ─── Mock 데이터 (초기 기본값) ──────────────────────────────────────────────────

const MOCK_PROJECT: MandalartProject = {
  id: 'project-1',
  title: '건강한 생활 2024',
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-15T00:00:00Z',
  blocks: [
    // Block 0 (좌상단): 운동 루틴
    {
      id: 'block-0',
      position: 0,
      goalTitle: '운동 루틴',
      cells: [
        { id: 'b0c0', position: 0, isCenter: false, title: '주 3회 헬스', completed: true },
        { id: 'b0c1', position: 1, isCenter: false, title: '매일 스트레칭', completed: true,  completedAt: '2026-02-15T11:00:00Z' },
        { id: 'b0c2', position: 2, isCenter: false, title: '런닝 30분',     completed: false, deadline: '2026-02-16' },
        { id: 'b0c3', position: 3, isCenter: false, title: '수영 배우기', completed: false },
        { id: 'b0c4', position: 4, isCenter: true,  title: '운동 루틴',   completed: false },
        { id: 'b0c5', position: 5, isCenter: false, title: '자전거 타기', completed: true },
        { id: 'b0c6', position: 6, isCenter: false, title: '등산 월 1회', completed: false },
        { id: 'b0c7', position: 7, isCenter: false, title: '홈트 루틴',   completed: false },
        { id: 'b0c8', position: 8, isCenter: false, title: '플랭크 5분',  completed: false },
      ],
    },
    // Block 1 (중상단): 식단 관리
    {
      id: 'block-1',
      position: 1,
      goalTitle: '식단 관리',
      cells: [
        { id: 'b1c0', position: 0, isCenter: false, title: '채소 매일 먹기',  completed: true, completedAt: '2026-02-16T08:00:00Z' },
        { id: 'b1c1', position: 1, isCenter: false, title: '물 2L 마시기',    completed: true },
        { id: 'b1c2', position: 2, isCenter: false, title: '단 음식 줄이기',  completed: true, completedAt: '2026-02-13T09:00:00Z' },
        { id: 'b1c3', position: 3, isCenter: false, title: '아침 식사 하기',  completed: true },
        { id: 'b1c4', position: 4, isCenter: true,  title: '식단 관리',       completed: false },
        { id: 'b1c5', position: 5, isCenter: false, title: '칼로리 기록',     completed: true },
        { id: 'b1c6', position: 6, isCenter: false, title: '간식 줄이기',     completed: false, deadline: '2026-02-17' },
        { id: 'b1c7', position: 7, isCenter: false, title: '외식 줄이기',     completed: false },
        { id: 'b1c8', position: 8, isCenter: false, title: '요리 배우기',     completed: false },
      ],
    },
    // Block 2 (우상단): 수면 개선
    {
      id: 'block-2',
      position: 2,
      goalTitle: '수면 개선',
      cells: [
        { id: 'b2c0', position: 0, isCenter: false, title: '11시 취침',       completed: true },
        { id: 'b2c1', position: 1, isCenter: false, title: '7시 기상',        completed: false, deadline: '2026-02-18' },
        { id: 'b2c2', position: 2, isCenter: false, title: '수면 일기 쓰기',  completed: true },
        { id: 'b2c3', position: 3, isCenter: false, title: '스마폰 금지',     completed: false },
        { id: 'b2c4', position: 4, isCenter: true,  title: '수면 개선',       completed: false },
        { id: 'b2c5', position: 5, isCenter: false, title: '명상 후 취침',    completed: false },
        { id: 'b2c6', position: 6, isCenter: false, title: '침실 환경 개선',  completed: false },
        { id: 'b2c7', position: 7, isCenter: false, title: '낮잠 15분',       completed: false },
        { id: 'b2c8', position: 8, isCenter: false, title: '수면 앱 사용',    completed: false },
      ],
    },
    // Block 3 (좌중단): 스트레스 해소
    {
      id: 'block-3',
      position: 3,
      goalTitle: '스트레스 해소',
      cells: [
        { id: 'b3c0', position: 0, isCenter: false, title: '산책 30분',    completed: true, completedAt: '2026-02-15T09:00:00Z' },
        { id: 'b3c1', position: 1, isCenter: false, title: '음악 듣기',    completed: true, completedAt: '2026-02-15T10:00:00Z' },
        { id: 'b3c2', position: 2, isCenter: false, title: '친구 만나기',  completed: true, completedAt: '2026-02-13T10:00:00Z' },
        { id: 'b3c3', position: 3, isCenter: false, title: '취미 생활',    completed: true, completedAt: '2026-02-12T10:00:00Z' },
        { id: 'b3c4', position: 4, isCenter: true,  title: '스트레스 해소', completed: false },
        { id: 'b3c5', position: 5, isCenter: false, title: '일기 쓰기',    completed: true },
        { id: 'b3c6', position: 6, isCenter: false, title: '영화 보기',    completed: true },
        { id: 'b3c7', position: 7, isCenter: false, title: '여행 계획',    completed: false },
        { id: 'b3c8', position: 8, isCenter: false, title: '심호흡 연습',  completed: false },
      ],
    },
    // Block 4 (중앙): 건강한 생활 (메인 목표)
    {
      id: 'block-4',
      position: 4,
      goalTitle: '건강한 생활',
      cells: [
        { id: 'b4c0', position: 0, isCenter: false, title: '운동 루틴',     completed: false },
        { id: 'b4c1', position: 1, isCenter: false, title: '식단 관리',     completed: true },
        { id: 'b4c2', position: 2, isCenter: false, title: '수면 개선',     completed: false },
        { id: 'b4c3', position: 3, isCenter: false, title: '스트레스 해소', completed: true },
        { id: 'b4c4', position: 4, isCenter: true,  title: '건강한 생활',   completed: false },
        { id: 'b4c5', position: 5, isCenter: false, title: '명상 실천',     completed: false },
        { id: 'b4c6', position: 6, isCenter: false, title: '체중 관리',     completed: false },
        { id: 'b4c7', position: 7, isCenter: false, title: '사회 활동',     completed: false },
        { id: 'b4c8', position: 8, isCenter: false, title: '자기 계발',     completed: true, completedAt: '2026-02-09T09:00:00Z' },
      ],
    },
    // Block 5 (우중단): 명상 실천
    {
      id: 'block-5',
      position: 5,
      goalTitle: '명상 실천',
      cells: [
        { id: 'b5c0', position: 0, isCenter: false, title: '아침 명상 5분',  completed: true,  completedAt: '2026-02-16T10:00:00Z' },
        { id: 'b5c1', position: 1, isCenter: false, title: '마음챙김 실천',  completed: false, deadline: '2026-02-19' },
        { id: 'b5c2', position: 2, isCenter: false, title: '호흡 명상',      completed: false },
        { id: 'b5c3', position: 3, isCenter: false, title: '바디스캔 명상',  completed: false },
        { id: 'b5c4', position: 4, isCenter: true,  title: '명상 실천',      completed: false },
        { id: 'b5c5', position: 5, isCenter: false, title: '만트라 명상',    completed: false },
        { id: 'b5c6', position: 6, isCenter: false, title: '가이드 명상',    completed: false },
        { id: 'b5c7', position: 7, isCenter: false, title: '자연 명상',      completed: false },
        { id: 'b5c8', position: 8, isCenter: false, title: '감사 명상',      completed: false },
      ],
    },
    // Block 6 (좌하단): 체중 관리
    {
      id: 'block-6',
      position: 6,
      goalTitle: '체중 관리',
      cells: [
        { id: 'b6c0', position: 0, isCenter: false, title: 'BMI 측정',       completed: true, completedAt: '2026-02-14T08:00:00Z' },
        { id: 'b6c1', position: 1, isCenter: false, title: '인바디 검사',    completed: true, completedAt: '2026-02-14T09:00:00Z' },
        { id: 'b6c2', position: 2, isCenter: false, title: '목표 체중 설정', completed: true, completedAt: '2026-02-13T10:00:00Z' },
        { id: 'b6c3', position: 3, isCenter: false, title: '주간 체중 측정', completed: true },
        { id: 'b6c4', position: 4, isCenter: true,  title: '체중 관리',     completed: false },
        { id: 'b6c5', position: 5, isCenter: false, title: '체지방 관리',   completed: false },
        { id: 'b6c6', position: 6, isCenter: false, title: '근육량 증가',   completed: false },
        { id: 'b6c7', position: 7, isCenter: false, title: '식이 조절',     completed: false },
        { id: 'b6c8', position: 8, isCenter: false, title: '규칙적 식사',   completed: false },
      ],
    },
    // Block 7 (중하단): 사회 활동
    {
      id: 'block-7',
      position: 7,
      goalTitle: '사회 활동',
      cells: [
        { id: 'b7c0', position: 0, isCenter: false, title: '친구 모임',       completed: false },
        { id: 'b7c1', position: 1, isCenter: false, title: '동호회 가입',     completed: false },
        { id: 'b7c2', position: 2, isCenter: false, title: '봉사 활동',       completed: false },
        { id: 'b7c3', position: 3, isCenter: false, title: '가족 모임',       completed: false },
        { id: 'b7c4', position: 4, isCenter: true,  title: '사회 활동',       completed: false },
        { id: 'b7c5', position: 5, isCenter: false, title: '직장 친목',       completed: false },
        { id: 'b7c6', position: 6, isCenter: false, title: '온라인 커뮤니티', completed: false },
        { id: 'b7c7', position: 7, isCenter: false, title: '새 취미 모임',    completed: false },
        { id: 'b7c8', position: 8, isCenter: false, title: '멘토링',          completed: false },
      ],
    },
    // Block 8 (우하단): 자기 계발
    {
      id: 'block-8',
      position: 8,
      goalTitle: '자기 계발',
      cells: [
        { id: 'b8c0', position: 0, isCenter: false, title: '독서 월 2권',   completed: true },
        { id: 'b8c1', position: 1, isCenter: false, title: '온라인 강의',   completed: true },
        { id: 'b8c2', position: 2, isCenter: false, title: '자격증 공부',   completed: true, completedAt: '2026-02-12T09:00:00Z' },
        { id: 'b8c3', position: 3, isCenter: false, title: '외국어 학습',   completed: true, completedAt: '2026-02-12T10:00:00Z' },
        { id: 'b8c4', position: 4, isCenter: true,  title: '자기 계발',     completed: false },
        { id: 'b8c5', position: 5, isCenter: false, title: '코딩 배우기',   completed: true, completedAt: '2026-02-16T09:00:00Z' },
        { id: 'b8c6', position: 6, isCenter: false, title: '글쓰기 연습',   completed: true },
        { id: 'b8c7', position: 7, isCenter: false, title: '세미나 참여',   completed: true, completedAt: '2026-02-09T10:00:00Z' },
        { id: 'b8c8', position: 8, isCenter: false, title: '유튜브 강의',   completed: false },
      ],
    },
  ],
};

// ─── 유틸 ─────────────────────────────────────────────────────────────────────

const genId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const createBlankProject = (title: string, coreGoal: string = ''): MandalartProject => {
  const id = genId();
  const now = new Date().toISOString();
  return {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    blocks: Array.from({ length: 9 }, (_, blockPos) => ({
      id: `${id}-b${blockPos}`,
      position: blockPos,
      goalTitle: blockPos === 4 ? coreGoal : '',
      cells: Array.from({ length: 9 }, (_, cellPos) => ({
        id: `${id}-b${blockPos}c${cellPos}`,
        position: cellPos,
        isCenter: cellPos === 4,
        title: blockPos === 4 && cellPos === 4 ? coreGoal : '',
        completed: false,
      })),
    })),
  };
};

// currentProject를 업데이트하고 projects 배열도 동기화하는 헬퍼
const applyToProject = (
  state: MandalartState,
  updater: (p: MandalartProject) => MandalartProject
): Partial<MandalartState> => {
  if (!state.currentProject) return {};
  const updated = updater(state.currentProject);
  return {
    currentProject: updated,
    projects: state.projects.map((p) => (p.id === updated.id ? updated : p)),
  };
};

// ─── 스토어 타입 ───────────────────────────────────────────────────────────────

interface MandalartState {
  projects: MandalartProject[];
  currentProject: MandalartProject | null;
  // 실행 과제
  toggleCell: (blockId: string, cellId: string) => void;
  updateCellTitle: (blockId: string, cellId: string, title: string) => void;
  // 목표 편집 (데이터 동기화 포함)
  updateCoreGoal: (title: string) => void;
  updateSubGoal: (cellPosition: number, title: string) => void;
  // 블록 메모
  updateBlockNotes: (blockId: string, notes: string) => void;
  // 블록 색상
  updateBlockColor: (blockId: string, color: string | undefined) => void;
  // 프로젝트
  updateProjectTitle: (title: string) => void;
  createProject: (title: string, coreGoal?: string) => void;
  switchProject: (projectId: string) => void;
  resetProject: () => void;
}

// ─── 스토어 ───────────────────────────────────────────────────────────────────

export const useMandalartStore = create<MandalartState>()((set) => ({
  projects: [MOCK_PROJECT],
  currentProject: MOCK_PROJECT,

  // 실행 과제 완료 토글
  toggleCell: (blockId, cellId) =>
    set((state) =>
      applyToProject(state, (p) => ({
        ...p,
        updatedAt: new Date().toISOString(),
        blocks: p.blocks.map((block) =>
          block.id === blockId
            ? {
                ...block,
                cells: block.cells.map((cell) => {
                  if (cell.id !== cellId) return cell;
                  const nowCompleted = !cell.completed;
                  return {
                    ...cell,
                    completed: nowCompleted,
                    completedAt: nowCompleted ? new Date().toISOString() : undefined,
                  };
                }),
              }
            : block
        ),
      }))
    ),

  // 실행 과제 제목 편집
  updateCellTitle: (blockId, cellId, title) =>
    set((state) =>
      applyToProject(state, (p) => ({
        ...p,
        updatedAt: new Date().toISOString(),
        blocks: p.blocks.map((block) =>
          block.id === blockId
            ? {
                ...block,
                cells: block.cells.map((cell) =>
                  cell.id === cellId ? { ...cell, title } : cell
                ),
              }
            : block
        ),
      }))
    ),

  // 핵심 목표 편집 (중앙 블록의 중앙 셀)
  updateCoreGoal: (title) =>
    set((state) =>
      applyToProject(state, (p) => ({
        ...p,
        updatedAt: new Date().toISOString(),
        blocks: p.blocks.map((block) =>
          block.position === 4
            ? {
                ...block,
                goalTitle: title,
                cells: block.cells.map((cell) =>
                  cell.isCenter ? { ...cell, title } : cell
                ),
              }
            : block
        ),
      }))
    ),

  // 세부 목표 편집: 중앙 블록의 해당 셀 + 대응 블록의 goalTitle·중앙 셀 동기화
  updateSubGoal: (cellPosition, title) =>
    set((state) =>
      applyToProject(state, (p) => ({
        ...p,
        updatedAt: new Date().toISOString(),
        blocks: p.blocks.map((block) => {
          // 중앙 블록: 해당 위치의 셀 제목 업데이트
          if (block.position === 4) {
            return {
              ...block,
              cells: block.cells.map((cell) =>
                cell.position === cellPosition ? { ...cell, title } : cell
              ),
            };
          }
          // 대응 블록: goalTitle + 중앙 셀 동기화
          if (block.position === cellPosition) {
            return {
              ...block,
              goalTitle: title,
              cells: block.cells.map((cell) =>
                cell.isCenter ? { ...cell, title } : cell
              ),
            };
          }
          return block;
        }),
      }))
    ),

  // 블록 색상 변경
  updateBlockColor: (blockId, color) =>
    set((state) =>
      applyToProject(state, (p) => ({
        ...p,
        updatedAt: new Date().toISOString(),
        blocks: p.blocks.map((block) =>
          block.id === blockId ? { ...block, color } : block
        ),
      }))
    ),

  // 블록 메모 편집
  updateBlockNotes: (blockId, notes) =>
    set((state) =>
      applyToProject(state, (p) => ({
        ...p,
        updatedAt: new Date().toISOString(),
        blocks: p.blocks.map((block) =>
          block.id === blockId ? { ...block, notes } : block
        ),
      }))
    ),

  // 프로젝트 제목 편집
  updateProjectTitle: (title) =>
    set((state) =>
      applyToProject(state, (p) => ({
        ...p,
        title,
        updatedAt: new Date().toISOString(),
      }))
    ),

  // 새 프로젝트 생성
  createProject: (title, coreGoal = '') =>
    set((state) => {
      const newProject = createBlankProject(title, coreGoal);
      return {
        projects: [...state.projects, newProject],
        currentProject: newProject,
      };
    }),

  // 프로젝트 전환
  switchProject: (projectId) =>
    set((state) => {
      const project = state.projects.find((p) => p.id === projectId);
      return project ? { currentProject: project } : state;
    }),

  // 데이터 초기화 (Mock 데이터로 복원)
  resetProject: () =>
    set({
      projects: [MOCK_PROJECT],
      currentProject: MOCK_PROJECT,
    }),
}));
