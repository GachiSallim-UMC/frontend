interface ConnectionStatusBadgeProps {
  isConnected?: boolean;
}

export const ConnectionStatusBadge = ({ isConnected = true }: ConnectionStatusBadgeProps) => {
  return (
    <div className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full bg-white px-[18px] py-2 shadow-card">
      <span className={isConnected ? 'text-green-500' : 'text-gray-400'}>●</span>
      <span className="text-caption text-gray-600">
        {isConnected ? 'WebSocket 연결됨' : 'WebSocket 연결 끊김'}
      </span>
    </div>
  );
};
