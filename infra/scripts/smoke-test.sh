#!/usr/bin/env bash
# prod 블루그린 배포 전, staging distribution이 실제로 정상 서빙되는지 확인.
# 통과해야만 deploy-prod.yml이 승격(promote)을 진행한다.
set -euo pipefail

TARGET_HOST="${1:?사용법: smoke-test.sh <staging distribution 도메인> [dist 디렉토리]}"
DIST_DIR="${2:-dist}"
BASE_URL="https://${TARGET_HOST}"
STAGING_HEADER="aws-cf-cd-staging: true"

fail() {
  echo "❌ $1" >&2
  exit 1
}

echo "스모크 테스트 대상: ${BASE_URL}"

# 1. 루트 페이지
status=$(curl -s -o /tmp/smoke-root.html -w '%{http_code}' -H "${STAGING_HEADER}" "${BASE_URL}/")
[ "$status" = "200" ] || fail "루트(/) 응답 코드 ${status} (기대: 200)"
grep -q '<div id="root">' /tmp/smoke-root.html || fail "루트(/) 응답에 React 마운트 포인트(#root)가 없음"
echo "✅ 루트(/) 200"

# 2. SPA 클라이언트 라우트 폴백 — CloudFront 커스텀 에러 응답(403/404→index.html)이 제대로 붙었는지 확인
status=$(curl -s -o /tmp/smoke-route.html -w '%{http_code}' -H "${STAGING_HEADER}" "${BASE_URL}/dashboard")
[ "$status" = "200" ] || fail "클라이언트 라우트(/dashboard) 응답 코드 ${status} (기대: 200)"
grep -q '<div id="root">' /tmp/smoke-route.html || fail "클라이언트 라우트(/dashboard) 응답이 index.html 폴백이 아님"
echo "✅ 클라이언트 라우트(/dashboard) SPA 폴백 확인"

# 3. index.html이 참조하는 정적 자산 1개가 실제로 로드되는지
# `|| true`로 파이프라인 실패를 흡수 — grep이 매치를 못 찾아도(exit 1) set -e가
# 여기서 바로 죽지 않고 다음 줄의 -n 검사에서 의도한 fail() 메시지로 이어지게 한다.
asset_path=$(grep -oE 'src="/assets/[^"]+\.js"' "${DIST_DIR}/index.html" | head -1 | sed -E 's/src="(.*)"/\1/' || true)
[ -n "$asset_path" ] || fail "${DIST_DIR}/index.html에서 정적 자산 경로를 찾지 못함"
response=$(curl -s -o /dev/null -w '%{http_code} %{content_type}' -H "${STAGING_HEADER}" "${BASE_URL}${asset_path}")
status="${response%% *}"
content_type="${response#* }"
[ "$status" = "200" ] || fail "정적 자산(${asset_path}) 응답 코드 ${status} (기대: 200)"
# Content-Type까지 확인 — CloudFront의 SPA 폴백(403/404→index.html)도 200을 주므로
# 상태 코드만으론 "자산이 실제로 있음"과 "없어서 폴백 HTML이 온 것"을 구분 못 한다.
case "$content_type" in
  *javascript*) ;;
  *) fail "정적 자산(${asset_path}) Content-Type이 예상과 다름 (실제: ${content_type}) — 자산이 없어서 SPA 폴백이 대신 응답했을 가능성" ;;
esac
echo "✅ 정적 자산(${asset_path}) 200 (${content_type})"

echo "스모크 테스트 통과"
