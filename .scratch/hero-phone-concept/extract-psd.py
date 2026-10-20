"""Extract the original PSD's raster layers without flattening hand/screen masks."""
from pathlib import Path
from PIL import Image, ImageChops
import struct, json, zlib, sys
sys.stdout.reconfigure(encoding='utf-8')

SOURCE = Path(r'C:\Users\Fiatk\Downloads\Free  iPhone 18 Pro Mockup Held at an Angle\Free  iPhone 18 Pro Mockup Held at an Angle\Photoshop\Scene #1.psd')
OUT = Path('outputs/hero-phone-concept/assets')
OUT.mkdir(parents=True, exist_ok=True)
b = SOURCE.read_bytes()
def u16(o): return struct.unpack_from('>H', b, o)[0]
def u32(o): return struct.unpack_from('>I', b, o)[0]
o = 26
o += 4 + u32(o)
o += 4 + u32(o)
o += 4
info = u32(o)
o += 4
count = abs(struct.unpack_from('>h', b, o)[0]); o += 2
layers = []
for i in range(count):
    top, left, bottom, right = struct.unpack_from('>iiii', b, o); o += 16
    channels = []
    c = u16(o); o += 2
    for j in range(c):
        cid, size = struct.unpack_from('>hI', b, o); o += 6
        channels.append((cid, size))
    blend = b[o+4:o+8].decode(); clip = b[o+9]; flags = b[o+10]; o += 12
    size = u32(o); o += 4; end = o + size
    mask_size = u32(o); o += 4
    mask = None
    if mask_size:
        mt, ml, mb, mr = struct.unpack_from('>iiii', b, o)
        mask = dict(top=mt,left=ml,width=mr-ml,height=mb-mt,default=b[o+16],flags=b[o+17])
    o += mask_size
    o += 4 + u32(o)
    n = b[o]; name = b[o+1:o+1+n].decode('utf8', errors='replace'); o += ((n+1+3)//4)*4
    while o+12 <= end:
        key = b[o+4:o+8]; n = u32(o+8); o += 12
        if key in (b'vmsk',b'vsms'):
            (OUT/f'vector-mask-{i}.bin').write_bytes(b[o:o+n])
        if key in (b'vmsk',b'vsms',b'SoLd',b'PlLd'): print('tag',i,key,n,flush=True)
        if key == b'luni': name = b[o+4:o+4+u32(o)*2].decode('utf-16-be')
        o += n + n%2
    o = end
    layers.append(dict(name=name, left=left, top=top, width=right-left, height=bottom-top, channels=channels, blend=blend, clip=clip, flags=flags,mask=mask))

def unpack(data):
    out=bytearray(); p=0
    while p<len(data):
        n=data[p]; p+=1
        if n<128: out.extend(data[p:p+n+1]); p+=n+1
        elif n>128: out.extend(bytes([data[p]])*(257-n)); p+=1
    return bytes(out)

for i, layer in enumerate(layers):
    w, h = layer['width'], layer['height']; decoded={}
    for cid, size in layer['channels']:
        start=o; compression=u16(o); o+=2
        if cid >= -2:
            cw,ch=(layer['mask']['width'],layer['mask']['height']) if cid==-2 else (w,h)
            if compression == 0: raw=b[o:start+size]
            elif compression == 1:
                row_lengths=struct.unpack_from('>'+str(ch)+'H', b, o); o+=ch*2
                rows=[]
                for length in row_lengths: rows.append(unpack(b[o:o+length])); o+=length
                raw=b''.join(rows)
            elif compression == 2: raw=zlib.decompress(b[o:start+size])
            else: raise ValueError(f'Unsupported compression {compression}')
            assert len(raw)==cw*ch, (layer['name'], cid, len(raw), cw*ch)
            decoded[cid]=Image.frombytes('L',(cw,ch),raw)
        o=start+size
    blank=Image.new('L',(w,h),255)
    rgba=Image.merge('RGBA',tuple(decoded.get(cid,blank) for cid in (0,1,2,-1)))
    if i==3:
        placement=Image.new('L',(3680,2760),0)
        placement.paste(rgba.getchannel('A'),(layer['left'],layer['top']))
        placement.save(OUT/'placement-alpha.png')
    if -2 in decoded and not (layer['mask']['flags'] & 2):
        m=layer['mask']; mask=Image.new('L',(w,h),m['default'])
        mask.paste(decoded[-2],(m['left']-layer['left'],m['top']-layer['top']))
        if m['flags'] & 4: mask=ImageChops.invert(mask)
        rgba.putalpha(ImageChops.multiply(rgba.getchannel('A'),mask))
    canvas=Image.new('RGBA',(3680,2760))
    canvas.paste(rgba,(layer['left'],layer['top']))
    file=f'psd-layer-{i}.png'; canvas.save(OUT/file)
    layer['file']=file
    print(i,layer['name'],layer['blend'],'clipping',layer['clip'],'mask',layer['mask'],flush=True)
(OUT/'psd-layers.json').write_text(json.dumps(layers,ensure_ascii=False,indent=2),encoding='utf8')
