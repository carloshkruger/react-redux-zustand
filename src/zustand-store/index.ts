import { create } from "zustand";
import { api } from "../lib/axios";

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

interface PlayProps {
  moduleIndex: number
  lessonIndex: number
}

export interface PlayerState {
  course: Course | null
  currentModuleIndex: number
  currentLessonIndex: number
  isLoading: boolean

  play: (params: PlayProps) => void
  next: () => void
  load: () => Promise<void>
}

export const useStore = create<PlayerState>((set, get) => {
  return {
    course: null,
    currentModuleIndex: 0,
    currentLessonIndex: 0,
    isLoading: true,

    load: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      set({ isLoading: true })

      const response = await api.get('/courses/1')

      set({ isLoading: false, course: response.data })
    },

    play: ({ moduleIndex, lessonIndex }: PlayProps) => {
      set({
        currentModuleIndex: moduleIndex,
        currentLessonIndex: lessonIndex
      })
    },

    next: () => {
      const { course, currentModuleIndex, currentLessonIndex } = get()

      if (!course) {
        return
      }

      const nextLessonIndex = currentLessonIndex + 1
      const currentModule = course.modules[currentModuleIndex]

      if (nextLessonIndex < currentModule.lessons.length) {
        set({ currentLessonIndex: nextLessonIndex })
        return
      }

      const nextModuleIndex = currentModuleIndex + 1
      if (nextModuleIndex < course.modules.length) {
        set({
          currentModuleIndex: nextModuleIndex,
          currentLessonIndex: 0
        })
      }
    }
  }
})

export const useCurrentLesson = () => {
  return useStore((state) => {
    const { currentModuleIndex, currentLessonIndex } = state;

    const currentModule = state.course?.modules[currentModuleIndex];
    const currentLesson = currentModule?.lessons[currentLessonIndex];

    return { currentModule, currentLesson };
  });
}