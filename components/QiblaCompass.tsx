"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useCompass } from "../hooks/useCompass";

type Geo = { lat: number; lng: number };

const KAABA: Geo = { lat: 21.422487, lng: 39.826206 };

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

function normalizeDegrees(deg: number): number {
  const d = ((deg % 360) + 360) % 360;
  return d;
}

// Initial bearing (forward azimuth) from point A to B on a great circle
function computeBearing(from: Geo, to: Geo): number {
  const φ1 = toRadians(from.lat);
  const φ2 = toRadians(to.lat);
  const λ1 = toRadians(from.lng);
  const λ2 = toRadians(to.lng);
  const Δλ = λ2 - λ1;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return normalizeDegrees(toDegrees(θ));
}

export default function QiblaCompass(): React.ReactElement {
  const [position, setPosition] = useState<Geo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { heading, error: compassError, isSupported, needsPermission, requestPermission } = useCompass();

  useEffect(() => {
    if (compassError) setError(compassError);
  }, [compassError]);

  useEffect(() => {
    let geoWatchId: number | null = null;
    if (navigator.geolocation) {
      geoWatchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        () => setError("Impossible de récupérer votre position"),
        { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 }
      );
    } else {
      setError("Géolocalisation non disponible");
    }

    return () => {
      if (geoWatchId !== null) navigator.geolocation.clearWatch(geoWatchId);
    };
  }, []);

  const qiblaBearing = useMemo(() => {
    if (!position) return null;
    return computeBearing(position, KAABA);
  }, [position]);

  const arrowRotation = useMemo(() => {
    if (qiblaBearing == null) return 0;
    if (heading == null) return qiblaBearing; // no compass: show absolute bearing from North
    // Rotate arrow by (qibla - heading) so it points towards Qibla relative to device's current heading
    return normalizeDegrees(qiblaBearing - heading);
  }, [qiblaBearing, heading]);

  return (
    <section className="mt-8">
      <h3 className="text-xl font-bold text-[var(--color-accent)] mb-3">🧭 Direction de la Qibla</h3>
      <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-muted)]/60 p-5">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Compass UI */}
          <div className="relative w-40 h-40 sm:w-48 sm:h-48">
            <div className="absolute inset-0 rounded-full border-2 border-[var(--color-border)] bg-[var(--color-background)]/40 flex items-center justify-center">
              <div className="absolute top-2 text-xs text-[var(--color-foreground)]/70">N</div>
              <div className="absolute right-2 text-xs text-[var(--color-foreground)]/70">E</div>
              <div className="absolute bottom-2 text-xs text-[var(--color-foreground)]/70">S</div>
              <div className="absolute left-2 text-xs text-[var(--color-foreground)]/70">O</div>
              <div
                className="w-1 h-14 sm:h-16 origin-bottom rounded-full"
                style={{
                  background: "linear-gradient(180deg, var(--color-accent), rgba(255,255,255,0))",
                  transform: `translateY(10px) rotate(${arrowRotation}deg)`
                }}
                aria-hidden
              />
            </div>
          </div>

          {/* Info / permissions */}
          <div className="flex-1">
            <div className="text-sm text-[var(--color-foreground)]/80">
              {position ? (
                <div className="mb-2">
                  <span>Cap Qibla: </span>
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {qiblaBearing?.toFixed(0)}°
                  </span>
                  <span className="text-[var(--color-foreground)]/60"> (par rapport au Nord)</span>
                </div>
              ) : (
                <div className="mb-2">Obtention de votre position…</div>
              )}

              {isSupported ? (
                <div className="mb-2">Boussole: {heading.toFixed(0)}°</div>
              ) : needsPermission ? (
                <button
                  onClick={requestPermission}
                  className="px-3 py-2 rounded bg-[var(--color-accent)] text-white text-sm font-semibold"
                >
                  Autoriser l'accès aux capteurs
                </button>
              ) : (
                <div className="mb-2">Boussole non disponible. Affichage de la direction absolue.</div>
              )}

              {error && (
                <div className="text-red-500 text-sm mt-1">{error}</div>
              )}

              <p className="mt-3 text-xs text-[var(--color-foreground)]/60">
                Conseil: Tenez votre téléphone à plat et éloignez-le de tout aimant/métal pour une meilleure précision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

