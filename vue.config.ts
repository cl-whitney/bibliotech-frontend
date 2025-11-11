import { defineConfig } from '@vue/cli-service'

export default defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
    ? '/NOM_DU_REPO/' // Remplace par le nom de ton repo GitHub
    : '/'
})
