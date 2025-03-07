import { Canvas } from "@react-three/fiber";
import Experience from "./components/Experience";

import "./App.css";
import { Suspense } from "react";
import Loader from "./components/UI/Loader";
import { Physics } from "@react-three/rapier";
import { Environment, KeyboardControls } from "@react-three/drei";
import StartScreen from "./components/UI/StartScreen";

const HDR_PATH = new URL("./assets/sky_1k.hdr", import.meta.url).href;

const keyboardMap = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "left", keys: ["ArrowLeft", "KeyA"] },
  { name: "right", keys: ["ArrowRight", "KeyD"] },
  { name: "run", keys: ["Shift"] },
];

export default function Scene() {
  return (
    <>
      <KeyboardControls map={keyboardMap}>
        <Canvas
          resize={{ polyfill: ResizeObserver }}
          camera={{ position: [3, 8, 3], near: 0.3, fov: 40 }}
        >
          <Suspense fallback={<Loader />}>
            <gridHelper args={[2000, 2000, 0xff22aa, 0x55ccff]} />
            {/* <Perf position="top-left" /> */}
            <Environment files={HDR_PATH} background />
            <Physics debug>
              <Experience />
            </Physics>
          </Suspense>
        </Canvas>
      </KeyboardControls>

      <StartScreen />
    </>
  );
}
