import { getToolContentPackage } from '@/lib/content/toolContent';
import { generateBlueprint } from '@/lib/geometry/generateBlueprint';
import { initialFormState, type ToolShellProps } from './controlTypes';
import { BlueprintWorkspace } from './BlueprintWorkspace';
import { ToolContentSection } from './ToolContentSection';

function normalizeInitialState(props: ToolShellProps) {
  const initial = initialFormState(props);
  return {
    shape: initial.shape,
    inputMode: initial.inputMode,
    diameter: initial.diameter,
    radius: initial.radius,
    width: props.initialWidth || initial.width,
    height: props.initialHeight || initial.height,
    fillMode: initial.fillMode,
    solidMode: initial.solidMode,
    thickness: initial.thickness,
    shellThickness: initial.shellThickness,
    capHeight: initial.capHeight,
    buildDirection: initial.buildDirection,
    domeHalf: initial.domeHalf
  };
}

export function ToolShell(props: ToolShellProps) {
  const initialState = normalizeInitialState(props);
  const initialResult = generateBlueprint(initialState);
  const contentPackage = getToolContentPackage(props.contentKey, initialState.shape);
  const introTitle = props.title || 'Minecraft Circle Generator & Blueprint Builder';

  return (
    <section className="builder-shell" aria-label={introTitle}>
      <header className="builder-intro">
        <div>
          <span className="eyebrow">Minecraft blueprint generator</span>
          <h1>{introTitle}</h1>
          <p>{contentPackage.intro} The blueprint updates instantly as you edit values.</p>
        </div>
        <nav className="builder-intro-actions" aria-label="Core blueprint tools">
          <a className="intro-chip" href="/minecraft-circle-generator">
            Circle
          </a>
          <a className="intro-chip" href="/minecraft-oval-generator">
            Oval
          </a>
          <a className="intro-chip" href="/minecraft-sphere-generator">
            Sphere
          </a>
          <a className="intro-chip" href="/minecraft-dome-generator">
            Dome
          </a>
        </nav>
      </header>
      <BlueprintWorkspace {...props} initialResult={initialResult} />
      <ToolContentSection contentPackage={contentPackage} />
    </section>
  );
}
