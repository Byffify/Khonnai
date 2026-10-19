import { createRoot } from 'react-dom/client'
import { ShopLoading } from '../src/ShopLoading'
import '../src/index.css'

const english = new URLSearchParams(window.location.search).get('lang') === 'en'
document.documentElement.lang = english ? 'en' : 'th'
const root = document.getElementById('root')
if (root) createRoot(root).render(<>
  <ShopLoading label={english ? 'Opening Khonnai…' : 'กำลังเปิดคนใน…'} />
  <aside style={{ position: 'fixed', bottom: 20, insetInline: 20, textAlign: 'center', fontSize: 12, color: '#646464' }}>
    {english ? 'Motion preview only · no shop connection' : 'ตัวอย่างแอนิเมชัน · ไม่มีการเชื่อมต่อข้อมูลร้าน'}
  </aside>
</>)
