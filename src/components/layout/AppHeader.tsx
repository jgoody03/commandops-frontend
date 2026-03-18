export function AppHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            CommandOps
          </div>
          <div className="text-lg font-semibold text-gray-900">
            Operations Platform
          </div>
        </div>

        <div className="text-sm text-gray-500">Command Station Hub</div>
      </div>
    </header>
  );
}