/** 아직 구현되지 않은 화면용 임시 페이지. 도메인 구현 완료 시 실제 페이지로 교체하세요. */
export const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="flex h-64 items-center justify-center rounded-xl bg-white shadow-card">
    <p className="text-gray-400">{title} 페이지 (개발 예정)</p>
  </div>
);
