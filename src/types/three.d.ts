import * as React from "react";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: {
        ref?: React.Ref<THREE.Mesh>;
        children?: React.ReactNode;
      };
      sphereGeometry: {
        args?: [number, number, number];
      };
      meshBasicMaterial: {
        map?: THREE.Texture;
        side?: THREE.Side;
      };
      primitive: {
        object: THREE.Object3D;
        ref?: React.Ref<THREE.Group>;
      };
      ambientLight: {
        intensity?: number;
      };
      directionalLight: {
        intensity?: number;
        position?: [number, number, number];
      };
      pointLight: {
        intensity?: number;
        position?: [number, number, number];
      };
    }
  }
}

export {};
