import { build } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
const root=path.resolve('.scratch/landing-v2-prototypes/hero-runtime')
await build({configFile:false,root,publicDir:false,plugins:[react()],define:{'process.env.NODE_ENV':'"production"'},build:{outDir:path.join(root,'dist'),emptyOutDir:true,lib:{entry:path.join(root,'hero.jsx'),name:'KhonnaiScrollHero',formats:['iife'],fileName:()=> 'hero.js',cssFileName:'hero'},target:'es2022'}})
