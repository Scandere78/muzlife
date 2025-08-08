"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

type WuduStep = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  repeatCount?: number; // Times to repeat the action (e.g., 3x)
};

const WUDU_STEPS: WuduStep[] = [
  {
    id: "intro",
    title: "Apprendre les ablutions (Wudû’)",
    description:
      "Glisse vers le bas pour suivre chaque étape. C’est facile et amusant !",
    emoji: "💧",
  },
  {
    id: "intention",
    title: "1) L’intention (Niyyah)",
    description:
      "Dans ton cœur, décide que tu fais tes ablutions pour prier et plaire à Allah.",
    emoji: "🧠",
  },
  {
    id: "bismillah",
    title: "2) Dis \"Bismillah\"",
    description: "On commence en disant: Bismillah (Au nom d’Allah).",
    emoji: "✨",
  },
  {
    id: "mains",
    title: "3) Lave les mains",
    description:
      "Lave tes deux mains jusqu’aux poignets, 3 fois. Frotte entre les doigts.",
    emoji: "👐",
    repeatCount: 3,
  },
  {
    id: "bouche",
    title: "4) Rince la bouche",
    description: "Prends de l’eau, fais-la tourner dans la bouche et recrache, 3 fois.",
    emoji: "👄",
    repeatCount: 3,
  },
  {
    id: "nez",
    title: "5) Rince le nez",
    description:
      "Inspire légèrement de l’eau par le nez avec les doigts, puis souffle pour nettoyer, 3 fois.",
    emoji: "👃",
    repeatCount: 3,
  },
  {
    id: "visage",
    title: "6) Lave le visage",
    description:
      "Du front au menton et d’une oreille à l’autre, 3 fois. Passe bien partout !",
    emoji: "🙂",
    repeatCount: 3,
  },
  {
    id: "bras",
    title: "7) Lave les bras",
    description:
      "Du bout des doigts jusqu’aux coudes, 3 fois chaque bras. Commence par la droite.",
    emoji: "💪",
    repeatCount: 3,
  },
  {
    id: "tete",
    title: "8) Passe les mains mouillées sur la tête",
    description:
      "Avec des mains mouillées, essuie la tête d’avant en arrière (1 fois).",
    emoji: "🧑‍🦱",
    repeatCount: 1,
  },
  {
    id: "oreilles",
    title: "9) Essuie les oreilles",
    description:
      "Avec les mains encore humides, essuie doucement l’intérieur et l’extérieur des oreilles (1 fois).",
    emoji: "👂",
    repeatCount: 1,
  },
  {
    id: "pieds",
    title: "10) Lave les pieds",
    description:
      "Jusqu’aux chevilles, 3 fois chaque pied. Passe entre les orteils. Commence par le droit.",
    emoji: "🦶",
    repeatCount: 3,
  },
  {
    id: "duaa",
    title: "Bravo !",
    description:
      "Dis: Ash-hadu an lâ ilâha illâ-llâh, wa ash-hadu anna Muhammadan ‘abduhû wa rasûluh. Tes ablutions sont terminées !",
    emoji: "🎉",
  },
];

// Map des images fournies (1.png -> 9.png) aux étapes correspondantes
const IMAGE_INDEX_BY_STEP_ID: Record<string, number | undefined> = {
  intention: 1,
  bismillah: 2,
  mains: 3,
  bouche: 4,
  nez: 5,
  visage: 6,
  bras: 7,
  tete: 8, // Oreilles incluses avec la tête selon certains décomptes
  pieds: 9,
};

