"""Deterministic 2D PSD compositor. Rerender with the original phone/hand pixels."""
from pathlib import Path
from PIL import Image, ImageChops, ImageDraw, ImageFont
import numpy as np
import sys, json, math, subprocess, os
sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'outputs/hero-phone-concept'
ASSETS=OUT/'assets'
SIDE=1280
FPS=30
DURATION=6
SIZE=(3680,2760)

def perspective_coefficients(src, dst):
    rows=[]; values=[]
    for (x,y),(u,v) in zip(dst,src):
        rows.extend([[x,y,1,0,0,0,-u*x,-u*y],[0,0,0,x,y,1,-v*x,-v*y]])
        values.extend([u,v])
    return np.linalg.solve(np.array(rows),np.array(values))

def texture(file):
    content=Image.open(ASSETS/file).convert('RGB').resize((860,1750),Image.Resampling.LANCZOS)
    im=Image.new('RGB',(860,1864),'white'); im.paste(content,(0,94))
    draw=ImageDraw.Draw(im)
    font=ImageFont.truetype('C:/Windows/Fonts/arialbd.ttf',25)
    draw.text((60,38),'9:41',fill='#151515',font=font)
    draw.rounded_rectangle((330,23,530,79),28,fill='#08090b')
    draw.ellipse((489,40,513,64),fill='#0f1525')
    for j in range(4): draw.rounded_rectangle((702+j*10,54-j*5,708+j*10,65),2,fill='#151515')
    draw.rounded_rectangle((759,40,807,65),5,outline='#151515',width=3)
    draw.rounded_rectangle((765,46,796,59),2,fill='#151515')
    draw.rectangle((809,47,813,57),fill='#151515')
    draw.rounded_rectangle((310,1847,550,1855),4,fill='#101010')
    return im

scene=Image.open(ASSETS/'psd-layer-1.png').convert('RGBA')
screen_mask=Image.open(ASSETS/'psd-layer-2.png').getchannel('A')
raw=Image.open(ASSETS/'placement-alpha.png')
ys,xs=np.where(np.asarray(raw)>220)
directions=[xs+ys, -xs+ys, -xs-ys, xs-ys]
quad=[(int(xs[np.argmin(v)]),int(ys[np.argmin(v)])) for v in directions]
source=[(0,0),(860,0),(860,1864),(0,1864)]
coeff=perspective_coefficients(source,quad)
def scene_with(file):
    screen=texture(file).transform(SIZE,Image.Transform.PERSPECTIVE,coeff,Image.Resampling.BICUBIC).convert('RGBA')
    screen.putalpha(screen_mask)
    return Image.alpha_composite(scene,screen)
logo=scene_with('logo-screen.png')
app=scene_with('app-screen.png')

def smooth(v):
    x=max(0,min(1,v)); return x*x*(3-2*x)
def frame(t):
    enter=1-(1-min(t/1.0,1))**3
    approach=smooth((t-1)/1.5)
    settle=smooth((t-3.5)/1)
    screen=smooth((t-2.5)/1)
    scale=0.449+0.027*approach+0.008*settle
    angle=math.radians(3.0*(1-approach)-0.7*settle)
    dx=190*(1-enter)-10*settle; dy=235*(1-enter)-8*settle
    # Whole-scene transform keeps the original fingers, bezel and inserted screen locked together.
    cx,cy=1900,1450; ox,oy=700+dx,745+dy
    c,s=math.cos(angle)/scale,math.sin(angle)/scale
    affine=(c,s,cx-c*ox-s*oy,-s,c,cy+s*ox-c*oy)
    base=Image.blend(logo,app,screen) if 0<screen<1 else (app if screen>=1 else logo)
    transformed=base.transform((SIDE,SIDE),Image.Transform.AFFINE,affine,Image.Resampling.BICUBIC)
    result=Image.new('RGBA',(SIDE,SIDE),'white')
    result.alpha_composite(transformed)
    return result.convert('RGB')

for t in [0,0.5,1.5,2.5,3,3.5,4.5,5.9666667]:
    frame(t).save(ASSETS/f'composite-{t:g}.jpg',quality=95)
frame(6).save(OUT/'poster.png')
frame(6).save(OUT/'poster.webp',quality=92)
(OUT/'render-manifest.json').write_text(json.dumps(dict(duration=DURATION,fps=FPS,width=SIDE,height=SIDE,frames=FPS*DURATION,screenQuad=quad,source='Original supplied PSD Scene/Mask + real app capture',motion='2D whole-scene affine transform; logo-to-app crossfade; final hold 4.5-6 seconds',audio=False),indent=2),encoding='utf8')
print('Poster and compositor checkpoints ready; screen quadrilateral:',quad,flush=True)

if '--stills' not in sys.argv:
    sys.path.insert(0,str(ROOT/'.scratch/hero-phone-concept/python'))
    import imageio_ffmpeg
    ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
    args=[ffmpeg,'-y','-hide_banner','-loglevel','error','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{SIDE}x{SIDE}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'hero-phone.mp4')]
    encoder=subprocess.Popen(args,stdin=subprocess.PIPE)
    for n in range(FPS*DURATION):
        encoder.stdin.write(frame(n/FPS).tobytes())
        if n%30==0: print(f'Render {n}/{FPS*DURATION}',flush=True)
    encoder.stdin.close()
    if encoder.wait()!=0: raise RuntimeError('MP4 encoding failed')
    subprocess.run([ffmpeg,'-y','-hide_banner','-loglevel','error','-i',str(OUT/'hero-phone.mp4'),'-an','-c:v','libvpx-vp9','-crf','28','-b:v','0','-row-mt','1','-pix_fmt','yuv420p',str(OUT/'hero-phone.webm')],check=True)
    # Decode final deliverables, independently of compositor output.
    for ext in ['mp4','webm']:
        for t in [0.5,2.5,3,3.5,5.9]:
            subprocess.run([ffmpeg,'-y','-hide_banner','-loglevel','error','-ss',str(t),'-i',str(OUT/f'hero-phone.{ext}'),'-frames:v','1',str(ASSETS/f'decoded-{ext}-{t:g}.png')],check=True)
    print('Encoded and decoded MP4 + WebM',flush=True)
