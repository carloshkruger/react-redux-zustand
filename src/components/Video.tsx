import ReactPlayer from "react-player";
import { useCurrentLesson, useStore } from "../zustand-store";
// import { next, useCurrentLesson } from "../store/slices/player";
// import { useAppDispatch } from "../store";

export function Video() {
  const { next } = useStore((state) => ({ next: state.next }));
  const { currentLesson } = useCurrentLesson();

  function handlePlayNext() {
    next();
  }

  // const dispatch = useAppDispatch();
  // const { currentLesson } = useCurrentLesson();

  // function handlePlayNext() {
  //   dispatch(next());
  // }

  return (
    <div className="w-full bg-zinc-950 aspect-video">
      <ReactPlayer
        width="100%"
        height="100%"
        controls
        playing
        onEnded={handlePlayNext}
        url={`https://www.youtube.com/watch?v=${currentLesson?.id}`}
      />
    </div>
  );
}
