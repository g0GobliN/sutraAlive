export function Logo({ size = 24 }: { size?: number }) {
  return (
    <span className="logo" style={{ width: size, height: size }} aria-hidden="true">
      <img src="/assets/favicon.png" alt="" width={size} height={size} decoding="async" />
    </span>
  );
}
