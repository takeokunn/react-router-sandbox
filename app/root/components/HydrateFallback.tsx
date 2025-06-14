export function HydrateFallback() {
  return (
    <div id="loading-splash" data-testid="loading-splash">
      <div id="loading-splash-spinner" data-testid="loading-splash-spinner" />
      <p>Loading, please wait...</p>
    </div>
  );
}
