/** 활동 로그 문구에서 작성자 이름과 `'따옴표'`로 감싼 구간을 굵게 렌더링합니다. */
export const renderTimelineText = (actorName: string, description: string) => {
  const parts = description.split(/('[^']*')/g).map((part, i) =>
    part.startsWith("'") && part.endsWith("'") ? (
      <b key={i} className="font-bold text-gray-900">
        {part.slice(1, -1)}
      </b>
    ) : (
      <span key={i}>{part}</span>
    ),
  );

  return (
    <>
      <b className="font-bold text-gray-900">{actorName}</b>
      <span> 님이 </span>
      {parts}
    </>
  );
};
