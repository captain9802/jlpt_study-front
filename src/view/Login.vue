<template>
  <div class="home-container">
    <transition name="float-up">
      <div v-if="showMain" class="main-content">
        <img src="/악어.png" alt="main" class="main-image" />
        <h1 class="main-title">
          JLPT MATE와 함께<br />
          쉬운 일본어 공부
        </h1>
        <button class="kakao-button" @click="login">
          <img
              src="/kakao.png"
              alt="kakao-login"
              class="kakao-img"
              :class="{ visible: showButton }"
          />
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { kakaoLogin } from '@/api/auth'

const router = useRouter()
const KAKAO_KEY = '0a4162b5cdd773131975020c95f4f723'

// ✅ showMain, showButton 추가
const showMain = ref(false)
const showButton = ref(false)

const login = () => {
  if (!window.Kakao) return alert('Kakao SDK가 로딩되지 않았습니다.')

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(KAKAO_KEY)
  }

  window.Kakao.Auth.login({
    scope: 'profile_nickname, account_email',
    success(authObj) {
      const profileImg = Math.floor(Math.random() * 5) + 1

      kakaoLogin({ accessToken: authObj.access_token, profileImg })
          .then(({ token }) => {
            sessionStorage.setItem('jlpt_token', token)
            router.push('/chat')
          })
          .catch((err) => {
            console.error('❌ 서버 로그인 실패:', err.response?.data || err.message)
            alert('로그인에 실패했습니다.')
          })
    },
    fail(err) {
      console.error('❌ 카카오 로그인 실패:', err)
    },
  })
}

onMounted(() => {
  setTimeout(() => {
    showMain.value = true
  }, 200)
  setTimeout(() => {
    showButton.value = true
  }, 1000)
})
</script>

<style scoped>
.home-container {
  background-color: #5869FF;
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
  height: 100dvh;
  padding: 40px 20px;
  box-sizing: border-box;

  display: flex;
  align-items: center;
  justify-content: center;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  text-align: center;
}

@keyframes floatUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.float-up-enter-active {
  animation: floatUp 0.8s ease-out;
}


.main-image {
  width: 40%;
  min-width: 80px;
  max-width: 160px;
  height: auto;
}

.main-title {
  color: white;
  font-size: clamp(1.5rem, 5vw, 2rem);
  line-height: 1.4;
  margin: 0;
}

.kakao-button {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  width: 100%;
  max-width: 180px;
  display: flex;
  justify-content: center;
}

.kakao-img {
  width: 100%;
  height: auto;
  opacity: 0;
  transform: scale(0.95);
  transition: all 0.6s ease;
}

.kakao-img.visible {
  opacity: 1;
  transform: scale(1);
}

.kakao-button:hover .kakao-img.visible {
  transform: scale(1.05);
}
</style>
