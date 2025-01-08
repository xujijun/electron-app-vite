<script setup lang="ts">
import Versions from './components/Versions.vue'
import { ref } from 'vue'

const ipcHandle = () => window.electron.ipcRenderer.send('ping')

const imageSrc = ref()
const selectImage = async () => {
  imageSrc.value = await window.api.selectImage()
  console.log('select-image result:' + imageSrc.value)
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
  <p class="tip">想打开调试界面，请按 <code>F12</code> </p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">Documentation</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">Send IPC</a>
    </div>
    <div>
      <h1>打开一张图片来展示：</h1>
      <button @click="selectImage">选择图片</button>
      <button @click="imageSrc=''">清空图片</button>
      <img id="image" :src="imageSrc" style="max-width: 100%; height: auto" v-if="imageSrc"/>
    </div>
  </div>
  <Versions />
</template>
