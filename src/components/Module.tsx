import * as Collapsible from "@radix-ui/react-collapsible";
import { ChevronDown } from "lucide-react";
import { Lesson } from "./Lesson";
import { useAppDispatch, useAppSelector } from "../store";
import { play } from "../store/slices/player";

interface ModuleProps {
  moduleIndex: number;
  title: string;
  amountOfLessons: number;
}

export function Module({ title, amountOfLessons, moduleIndex }: ModuleProps) {
  const { lessons, currentModuleIndex, currentLessonIndex } = useAppSelector(
    (state) => {
      const lessons = state.player.course?.modules[moduleIndex].lessons;
      const currentModuleIndex = state.player.currentModuleIndex;
      const currentLessonIndex = state.player.currentLessonIndex;

      return {
        lessons,
        currentModuleIndex,
        currentLessonIndex,
      };
    }
  );
  const dispatch = useAppDispatch();

  function handlePlayLesson(lessonIndex: number) {
    dispatch(
      play({
        moduleIndex,
        lessonIndex,
      })
    );
  }

  return (
    <Collapsible.Root className="group" defaultOpen={moduleIndex === 0}>
      <Collapsible.Trigger className="flex w-full items-center gap-3 bg-zinc-800 p-4">
        <div className="flex h-10 w-10 rounded-full items-center justify-center bg-zinc-950 text-xs">
          {moduleIndex + 1}
        </div>
        <div className="flex flex-col gap-1 text-left">
          <strong className="text-sm">{title}</strong>
          <span className="text-xs text-zinc-400">{amountOfLessons} aulas</span>
        </div>

        <ChevronDown className="w-5 h-5 ml-auto text-zinc-400 group-data-[state=open]:rotate-180 transition-transform" />
      </Collapsible.Trigger>

      <Collapsible.Content>
        <nav className="relative flex flex-col gap-4 p-6">
          {lessons &&
            lessons.map((lesson, index) => {
              const isCurrent =
                moduleIndex === currentModuleIndex &&
                index === currentLessonIndex;

              return (
                <Lesson
                  key={lesson.id}
                  title={lesson.title}
                  duration={lesson.duration}
                  isCurrent={isCurrent}
                  onPlay={() => handlePlayLesson(index)}
                />
              );
            })}
        </nav>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
