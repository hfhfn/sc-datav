export default function Lights() {
  return (
    <>
      <ambientLight intensity={1.7} color="#b8e3ff" />
      <directionalLight
        position={[38, 70, 28]}
        intensity={5.6}
        color="#e6f6ff"
      />
      <directionalLight
        position={[-48, 34, -46]}
        intensity={2.2}
        color="#3d9dff"
      />
      <pointLight
        position={[0, 16, 6]}
        intensity={95}
        distance={80}
        decay={2}
        color="#3fd6ff"
      />
    </>
  );
}