export default function TutoWuduPage(): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);

  // Track repetitions done per step
  const [stepRepetitions, setStepRepetitions] = useState<Record<string, number>>(
    {}
  );

  // Progression basée sur la slide courante (1/total -> 100%)
  const slideProgressPercent = useMemo(() => {
    return Math.min(
      100,
      Math.max(
        0,
        Math.round(((currentSlideIndex + 1) / WUDU_STEPS.length) * 100)
      )
    );
  }, [currentSlideIndex]);

  const handleTick = (step: WuduStep) => {
    if (!step.repeatCount || step.repeatCount <= 0) return;
    setStepRepetitions((prev) => {
      const current = prev[step.id] ?? 0;
      const next = Math.min(step.repeatCount!, current + 1);
      return { ...prev, [step.id]: next };
    });
  };

  const handleResetCounts = () => setStepRepetitions({});

  const scrollToStep = (index: number) => {
    const el = document.getElementById(`wudu-step-${index}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Détecte la slide visible via IntersectionObserver
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const sections = Array.from(
      root.querySelectorAll<HTMLElement>("section[data-index]")
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idxStr = (entry.target as HTMLElement).dataset.index;
            const idx = idxStr ? parseInt(idxStr, 10) : 0;
            if (!Number.isNaN(idx)) setCurrentSlideIndex(idx);
          }
        });
      },
      { root, threshold: 0.6 }
    );

    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-screen w-full dark:bg-[var(--color-foreground)] dark:text-gray-100">
      {/* Dark overlay to further dim background on this page */}
      <div className="pointer-events-none absolute inset-0 bg-transparent dark:bg-black/50 transition-colors" />
      <div className="relative z-10 mx-auto flex h-full w-full max-w-6xl items-stretch gap-3 px-3 md:gap-6 md:px-6">
        {/* Side vertical progress bar (not overlapping) */}
        <aside className="flex h-full w-8 flex-col items-center justify-center sm:w-10 md:w-14">
          <div className="flex h-4/5 w-2 flex-col items-center justify-between">
            <div className="relative h-full w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 shadow-inner">
              <div
                className="absolute left-0 top-0 w-full bg-emerald-500 dark:bg-emerald-400 transition-all"
                style={{ height: `${slideProgressPercent}%` }}
              />
            </div>
            <div className="mt-2 text-center text-[10px] font-semibold text-gray-600 dark:text-gray-300">
              {slideProgressPercent}%
            </div>
          </div>
        </aside>

        {/* Slides container with vertical snap */}
        <div
          ref={containerRef}
          className="h-full flex-1 snap-y snap-mandatory overflow-y-scroll"
          aria-label="Tutoriel des ablutions, fais défiler vers le bas pour avancer"
        >
        {WUDU_STEPS.map((step, idx) => (
          <section
            id={`wudu-step-${idx}`}
            key={step.id}
            data-index={idx}
            className="relative flex h-screen snap-start items-center justify-center px-4 py-6 md:py-10"
            aria-labelledby={`wudu-step-title-${idx}`}
          >
            <div className="mx-auto w-full max-w-3xl">
              <div className="max-h-[82vh] overflow-auto rounded-3xl border border-emerald-100 dark:border-emerald-900/40 bg-white/80 dark:bg-gray-900/70 p-5 shadow-xl backdrop-blur-sm md:max-h-[78vh] md:p-8">
                {/* Image d'illustration si disponible */}
                {IMAGE_INDEX_BY_STEP_ID[step.id] ? (
                  <div className="relative mx-auto mt-2 w-full max-w-md overflow-hidden rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 md:mt-0">
                    <div className="relative aspect-[3/4] w-full">
                      <Image
                        src={`/wudu_step/${IMAGE_INDEX_BY_STEP_ID[step.id]}.png`}
                        alt={`Illustration: ${step.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 600px"
                        className="object-contain"
                        priority={idx <= 2}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="mt-4 flex items-center gap-4 md:mt-6">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-4xl md:h-20 md:w-20 md:text-5xl">
                    <span role="img" aria-label="illustration de l’étape">
                      {step.emoji}
                    </span>
                  </div>
                  <h2
                    id={`wudu-step-title-${idx}`}
                    className="text-balance text-xl font-bold text-gray-900 dark:text-gray-100 md:text-2xl"
                  >
                    {step.title}
                  </h2>
                </div>

                <p className="mt-3 text-pretty text-base leading-relaxed text-gray-700 dark:text-gray-200 md:mt-4 md:text-lg">
                  {step.description}
                </p>

                {step.repeatCount && step.repeatCount > 0 ? (
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-600">
                      Répéter: {step.repeatCount}×
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {Array.from({ length: step.repeatCount }).map((_, i) => {
                        const filled = (stepRepetitions[step.id] ?? 0) > i;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleTick(step)}
                            className={
                              "h-10 w-10 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 md:h-12 md:w-12 " +
                              (filled
                                ? "bg-emerald-500 text-white shadow"
                                : "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200")
                            }
                            aria-label={`Marquer la répétition ${i + 1} sur ${
                              step.repeatCount
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
                      {stepRepetitions[step.id] === step.repeatCount ? (
                        <span>
                          ✅ Bien joué ! Tu as complété cette étape.
                        </span>
                      ) : (
                        <span>
                          Appuie sur les pastilles pour compter: {" "}
                          <strong>
                            {Math.min(stepRepetitions[step.id] ?? 0, step.repeatCount)}
                          </strong>
                          /{step.repeatCount}
                        </span>
                      )}
                    </div>

                    {stepRepetitions[step.id] ? (
                      <button
                        type="button"
                        onClick={handleResetCounts}
                        className="mt-4 rounded-full bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 transition hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        Réinitialiser les compteurs
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {/* Navigation buttons */}
                <div className="mt-8 flex items-center justify-between">
                  {idx > 0 ? (
                    <button
                      type="button"
                      onClick={() => scrollToStep(idx - 1)}
                      className="rounded-full bg-white dark:bg-gray-900 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-100 ring-1 ring-gray-200 dark:ring-gray-700 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      ← Précédent
                    </button>
                  ) : (
                    <span />
                  )}

                  {idx < WUDU_STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => scrollToStep(idx + 1)}
                      className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-emerald-600"
                    >
                      Suivant ↓
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResetCounts}
                      className="rounded-full bg-emerald-100 dark:bg-emerald-900/40 px-5 py-2 text-sm font-semibold text-emerald-900 dark:text-emerald-100 ring-1 ring-emerald-200 dark:ring-emerald-800 transition hover:bg-emerald-200 dark:hover:bg-emerald-900/60"
                    >
                      Recommencer
                    </button>
                  )}
                </div>
              </div>

              {/* Slide hint arrow (only on intro) */}
              {idx === 0 ? (
                <div className="pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
                  <p className="text-sm text-gray-600 dark:text-gray-300">Glisse vers le bas</p>
                  <div className="mt-2 animate-bounce text-2xl">⬇️</div>
                </div>
              ) : null}
            </div>
          </section>
        ))}
        </div>
      </div>
    </div>
  );
}


