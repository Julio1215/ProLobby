// Skeleton loader universal
export function Skeleton({ className = '', style = {} }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={style}
    />
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-5 flex flex-col gap-4">
      <Skeleton style={{ height: '160px', borderRadius: '12px' }} />
      <div className="flex flex-col gap-2">
        <Skeleton style={{ height: '14px', width: '70%' }} />
        <Skeleton style={{ height: '14px', width: '45%' }} />
      </div>
      <div className="flex gap-2">
        <Skeleton style={{ height: '24px', width: '64px', borderRadius: '99px' }} />
        <Skeleton style={{ height: '24px', width: '80px', borderRadius: '99px' }} />
      </div>
    </div>
  )
}

export function SkeletonNewsCard() {
  return (
    <div className="card overflow-hidden flex flex-col">
      <Skeleton style={{ height: '160px', borderRadius: '0' }} />
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between">
          <Skeleton style={{ height: '10px', width: '60px' }} />
          <Skeleton style={{ height: '10px', width: '40px' }} />
        </div>
        <Skeleton style={{ height: '14px', width: '90%' }} />
        <Skeleton style={{ height: '14px', width: '75%' }} />
        <Skeleton style={{ height: '12px', width: '50%', marginTop: '4px' }} />
      </div>
    </div>
  )
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          style={{
            height: '14px',
            width: i === lines - 1 ? '65%' : '100%',
          }}
        />
      ))}
    </div>
  )
}

export default Skeleton
