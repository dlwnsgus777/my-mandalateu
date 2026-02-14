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
        { id: 'b0c1', position: 1, isCenter: false, title: '매일 스트레칭', completed: true },
        { id: 'b0c2', position: 2, isCenter: false, title: '런닝 30분', completed: false },
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
        { id: 'b1c0', position: 0, isCenter: false, title: '채소 매일 먹기',  completed: true },
        { id: 'b1c1', position: 1, isCenter: false, title: '물 2L 마시기',    completed: true },
        { id: 'b1c2', position: 2, isCenter: false, title: '단 음식 줄이기',  completed: true },
        { id: 'b1c3', position: 3, isCenter: false, title: '아침 식사 하기',  completed: true },
        { id: 'b1c4', position: 4, isCenter: true,  title: '식단 관리',       completed: false },
        { id: 'b1c5', position: 5, isCenter: false, title: '칼로리 기록',     completed: true },
        { id: 'b1c6', position: 6, isCenter: false, title: '간식 줄이기',     completed: false },
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
        { id: 'b2c1', position: 1, isCenter: false, title: '7시 기상',        completed: false },
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
        { id: 'b3c0', position: 0, isCenter: false, title: '산책 30분',    completed: true },
        { id: 'b3c1', position: 1, isCenter: false, title: '음악 듣기',    completed: true },
        { id: 'b3c2', position: 2, isCenter: false, title: '친구 만나기',  completed: true },
        { id: 'b3c3', position: 3, isCenter: false, title: '취미 생활',    completed: true },
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
        { id: 'b4c8', position: 8, isCenter: false, title: '자기 계발',     completed: true },
      ],
    },
    // Block 5 (우중단): 명상 실천
    {
      id: 'block-5',
      position: 5,
      goalTitle: '명상 실천',
      cells: [
        { id: 'b5c0', position: 0, isCenter: false, title: '아침 명상 5분',  completed: true },
        { id: 'b5c1', position: 1, isCenter: false, title: '마음챙김 실천',  completed: false },
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
        { id: 'b6c0', position: 0, isCenter: false, title: 'BMI 측정',      completed: true },
        { id: 'b6c1', position: 1, isCenter: false, title: '인바디 검사',   completed: true },
        { id: 'b6c2', position: 2, isCenter: false, title: '목표 체중 설정', completed: true },
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
        { id: 'b8c2', position: 2, isCenter: false, title: '자격증 공부',   completed: true },
        { id: 'b8c3', position: 3, isCenter: false, title: '외국어 학습',   completed: true },
        { id: 'b8c4', position: 4, isCenter: true,  title: '자기 계발',     completed: false },
        { id: 'b8c5', position: 5, isCenter: false, title: '코딩 배우기',   completed: true },
        { id: 'b8c6', position: 6, isCenter: false, title: '글쓰기 연습',   completed: true },
        { id: 'b8c7', position: 7, isCenter: false, title: '세미나 참여',   completed: true },
        { id: 'b8c8', position: 8, isCenter: false, title: '유튜브 강의',   completed: false },
      ],
    },
  ],
};

// ─── 스토어 타입 ───────────────────────────────────────────────────────────────

interface MandalartState {
  currentProject: MandalartProject | null;
  toggleCell: (blockId: string, cellId: string) => void;
  updateBlockTitle: (blockId: string, title: string) => void;
  updateCellTitle: (blockId: string, cellId: string, title: string) => void;
}

// ─── 스토어 ───────────────────────────────────────────────────────────────────

export const useMandalartStore = create<MandalartState>()((set) => ({
  currentProject: MOCK_PROJECT,

  toggleCell: (blockId, cellId) =>
    set((state) => {
      if (!state.currentProject) return state;
      return {
        currentProject: {
          ...state.currentProject,
          updatedAt: new Date().toISOString(),
          blocks: state.currentProject.blocks.map((block) =>
            block.id === blockId
              ? {
                  ...block,
                  cells: block.cells.map((cell) =>
                    cell.id === cellId
                      ? { ...cell, completed: !cell.completed }
                      : cell
                  ),
                }
              : block
          ),
        },
      };
    }),

  updateBlockTitle: (blockId, title) =>
    set((state) => {
      if (!state.currentProject) return state;
      return {
        currentProject: {
          ...state.currentProject,
          updatedAt: new Date().toISOString(),
          blocks: state.currentProject.blocks.map((block) =>
            block.id === blockId ? { ...block, goalTitle: title } : block
          ),
        },
      };
    }),

  updateCellTitle: (blockId, cellId, title) =>
    set((state) => {
      if (!state.currentProject) return state;
      return {
        currentProject: {
          ...state.currentProject,
          updatedAt: new Date().toISOString(),
          blocks: state.currentProject.blocks.map((block) =>
            block.id === blockId
              ? {
                  ...block,
                  cells: block.cells.map((cell) =>
                    cell.id === cellId ? { ...cell, title } : cell
                  ),
                }
              : block
          ),
        },
      };
    }),
}));
