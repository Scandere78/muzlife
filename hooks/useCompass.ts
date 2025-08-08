"use client";

import { useEffect, useRef, useState } from "react";

export type UseCompassResult = {
  heading: number; // degrees 0-360 from North
  error: string | null;
  isSupported: boolean;
  needsPermission: boolean;
  requestPermission: () => Promise<void>;
};

export const useCompass = (): UseCompassResult => {
  const [heading, setHeading] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [needsPermission, setNeedsPermission] = useState<boolean>(false);

  const isAndroidRef = useRef<boolean>(false);
  const isIOSRef = useRef<boolean>(false);
  const handlerRef = useRef<(e: DeviceOrientationEvent) => void>(() => {
    // Empty function
  });

  // Stable handler
  const ensureHandler = () => {
    if (handlerRef.current) return handlerRef.current;
    handlerRef.current = (event: DeviceOrientationEvent) => {
      let compass = 0;
      // Prefer iOS specific heading if present
      const wkHeading = (event as any).webkitCompassHeading as number | undefined;
      if (isIOSRef.current && typeof wkHeading === "number") {
        compass = wkHeading;
      } else if (typeof event.alpha === "number") {
        // On iOS, alpha increases counter-clockwise, invert to approximate compass
        compass = isIOSRef.current ? (360 - event.alpha) : event.alpha;
      } else {
        compass = 0;
      }
      setHeading(Math.round(((compass % 360) + 360) % 360));
      setIsSupported(true);
    };
    return handlerRef.current;
  };

  const addListener = () => {
    const handler = ensureHandler();
    window.addEventListener("deviceorientation", handler, true);
  };

  const removeListener = () => {
    const handler = ensureHandler();
    window.removeEventListener("deviceorientation", handler, true);
  };

  const requestPermission = async () => {
    try {
      const anyDOE = DeviceOrientationEvent as any;
      if (typeof anyDOE?.requestPermission === "function") {
        const response = await anyDOE.requestPermission();
        if (response === "granted") {
          setNeedsPermission(false);
          addListener();
        } else {
          setError("Permission refusée pour la boussole");
        }
      } else {
        addListener();
      }
    } catch {
      setError("Erreur permission boussole");
    }
  };

  useEffect(() => {
    isAndroidRef.current = /Android/i.test(navigator.userAgent);
    isIOSRef.current = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setError("Boussole non supportée");
      return;
    }

    // iOS 13+ needs explicit permission triggered by user gesture
    const anyDOE = DeviceOrientationEvent as any;
    if (typeof anyDOE?.requestPermission === "function" && isIOSRef.current) {
      setNeedsPermission(true);
    } else {
      addListener();
    }

    return () => {
      removeListener();
    };
  }, []);

  return { heading, error, isSupported, needsPermission, requestPermission };
};

