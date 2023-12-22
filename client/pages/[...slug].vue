<template>
  <main class="max-width bg-white">
    <q-layout class="column">
      <q-header bordered style="position: sticky">
        <q-toolbar>
          <q-btn
            outline
            dense
            @click="navigateTo('/', { replace: true })"
            class="q-px-md"
            >🏀 농구영상 연계 기록플랫폼
            <span class="text-orange-5 q-mx-sm">'컷인'</span>으로 이동하기
          </q-btn>
        </q-toolbar>
      </q-header>
      <ContentDoc class="q-pa-md" style="flex: 1" />
    </q-layout>
  </main>
</template>
<style lang="scss">
main {
  overflow-x: hidden;
  overflow-y: auto;
  height: 100vh;
  border: 0.5px solid #eee;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: #555;
  }

  h1 {
    font-size: 24px;
    border-bottom: 3px solid $orange-5;
    color: $orange-5;
  }

  h2 {
    border-bottom: 2px solid $orange-5;
    color: $orange-5;
  }

  h3 {
    font-weight: 600;
  }

  h4 {
    font-size: 12px;
    font-weight: 400;
    line-height: 12px;
    margin: 0;
    display: inline-block;
  }

  p {
    margin: 8px 0 16px 0;
    letter-spacing: -0.5px;
  }

  ul,
  ol {
    margin: 8px 0 16px 0;
    padding: 0 0 0 20px;
  }

  a {
    color: $orange-5;
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a:hover {
    color: $orange-8;
  }

  code {
    font-family: "Consolas", "Courier New", monospace;
    background-color: #eee;
    padding: 3px 6px;
    border: 1px solid #ccc;
    border-radius: 3px;
    color: #333;
  }

  pre {
    background-color: #eee;
    padding: 15px;
    border: 1px solid #eee;
    overflow-x: auto;
    border-radius: 5px;
  }

  blockquote {
    border-left: 4px solid $orange-5;
    padding: 0 12px;
    margin: 8px 0;
    color: #555;
  }

  /* 표 스타일 */

  table {
    border-collapse: collapse;
    width: 100%;
    margin: 8px 0 16px 0;
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 4px;
    text-align: left;
  }

  th {
    background-color: $orange-5;
    color: #fff;
  }

  /* 이미지 스타일 */

  img {
    max-width: 100%;
    height: auto;
    border: 1px solid #bdc3c7;
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* 코드 블록 스타일 */

  pre code {
    display: block;
    padding: 10px;
    overflow-x: auto;
  }

  /* 태그 스타일 */

  .tag {
    background-color: $dark;
    color: #fff;
    padding: 5px 10px;
    border-radius: 5px;
    margin-right: 8px;
    letter-spacing: -1px;
  }

  .hl {
    background-color: $orange-6;
    color: white;
    padding: 2px 4px;
    line-height: 24px;
  }

  /* 블로그 포스트 예시에서 사용할 태그 스타일 */

  .post-tags {
    margin-top: 20px;
  }

  /* 미디어 쿼리를 사용하여 모바일 환경에 대응 */

  @media screen and (max-width: 600px) {
    body {
      margin: 15px;
    }
  }
}
</style>
