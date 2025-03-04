import { Gltf } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

const block = new URL(
  "../assets/models/platforms/grass_block.glb",
  import.meta.url
).href;

const Level1 = () => {
  return (
    <>
      <RigidBody type="fixed" colliders="trimesh">
        <Gltf scale={2} src={block} position={[0, 0, 0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders="trimesh">
        <Gltf scale={2} src={block} position={[2, 0, 0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders="trimesh">
        <Gltf scale={2} src={block} position={[-2, 0, 0]} />
      </RigidBody>
      <RigidBody type="fixed" colliders="trimesh">
        <Gltf scale={2} src={block} position={[0, 0, 2]} />
      </RigidBody>
      <RigidBody type="fixed" colliders="trimesh">
        <Gltf scale={2} src={block} position={[0, 0, -2]} />
      </RigidBody>
    </>
  );
};

export default Level1;
