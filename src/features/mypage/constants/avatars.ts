// 백엔드가 호스팅하는 기본 아바타 10종. 선택 모달과 실제 저장/표시가 항상 같은 이미지를
// 가리키도록, 프론트 로컬 에셋을 쓰지 않고 이 URL 목록 하나만 단일 소스로 사용한다.
const AVATAR_CDN_BASE_URL = 'https://d23atcj01dr3z1.cloudfront.net/default-avatars';
const AVATAR_COUNT = 10;

export const DEFAULT_AVATARS = Array.from({ length: AVATAR_COUNT }, (_, index) => {
    const id = `avatar-${index + 1}`;
    return { id, url: `${AVATAR_CDN_BASE_URL}/${id}.png` };
});

export const AVATAR_ID_TO_URL: Record<string, string> = Object.fromEntries(
    DEFAULT_AVATARS.map(({ id, url }) => [id, url]),
);

export const AVATAR_ID_BY_URL: Record<string, string> = Object.fromEntries(
    DEFAULT_AVATARS.map(({ id, url }) => [url, id]),
);
