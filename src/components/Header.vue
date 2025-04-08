<template>
  <header class="header-wrapper">
    <div class="header">
      <router-link to="/chat" class="logo">JLPT Mate</router-link>
      <div class="menu">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            viewBox="0 0 24 24"
            fill="white"
        >
          <path
              d="M3 6h18M3 12h18M3 18h18"
              stroke="white"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
  height: 70px;
}

.header {
  width: 100%;
  max-width: 500px;
  background-color: #5869ff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
}

.logo {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.icon {
  width: 30px;
  height: 30px;
}
</style>
