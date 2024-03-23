import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { useAppSelector } from "..";
import { api } from "../../lib/axios";

interface Course {
  id: number
  modules: {
    id: number
    title: string
    lessons: {
      id: string
      title: string
      duration: string
    }[]
  }[]
}

export interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
  isLoading: boolean
}

const initialState: PlayerState = {
  course: null,
  currentModuleIndex: 0,
  currentLessonIndex: 0,
  isLoading: true
}

export const loadCourse = createAsyncThunk('player/load', async () => {
  const response = await api.get('/courses/1')
  return response.data
})

export const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    play: (state, action: PayloadAction<{ moduleIndex: number, lessonIndex: number }>) => {
      state.currentModuleIndex = action.payload.moduleIndex
      state.currentLessonIndex = action.payload.lessonIndex
    },
    next: (state) => {
      if (!state.course) {
        return
      }

      const nextLessonIndex = state.currentLessonIndex + 1
      const currentModule = state.course.modules[state.currentModuleIndex]

      if (nextLessonIndex < currentModule.lessons.length) {
        state.currentLessonIndex = nextLessonIndex
        return
      }

      const nextModuleIndex = state.currentModuleIndex + 1
      if (nextModuleIndex < state.course.modules.length) {
        state.currentModuleIndex = nextModuleIndex
        state.currentLessonIndex = 0
      }
    }
  },
  extraReducers(builder) {
    builder.addCase(loadCourse.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(loadCourse.fulfilled, (state, action) => {
      state.course = action.payload
      state.isLoading = false
    })
  }
})

export const player = playerSlice.reducer

export const { play, next } = playerSlice.actions

export const useCurrentLesson = () => {
  return useAppSelector((state) => {
    const { currentModuleIndex, currentLessonIndex } = state.player;

    const currentModule = state.player.course?.modules[currentModuleIndex];
    const currentLesson = currentModule?.lessons[currentLessonIndex];

    return { currentModule, currentLesson };
  });
}