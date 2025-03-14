import { useState } from "react";
import { useDispatch } from "react-redux";
import { startGame } from "../../store/gameSlice";
import { Canvas } from "@react-three/fiber";
import { useGLTF, useAnimations } from "@react-three/drei";
import * as THREE from "three";

const AvatarModel = () => {
  const { scene, animations } = useGLTF("/assets/models/player/vegas@wave.glb");
  const { actions } = useAnimations(animations, scene);

  //Plays the first animation on load
  useState(() => {
    if (actions) actions[Object.keys(actions)[0]]?.play();
  });

  return <primitive object={scene} scale={5} position={[0, 0, 0]} />;
};

const StartScreen = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const dispatch = useDispatch();

  return (
    <>
      {showWelcome && (
        <div className="absolute inset-0 flex flex-row items-center justify-center z-50 bg-gradient-to-t from-[#3d006e] via-[#231e52] to-[#19153b]">
          {/* Left Half: Avatar Model */}
          <div className="w-1/2 h-screen flex items-center justify-center">
            <Canvas
              camera={{ position: [0, 10, 10] }}
              onCreated={({ camera }) => {
                camera.lookAt(new THREE.Vector3(0, 6, 0));
              }}
            >
              <ambientLight intensity={0.5} />
              <directionalLight position={[2, 2, 5]} />
              <AvatarModel />
            </Canvas>
          </div>

          {/* Right Half: Menu */}
          <div className="w-1/2 h-screen flex items-center justify-center">
            <div className="bg-[#000025] text-white py-10 border-2 border-pink-500 rounded-lg shadow-[0_0_15px_#ff00ff] flex flex-col items-center max-w-2xl w-full select-none">
              <h1 className="text-5xl font-bold">ThreeRun</h1>
              <div className="flex flex-row items-center gap-3 w-full pt-5">
                <div className="flex flex-col items-center gap-3 w-2/3">
                  <kbd className="min-h-7.5 inline-flex justify-center items-center py-2 px-4 bg-pink-200 border-2 border-pink-500 shadow-[0_0_15px_#ff00ff] font-mono text-xl font-bold text-gray-800 rounded-md">
                    W
                  </kbd>
                  <div className="flex items-center justify-between w-1/2">
                    <kbd className="py-2 px-4 bg-pink-200 border-2 border-pink-500 shadow-[0_0_15px_#ff00ff] font-mono text-xl font-bold text-gray-800 rounded-md">
                      A
                    </kbd>

                    <kbd className="py-2 px-4 bg-pink-200 border-2 border-pink-500 shadow-[0_0_15px_#ff00ff] font-mono text-xl font-bold text-gray-800 rounded-md">
                      D
                    </kbd>
                  </div>
                </div>
                <div className="w-1/3">
                  <h2 className="text-2xl">- To move</h2>
                </div>
              </div>
              <div className="flex flex-row items-center gap-3 w-full pt-5">
                <div className="flex flex-col items-center gap-3 w-2/3">
                  <kbd className="min-h-7.5 inline-flex justify-center items-center py-2 px-4 bg-pink-200 border-2 border-pink-500 shadow-[0_0_15px_#ff00ff] font-mono text-xl font-bold text-gray-800 rounded-md">
                    Shift
                  </kbd>
                </div>
                <div className="w-1/3">
                  <h2 className="text-2xl">- To run</h2>
                </div>
              </div>
              <div className="flex flex-row items-center gap-3 w-full pt-5">
                <div className="flex flex-col items-center gap-3 w-2/3">
                  <kbd className="min-h-7.5 inline-flex justify-center items-center py-2 px-15 bg-pink-200 border-2 border-pink-500 shadow-[0_0_15px_#ff00ff] font-mono text-xl font-bold text-gray-800 rounded-md">
                    Space
                  </kbd>
                </div>
                <div className="w-1/3">
                  <h2 className="text-2xl">- To jump</h2>
                </div>
              </div>

              <button
                className="mt-10 px-10 py-4 text-white font-bold uppercase bg-black border-2 border-purple-500 rounded-lg shadow-[0_0_15px_#a855f7] hover:shadow-[0_0_25px_#a855f7] transition duration-300"
                onClick={() => {
                  dispatch(startGame());
                  setShowWelcome(false);
                }}
              >
                Begin
              </button>

              <p className="mt-5 text-center">
                The model and animations are from -{" "}
                <a
                  href="https://www.mixamo.com"
                  target="_blank"
                  rel="nofollow noreferrer"
                  className="text-pink-400 underline"
                >
                  Mixamo
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StartScreen;
