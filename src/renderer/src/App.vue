<script setup lang="ts">
import Versions from './components/Versions.vue'
import { ref } from 'vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

const imageSrc = ref('')
const selectImage = async () => {
  // imageSrc.value = await window.electronAPI2.selectImage()
  imageSrc.value = await window.api.selectImage()
  console.log('select-image result:' + imageSrc.value)
  // const image = document.getElementById('image')
  // if (image) {
  //   image.src = result
  // }
}
</script>

<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">Powered by electron-vite</div>
  <div class="text">
    Build an Electron app with
    <span class="vue">Vue</span>
    and
    <span class="ts">TypeScript</span>
  </div>
  <p class="tip">Please try pressing <code>F12</code> to open the devTool</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
    <div>
      <h1>打开一张图片来展示：</h1>
      <button id="select-image" @click="selectImage">选择图片</button>
      <img id="image" :src="imageSrc" alt="Selected Image" style="max-width: 100%; height: auto" />
    </div>
  </div>
  <Versions />
</template>
