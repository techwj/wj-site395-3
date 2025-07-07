<template>
  <div class="min-h-screen flex flex-col">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <NuxtLink to="/" class="flex items-center">
              <span class="text-xl font-bold text-gray-800 truncate max-w-[200px] sm:max-w-full">{{ title }} Info</span>
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4 font-bold">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">Home</NuxtLink>
            <NuxtLink to="/categories/all" class="text-gray-600 hover:text-gray-900">Categories</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content Area -->
    <main class="flex-grow" v-click-capture="handleMainClick">
      <div @click.stop class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col items-center space-y-2">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">Home</NuxtLink>
            <NuxtLink to="/agreement" class="text-gray-600 hover:text-gray-900">User Agreement</NuxtLink>
          </div>
          <p class="text-center text-gray-600">© 2025 {{ title }}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>


<script setup>
const router = useRouter();

const config = useAppConfig()
let title = config.head?.title || ''


const toHome = () => {
  router.push('/');
}

const handleMainClick = (e) => {
  router.push('/categories/all')
}
</script>
