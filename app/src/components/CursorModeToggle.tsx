type CursorModeToggleProps = {
  nativeCursor: boolean;
  onNativeCursorChange: (nativeCursor: boolean) => void;
};

export function CursorModeToggle({ nativeCursor, onNativeCursorChange }: CursorModeToggleProps) {
  const actionLabel = nativeCursor ? "Use smooth morphing cursor" : "Use native browser cursor";

  return (
    <button
      className="cursor-mode-toggle"
      type="button"
      data-native={nativeCursor ? "true" : "false"}
      aria-pressed={nativeCursor}
      aria-label={actionLabel}
      title={actionLabel}
      onClick={() => onNativeCursorChange(!nativeCursor)}
    >
      <span className="cursor-mode-toggle-label">Cursor: {nativeCursor ? "Native" : "Smooth"}</span>
      <span className="cursor-mode-toggle-switch" aria-hidden="true"><span /></span>
    </button>
  );
}
