interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface FeatureListProps {
  features: Feature[];
  className?: string;
}

export default function FeatureList({
  features,
  className = "",
}: FeatureListProps) {
  return (
    <div className={`FeatureList grid gap-4 ${className}`}>
      {features.map((feature, index) => (
        <div
          key={index}
          className="FeatureItem rounded-2xl bg-stone-800/70 border border-white/5 p-4 sm:p-5 hover:bg-stone-800/90 transition"
        >
          <div className="flex items-start gap-4">
            <div className="FeatureIcon h-9 w-9 shrink-0 rounded-xl bg-po1/20 grid place-items-center text-py1">
              {feature.icon}
            </div>
            <div>
              <p className="FeatureTitle font-semibold text-white">
                {feature.title}
              </p>
              <p className="FeatureText text-sm text-white/70">
                {feature.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
